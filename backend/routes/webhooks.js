const express = require("express");
const Session = require("../models/Session");

const router = express.Router();
router.post("/stream", async (req, res) => {
  res.status(200).json({ received: true });

  const event = req.body;
  console.log("⚡ Webhook received:", event?.type);

  if (event?.type !== "call.recording_ready") return;

  // ✅ call_cid is "default:22938dc9-..." so split on ":" to get the ID
  const roomId       = event?.call_cid?.split(":")?.[1];
  const recordingUrl = event?.call_recording?.url;
  const duration     = event?.call_recording?.duration;

  console.log("roomId:", roomId);
  console.log("recordingUrl:", recordingUrl ? "✅ present" : "❌ missing");

  if (!roomId || !recordingUrl) {
    console.warn("⚠️ Missing roomId or recordingUrl");
    return;
  }

  try {
    let updated = await Session.findOneAndUpdate(
      { callId: roomId },
      { recordingUrl, recordingDuration: duration, recordingCreatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      updated = await Session.findOneAndUpdate(
        { videoCallLink: { $regex: roomId } },
        { recordingUrl, recordingDuration: duration, recordingCreatedAt: new Date() },
        { new: true }
      );
    }

    if (updated) {
      console.log("✅ Recording saved for session:", updated._id);
    } else {
      console.warn("⚠️ No session found for roomId:", roomId);
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
});
module.exports = router;