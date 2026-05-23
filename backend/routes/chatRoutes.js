const express = require("express");
const router = express.Router();
const { getStreamToken, upsertStreamUser, streamWebhook } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");

router.get("/token", protect, getStreamToken);
router.post("/upsert-user/:id", protect, upsertStreamUser);
router.post("/webhook", streamWebhook); //  NEW — no auth middleware, Stream calls this directly

module.exports = router;