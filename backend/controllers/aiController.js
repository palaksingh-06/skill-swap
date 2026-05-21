const OpenAI = require("openai");
const mongoose = require("mongoose");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are Skill Buddy, an AI learning assistant inside SkillSwap — a gamified peer-to-peer skill exchange platform for students.

Your responsibilities:
- Help users find the right skills to learn or teach
- Answer DSA, programming, and technical doubts clearly
- Suggest learning roadmaps (e.g. "How do I learn React from scratch?")
- Help users prepare for their skill exchange sessions
- Explain gamification features (XP, badges, streaks, leaderboard)
- Keep responses concise, friendly, and student-focused

STRICT RULES — NEVER break these:
- NEVER invent or make up descriptions, bios, achievements, or course history
- NEVER say things like "has created popular courses" or "has a knack for" unless it is in the data
- ONLY suggest mentors from the exact list provided below
- Present mentors EXACTLY as listed — only use name and skills provided
- If no mentors match a skill, say so honestly
- If asked something unrelated to learning or skills, politely redirect
- Use simple language suitable for college students`;

// ✅ Safely handles both plain strings and ObjectIds
const getRealMentors = async () => {
  try {
    const mentors = await User.find({
      skillsTeach: { $exists: true, $not: { $size: 0 } },
    })
      .select("name tagline bio skillsTeach location")
      .limit(20)
      .lean();

    if (!mentors.length) {
      return "No mentors are currently available on the platform.";
    }

    // ✅ Separate ObjectIds from plain strings
    const allSkillIds = mentors
      .flatMap((m) => m.skillsTeach)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    // ✅ Fetch real skill names from DB
    const Skill = require("../models/Skill");
    const skillDocs = await Skill.find({ _id: { $in: allSkillIds } })
      .select("name")
      .lean();

    // ✅ id → name map
    const skillMap = {};
    skillDocs.forEach((s) => {
      skillMap[s._id.toString()] = s.name;
    });

    const mentorList = mentors.map((m) => {
      // ✅ Resolve each skill — ObjectId or plain string
      const skills = m.skillsTeach
        .map((id) => {
          const key = id?.toString();
          return mongoose.Types.ObjectId.isValid(key)
            ? skillMap[key] || "Unknown Skill"  // ObjectId → look up name
            : key;                               // plain string → use as is
        })
        .filter(Boolean)
        .join(", ");

      // ✅ Only include bio if it exists and is not empty
      const bio = m.bio?.trim()
        ? `| Bio: "${m.bio.trim()}"`
        : "";

      const location = m.location?.trim()
        ? `| Location: ${m.location}`
        : "";

      return `- Name: ${m.name} | Teaches: ${skills} ${bio} ${location}`;
    });

    return `REAL mentors on SkillSwap (use ONLY these, do not add anything extra):
${mentorList.join("\n")}

Important: Present only the name and skills listed above. Do not add any descriptions, achievements, or details that are not explicitly provided.`;

  } catch (err) {
    console.error("Failed to fetch mentors:", err.message);
    return "Mentor data is temporarily unavailable.";
  }
};

// POST /api/ai/chat
exports.chatbotReply = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Message cannot be empty" });
    }

    await ChatMessage.create({
      user: req.user._id,
      role: "user",
      text: message,
    });

    const isMentorQuery = /mentor|teacher|who can teach|suggest.*skill|find.*skill|learn from|recommend/i.test(message);
    const mentorContext = isMentorQuery ? await getRealMentors() : null;

    const fullSystemPrompt = mentorContext
      ? `${SYSTEM_PROMPT}\n\n${mentorContext}`
      : SYSTEM_PROMPT;

    const messages = [
      { role: "system", content: fullSystemPrompt },
      ...history.slice(-10).map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.text,
      })),
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    await ChatMessage.create({
      user: req.user._id,
      role: "bot",
      text: reply,
    });

    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({
      reply: "Sorry, I'm having trouble responding right now. Please try again!",
    });
  }
};

// GET /api/ai/history
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();

    res.json(messages);
  } catch (err) {
    console.error("Chat history error:", err.message);
    res.status(500).json({ msg: "Failed to fetch chat history" });
  }
};