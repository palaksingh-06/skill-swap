





// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: String,

//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },

//     password: String,

//     // Authentication
//     authProvider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//     },

//     googleId: String,

//     // Skills
//     skillsTeach: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Skill",
//       },
//     ],

//     skillsLearn: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Skill",
//       },
//     ],

//     // OTP
//     otp: String,
//     otpExpiry: Date,

//     // -------- PUBLIC PROFILE --------
//     tagline: {
//       type: String,
//       maxLength: 100,
//       default: "",
//     },

//     bio: {
//       type: String,
//       maxLength: 500,
//       default: "",
//     },

//     demoVideo: {
//       type: String,
//       default: "",
//     },

//     avatar: {
//       type: String,
//       default: "",
//     },

//     // -------- SETTINGS --------
//     gender: {
//       type: String,
//       default: "",
//     },

//     location: {
//       type: String,
//       default: "",
//     },

//     birthday: {
//       type: String,
//       default: "",
//     },

//     work: {
//       type: String,
//       default: "",
//     },

//     education: {
//       type: String,
//       default: "",
//     },

//     username: {
//       type: String,
//       default: "",
//     },

//     language: {
//       type: String,
//       default: "English",
//     },

//    // -------- GAMIFICATION --------
//     xp: {
//       type: Number,
//       default: 0,
//     },

//     // ✅ ADD THESE TWO BLOCKS HERE ↓

//     xpEvents: {
//       type: [String],
//       default: [],
//     },

//     badges: [
//       {
//         id:          { type: String, required: true },
//         title:       { type: String, required: true },
//         description: { type: String, default: "" },
//         icon:        { type: String, default: "🏅" },
//         earnedAt:    { type: Date,   default: Date.now },
//       },
//     ],

//     // -------- REVIEWS --------
//     averageRating: {
//       type: Number,
//       default: null,
//     },

//     totalReviews: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: String,

    // Authentication
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: String,

    // Skills
    skillsTeach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    skillsLearn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    // OTP
    otp: String,
    otpExpiry: Date,

    // -------- PUBLIC PROFILE --------
    tagline: {
      type: String,
      maxLength: 100,
      default: "",
    },

    bio: {
      type: String,
      maxLength: 500,
      default: "",
    },

    demoVideo: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    // -------- SETTINGS --------
    gender: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    birthday: {
      type: String,
      default: "",
    },

    work: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    // -------- PUBLIC PROFILE ADDITIONAL FIELDS --------
    skillLevel: {
      type: String,
      default: "",
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    skillsOffered: {
      type: [String],
      default: [],
    },

    skillTags: {
      type: [String],
      default: [],
    },

    availability: [{ type: String }],

    // -------- GAMIFICATION --------
    xp: {
      type: Number,
      default: 0,
    },

    xpEvents: {
      type: [String],
      default: [],
    },

    badges: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "🏅" },
        earnedAt: { type: Date, default: Date.now },
      },
    ],

    // Tracks shown badge popups
    seenBadgeIds: {
      type: [String],
      default: [],
    },

    // -------- REVIEWS --------
    averageRating: {
      type: Number,
      default: null,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);