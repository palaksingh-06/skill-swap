// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/authController");

// //  REGISTER
// router.post("/register", registerUser);

// // LOGIN
// router.post("/login", loginUser);

// // manshi
// router.post("/forgot-password", forgotPassword);
// router.post("/send-otp", forgotPassword); // Alias for compatibility
// router.post("/reset-password", resetPassword);

// // TEST PROTECTED ROUTE 
// router.get("/me", authMiddleware, async (req, res) => {
//   res.json({
//     msg: "Protected Route Working",
//     userId: req.user,
//   });
// });

// // manshi
// router.get("/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get("/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = jwt.sign(
//       { id: req.user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.redirect(`http://localhost:5173/login-success?token=${token}`);
//   }
// );
// module.exports = router;



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

// manshi
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);
module.exports = router;
