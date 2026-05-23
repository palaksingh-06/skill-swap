const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/* Storage config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/*  Upload voice */
router.post("/upload-voice", upload.single("file"), (req, res) => {
  try {
    const fileUrl = `https://skill-swap-zkfd.onrender.com/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;