const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Skill = require("../models/Skill");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    let { name, email, password, skillsTeach = [], skillsLearn = [] } = req.body;

    // Convert stringified arrays to real arrays
    const normalizeSkills = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          return JSON.parse(val.replace(/'/g, '"'));
        } catch {
          // comma-separated string like "React, Python, C++"
          return val.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    skillsTeach = normalizeSkills(skillsTeach);
    skillsLearn = normalizeSkills(skillsLearn);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Convert skill names → ObjectIds
    const convertToSkillIds = async (skills) => {
      const ids = [];
      for (const skillName of skills) {
        // Escape special regex characters so C++, .NET etc. don't crash
        const escapedName = skillName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let skill = await Skill.findOne({
          name: new RegExp(`^${escapedName}$`, "i"),
        });
        if (!skill) {
          skill = await Skill.create({ name: skillName });
        }
        ids.push(skill._id);
      }
      return ids;
    };

    const teachIds = await convertToSkillIds(skillsTeach);
    const learnIds = await convertToSkillIds(skillsLearn);

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      skillsTeach: teachIds,
      skillsLearn: learnIds,
    });

    const populatedUser = await User.findById(newUser._id)
      .populate("skillsTeach")
      .populate("skillsLearn");

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "User Registered Successfully",
      token,
      user: populatedUser,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Registration Failed" });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ msg: "Login Successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Login Failed" });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "SkillSwap Password Reset OTP",
      html: `<h2>Your OTP is:</h2><h1>${otp}</h1><p>Valid for 10 minutes</p>`,
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // check if fields are coming
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: "Both passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ msg: "Failed to change password" });
  }

};