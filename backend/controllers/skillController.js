const Skill = require("../models/Skill");

/**
 * Create or return existing skill
 */
exports.createSkill = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const name = req.body.name.trim().toLowerCase();

    // Try to find first
    let skill = await Skill.findOne({ name });

    if (!skill) {
      try {
        skill = await Skill.create({ name });
      } catch (err) {
        // If another request created it at same time
        if (err.code === 11000) {
          skill = await Skill.findOne({ name });
        } else {
          throw err;
        }
      }
    }

    res.status(201).json(skill);
  } catch (err) {
    console.error("CREATE SKILL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all skills
 */
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate("mentors", "_id name")
      .sort({ name: 1 });

    res.json({ skills });
  } catch (err) {
    console.error("GET SKILLS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};