const SkillSwap = require("../models/SkillSwap");

// Get featured swaps
exports.getFeaturedSwaps = async (req, res) => {
  try {
    const swaps = await SkillSwap.find({ isFeatured: true, status: "open" })
      .populate("user", "name avatar")
      .limit(6)
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};