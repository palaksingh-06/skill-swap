const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Remove the console.logs — never leave these in production
router.post("/chat", authMiddleware, aiController.chatbotReply);
router.get("/history", authMiddleware, aiController.getChatHistory);

module.exports = router;