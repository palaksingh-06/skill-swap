const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
router.put("/change-password", authMiddleware, changePassword);
//  REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// manshi
router.post("/forgot-password", forgotPassword);
router.post("/send-otp", forgotPassword); // Alias for compatibility
router.post("/reset-password", resetPassword);

// TEST PROTECTED ROUTE 
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    msg: "Protected Route Working",
    userId: req.user,
  });
});
router.put("/change-password", authMiddleware, changePassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/google-failed"
  }),
  (req, res) => {
    console.log("AUTH SUCCESS");
    console.log(req.user);

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `https://skill-swap-1-4w1n.onrender.com/login-success?token=${token}`
    );
  }
);

router.get("/google-failed", (req, res) => {
  console.log("GOOGLE AUTH FAILED");
  res.send("Google Auth Failed");
});
module.exports = router;
