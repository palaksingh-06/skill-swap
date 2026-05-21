
// const apiKey    = process.env.STREAM_API_KEY;
// const apiSecret = process.env.STREAM_API_SECRET;

// if (!apiKey || !apiSecret) {
//   throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing from .env");
// }

// const client = new StreamClient(apiKey, apiSecret);

// router.post("/token", (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ error: "userId is required" });
//   }

//   const token = client.generateUserToken({ user_id: userId });
//   res.json({ token });
// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { StreamClient } = require("@stream-io/node-sdk");

// const apiKey    = process.env.STREAM_API_KEY;
// const apiSecret = process.env.STREAM_API_SECRET;

// if (!apiKey || !apiSecret) {
//   throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing from .env");
// }

// const client = new StreamClient(apiKey, apiSecret);

// router.post("/token", (req, res) => {
//   const { userId } = req.body;
//   if (!userId) return res.status(400).json({ error: "userId is required" });

//   const token = client.generateUserToken({ user_id: userId });
//   res.json({ token });
// });

// // Returns list of transcriptions for a given call (called after call ends)
// router.get("/transcriptions/:roomId", async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const call = client.video.call("default", roomId);
//     const response = await call.listTranscriptions();
//     res.json({ transcriptions: response.transcriptions || [] });
//   } catch (err) {
//     console.error("Failed to fetch transcriptions:", err);
//     res.status(500).json({ error: "Failed to fetch transcriptions" });
//   }
// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { StreamClient } = require("@stream-io/node-sdk");

// const apiKey    = process.env.STREAM_API_KEY;
// const apiSecret = process.env.STREAM_API_SECRET;

// if (!apiKey || !apiSecret) {
//   throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing from .env");
// }

// const client = new StreamClient(apiKey, apiSecret);

// router.post("/token", (req, res) => {
//   const { userId } = req.body;
//   if (!userId) return res.status(400).json({ error: "userId is required" });

//   const token = client.generateUserToken({ user_id: userId });
//   res.json({ token });
// });

// // Returns list of transcriptions for a given call (called after call ends)
// router.get("/transcriptions/:roomId", async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const call = client.video.call("default", roomId);
//     const response = await call.listTranscriptions();
//     res.json({ transcriptions: response.transcriptions || [] });
//   } catch (err) {
//     console.error("Failed to fetch transcriptions:", err);
//     res.status(500).json({ error: "Failed to fetch transcriptions" });
//   }
// });

// module.exports = router;
// module.exports = router;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const router = express.Router();
const { StreamClient } = require("@stream-io/node-sdk");
const Groq = require("groq-sdk");
const axios = require("axios");

const apiKey    = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing from .env");
}

const client = new StreamClient(apiKey, apiSecret);
const streamClient = new StreamClient(apiKey, apiSecret);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── POST /api/video/token ────────────────────────────────
router.post("/token", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const token = streamClient.generateUserToken({ user_id: userId });
  res.json({ token });
});

// ─── GET /api/video/transcriptions/:roomId ────────────────
router.get("/transcriptions/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const call = streamClient.video.call("default", roomId);
    const response = await call.listTranscriptions();
    res.json({ transcriptions: response.transcriptions || [] });
  } catch (err) {
    console.error("Failed to fetch transcriptions:", err);
    res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
});

// ─── GET /api/video/summary/:roomId ──────────────────────
// Fetches the transcription file, parses it, and generates an AI summary.
// Polls for up to ~60 s because Stream processes transcripts asynchronously.
router.get("/summary/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    let transcriptions = [];
    const MAX_POLLS = 8;
    const POLL_INTERVAL_MS = 5000;

    for (let i = 0; i < MAX_POLLS; i++) {
      const call     = streamClient.video.call("default", roomId);
      const response = await call.listTranscriptions();
      transcriptions = response.transcriptions || [];
      if (transcriptions.length > 0) break;
      if (i < MAX_POLLS - 1) await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }

    if (transcriptions.length === 0) {
      return res.json({ summary: null, message: "No transcription was recorded for this session." });
    }

    const latest  = transcriptions[transcriptions.length - 1];
    const fileUrl = latest.url || latest.filename;

    let rawText = "";
    try {
      const fileRes = await axios.get(fileUrl, { responseType: "text", timeout: 15000 });
      rawText = fileRes.data;
    } catch (downloadErr) {
      console.error("Failed to download transcript file:", downloadErr.message);
      return res.status(500).json({ error: "Failed to download transcript file." });
    }

    // ✅ Now returns { text, durationSeconds }
    const { text: plainText, durationSeconds } = parseVTT(rawText);

    if (!plainText || plainText.length < 30) {
      return res.json({ summary: null, message: "Transcript was too short to summarise." });
    }

    // ✅ Pass real duration so AI doesn't guess
    const realDuration = formatDuration(durationSeconds);
    const aiSummary    = await generateSummary(plainText, realDuration);

    return res.json({ summary: aiSummary });

  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: "Failed to generate session summary." });
  }
});
// ─── Helpers ──────────────────────────────────────────────

/**
 * Strips WEBVTT timestamps and metadata, returning clean speaker text.
 * Handles both VTT and basic JSON transcript formats.
 */
// Replace your parseVTT function with this:
function parseVTT(raw) {
  if (!raw) return { text: "", durationSeconds: 0 };

  // JSON format
  if (raw.trim().startsWith("[") || raw.trim().startsWith("{")) {
    try {
      const json = JSON.parse(raw);
      const items = Array.isArray(json) ? json : json.items || json.segments || [];
      const text = items
        .map(item => {
          const speaker = item.speaker || item.user?.name || "Speaker";
          const t = item.text || item.content || "";
          return `${speaker}: ${t}`;
        })
        .join("\n");
      return { text, durationSeconds: 0 };
    } catch (_) {}
  }

  // WebVTT format — also extract first and last timestamp
  const lines = raw.split("\n");
  const result = [];
  let firstTimestamp = null;
  let lastTimestamp  = null;
  let skipNext = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "WEBVTT" || trimmed.startsWith("NOTE")) continue;

    // Timestamp lines: "00:00:01.000 --> 00:00:04.000"
    if (/^\d{2}:\d{2}:\d{2}/.test(trimmed) || /^\d{2}:\d{2}\.\d{3}/.test(trimmed)) {
      // Extract the END timestamp (after -->)
      const parts = trimmed.split("-->");
      const startStr = parts[0]?.trim();
      const endStr   = parts[1]?.trim().split(" ")[0]; // ignore positioning tags

      if (startStr && !firstTimestamp) firstTimestamp = parseTimestamp(startStr);
      if (endStr)                       lastTimestamp  = parseTimestamp(endStr);

      skipNext = false;
      continue;
    }

    if (/^\d+$/.test(trimmed)) { skipNext = true; continue; }
    if (skipNext) { skipNext = false; continue; }
    if (trimmed) result.push(trimmed);
  }

  // Real duration from timestamps
  let durationSeconds = 0;
  if (firstTimestamp !== null && lastTimestamp !== null) {
    durationSeconds = Math.max(0, lastTimestamp - firstTimestamp);
  }

  return { text: result.join("\n"), durationSeconds };
}

// Converts "HH:MM:SS.mmm" or "MM:SS.mmm" to total seconds
function parseTimestamp(ts) {
  if (!ts) return 0;
  const parts = ts.replace(",", ".").split(":");
  if (parts.length === 3) {
    // HH:MM:SS.mmm
    return parseFloat(parts[0]) * 3600
         + parseFloat(parts[1]) * 60
         + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    // MM:SS.mmm
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return 0;
}

// Converts seconds to a human readable string like "~5 min"
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.round(seconds / 60);
  if (mins < 1)  return "< 1 min";
  if (mins < 60) return `~${mins} min`;
  const hrs  = Math.floor(mins / 60);
  const rem  = mins % 60;
  return rem > 0 ? `~${hrs}h ${rem}m` : `~${hrs}h`;
}
/**
 * Calls Claude to produce a structured session summary.
 */
// Replace the generateSummary function with this:
async function generateSummary(transcript, realDuration) {
  const durationNote = realDuration
    ? `The actual session duration is ${realDuration}. Use this exact value for durationEstimate.`
    : `Estimate the duration from the transcript.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert session coach. Analyse the following video session transcript and return a concise structured JSON summary.

${durationNote}

Return ONLY valid JSON — no markdown, no explanation — with this exact shape:
{
  "title": "Short descriptive title for the session (max 8 words)",
  "overview": "2-3 sentence neutral overview of what the session covered",
  "keyTopics": ["topic 1", "topic 2", "topic 3"],
  "actionItems": ["action 1", "action 2"],
  "highlights": ["notable moment or quote 1", "notable moment or quote 2"],
  "mood": "one word: positive | neutral | challenging | mixed",
  "durationEstimate": "${realDuration || "estimate from transcript"}"
}

Transcript:
${transcript.slice(0, 12000)}`
      }
    ]
  });

  const raw   = completion.choices[0]?.message?.content || "{}";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = router;