// const User = require("../models/User");
// const Request = require("../models/Request");
// const Session = require("../models/Session");
// const Skill = require("../models/Skill");
// const cloudinary = require("../config/cloudinary");
// const mongoose = require("mongoose");
// const { awardXP, hasEarnedOneTimeXP, markOneTimeXP, XP } = require("../utils/xpUtils");

// /* ------------------------------------
//    Helper: Convert skill names to IDs
// ------------------------------------ */
// async function convertToSkillIds(skillNames = []) {
//   const ids = [];
//   for (let raw of skillNames) {
//     const name = raw.trim().toLowerCase();
//     if (!name) continue;
//     let skill = await Skill.findOne({ name });
//     if (!skill) {
//       try {
//         skill = await Skill.create({ name });
//       } catch (err) {
//         if (err.code === 11000) {
//           skill = await Skill.findOne({ name });
//         } else {
//           throw err;
//         }
//       }
//     }
//     ids.push(skill._id);
//   }
//   return ids;
// }

// /* ------------------------------------
//    UPDATE PROFILE
// ------------------------------------ */
// exports.updateProfile = async (req, res) => {
//   try {
//     let {
//       name,
//       skillsTeach = [],
//       skillsLearn = [],
//       gender,
//       location,
//       birthday,
//       work,
//       education,
//       email,
//       password,
//       username,
//       language,
//     } = req.body;

//     const normalize = (val) => {
//       if (Array.isArray(val)) return val;
//       if (typeof val === "string") return val.split(",").map((s) => s.trim());
//       return [];
//     };

//     skillsTeach = normalize(skillsTeach);
//     skillsLearn = normalize(skillsLearn);

//     // ── Get existing skills to detect newly added ones ──
//     const existingUser = await User.findById(req.user.id)
//       .populate("skillsTeach", "name")
//       .lean();
//     const existingTeachNames = (existingUser?.skillsTeach || []).map((s) =>
//       s.name?.toLowerCase()
//     );

//     const teachIds = skillsTeach.length > 0 ? await convertToSkillIds(skillsTeach) : undefined;
//     const learnIds = skillsLearn.length > 0 ? await convertToSkillIds(skillsLearn) : undefined;

//     const updateFields = {
//       ...(name      !== undefined && { name }),
//       ...(teachIds  !== undefined && { skillsTeach: teachIds }),
//       ...(learnIds  !== undefined && { skillsLearn: learnIds }),
//       ...(gender    !== undefined && { gender }),
//       ...(location  !== undefined && { location }),
//       ...(birthday  !== undefined && { birthday }),
//       ...(work      !== undefined && { work }),
//       ...(education !== undefined && { education }),
//       ...(email     !== undefined && { email }),
//       ...(username  !== undefined && { username }),
//       ...(language  !== undefined && { language }),
//     };

//     if (password && password !== "********") {
//       const bcrypt = require("bcryptjs");
//       updateFields.password = await bcrypt.hash(password, 10);
//     }

//     const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true })
//       .populate("skillsTeach")
//       .populate("skillsLearn");

//     // ⚡ +10 XP for each NEW skill added to teach
//     const newSkills = skillsTeach.filter(
//       (s) => !existingTeachNames.includes(s.trim().toLowerCase())
//     );
//     for (const skillName of newSkills) {
//       const eventKey = `skill_added_${skillName.trim().toLowerCase().replace(/\s+/g, "_")}`;
//       const alreadyAwarded = await hasEarnedOneTimeXP(req.user.id, eventKey);
//       if (!alreadyAwarded) {
//         await awardXP(req.user.id, XP.ADD_SKILL_TO_TEACH, `Added skill: ${skillName}`);
//         await markOneTimeXP(req.user.id, eventKey);
//       }
//     }

//     // ⚡ +15 XP one-time for completing profile
//     // Profile is "complete" if they have name, bio, avatar, and at least 1 skill
//     const isProfileComplete =
//       user.name &&
//       user.bio &&
//       user.avatar &&
//       user.skillsTeach?.length > 0;

//     if (isProfileComplete) {
//       const alreadyComplete = await hasEarnedOneTimeXP(req.user.id, "profile_complete");
//       if (!alreadyComplete) {
//         await awardXP(req.user.id, XP.COMPLETE_PROFILE, "Profile completed!");
//         await markOneTimeXP(req.user.id, "profile_complete");
//       }
//     }

//     res.json({ user });
//   } catch (err) {
//     console.error("UPDATE PROFILE ERROR:", err);
//     res.status(500).json({ msg: "Profile update failed" });
//   }
// };

// /* ------------------------------------
//    UPDATE PUBLIC PROFILE
// ------------------------------------ */
// exports.updatePublicProfile = async (req, res) => {
//   try {
//     const { tagline, bio, demoVideo } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { tagline, bio, demoVideo },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     // ⚡ Check profile complete after public profile update too
//     const isProfileComplete =
//       user.name &&
//       user.bio &&
//       user.avatar &&
//       user.skillsTeach?.length > 0;

//     if (isProfileComplete) {
//       const alreadyComplete = await hasEarnedOneTimeXP(req.user.id, "profile_complete");
//       if (!alreadyComplete) {
//         await awardXP(req.user.id, XP.COMPLETE_PROFILE, "Profile completed!");
//         await markOneTimeXP(req.user.id, "profile_complete");
//       }
//     }

//     res.json({ msg: "Public profile updated successfully", user });
//   } catch (err) {
//     console.error("UPDATE PUBLIC PROFILE ERROR:", err);
//     res.status(500).json({ msg: "Failed to update public profile" });
//   }
// };

// /* ------------------------------------
//    GET ALL SKILLS
// ------------------------------------ */
// /* ------------------------------------
//    GET ALL SKILLS
// ------------------------------------ */
// exports.getAllSkills = async (req, res) => {
//   try {
//     // ✅ avatar added back to select
//     const users = await User.find()
//       .select("name avatar skillsTeach")
//       .lean();

//     const skillMap = {};

//     users.forEach((user) => {
//       if (!Array.isArray(user.skillsTeach)) return;
//       user.skillsTeach.forEach((skillId) => {
//         if (!mongoose.Types.ObjectId.isValid(skillId)) return;
//         const id = skillId.toString();
//         if (!skillMap[id]) skillMap[id] = { mentors: [] };

//         // ✅ avatar added back to mentor object
//         skillMap[id].mentors.push({
//           id:     user._id,
//           name:   user.name,
//           avatar: user.avatar || null,
//         });
//       });
//     });

//     const skillDocs = await Skill.find({ _id: { $in: Object.keys(skillMap) } });
//     const result = skillDocs.map((skill) => ({
//       _id:     skill._id,
//       name:    skill.name,
//       mentors: skillMap[skill._id.toString()]?.mentors || [],
//     }));

//     res.json({ skills: result });
//   } catch (err) {
//     console.error("GET ALL SKILLS ERROR:", err);
//     res.status(500).json({ msg: "Failed to load skills" });
//   }
// };

// /* ------------------------------------
//    GET MY PROFILE
// ------------------------------------ */
// exports.getMyProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .populate("skillsTeach")
//       .populate("skillsLearn");
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to load profile" });
//   }
// };

// /* ------------------------------------
//    DASHBOARD STATS
// ------------------------------------ */
// exports.getStats = async (req, res) => {
//   try {
//     const sent     = await Request.countDocuments({ fromUser: req.user.id });
//     const received = await Request.countDocuments({ toUser: req.user.id });
//     const accepted = await Request.countDocuments({ toUser: req.user.id, status: "accepted" });
//     const completedSessions = await Session.countDocuments({
//       learner: req.user.id,
//       status: "completed",
//     });
//     res.json({ sent, received, accepted, completedSessions });
//   } catch (err) {
//     res.status(500).json({ msg: "Stats failed" });
//   }
// };

// /* ------------------------------------
//    GET PUBLIC PROFILE BY ID
// ------------------------------------ */
// exports.getPublicProfile = async (req, res) => {
//   try {
//     // ✅ FIX 3: added avatar to select
//     const user = await User.findById(req.params.id)
//       .select("name tagline bio demoVideo skillsTeach skillsLearn avatar averageRating totalReviews xp badges")
//       .populate("skillsTeach", "name")
//       .populate("skillsLearn", "name");

//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("PUBLIC PROFILE ERROR:", err);
//     res.status(500).json({ msg: "Failed to load public profile" });
//   }
// };

// /* ------------------------------------
//    UPLOAD AVATAR
// ------------------------------------ */
// exports.uploadAvatar = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "skill_swap_profiles",
//     });

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { avatar: result.secure_url },
//       { new: true }
//     );

//     // ⚡ Check profile complete after avatar upload
//     const isProfileComplete =
//       user.name && user.bio && user.avatar && user.skillsTeach?.length > 0;

//     if (isProfileComplete) {
//       const alreadyComplete = await hasEarnedOneTimeXP(req.user.id, "profile_complete");
//       if (!alreadyComplete) {
//         await awardXP(req.user.id, XP.COMPLETE_PROFILE, "Profile completed!");
//         await markOneTimeXP(req.user.id, "profile_complete");
//       }
//     }

//     res.json({ avatar: user.avatar });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Image upload failed" });
//   }
// };



const User = require("../models/User");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Skill = require("../models/Skill");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const { awardXP, hasEarnedOneTimeXP, markOneTimeXP, XP } = require("../utils/xpUtils");

/* ------------------------------------
   Helper: Convert skill names to IDs
------------------------------------ */
async function convertToSkillIds(skillNames = []) {
  const ids = [];
  for (let raw of skillNames) {
    const name = raw.trim().toLowerCase();
    if (!name) continue;
    let skill = await Skill.findOne({ name });
    if (!skill) {
      try {
        skill = await Skill.create({ name });
      } catch (err) {
        if (err.code === 11000) {
          skill = await Skill.findOne({ name });
        } else {
          throw err;
        }
      }
    }
    ids.push(skill._id);
  }
  return ids;
}

/* ------------------------------------
   UPDATE PROFILE
------------------------------------ */
exports.updateProfile = async (req, res) => {
  try {
    let {
      name,
      skillsTeach = [],
      skillsLearn = [],
      gender,
      location,
      birthday,
      work,
      education,
      email,
      password,
      username,
      language,
    } = req.body;

    const normalize = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val.split(",").map((s) => s.trim());
      return [];
    };

    skillsTeach = normalize(skillsTeach);
    skillsLearn = normalize(skillsLearn);

    // ── Get existing skills to detect newly added ones ──
    const existingUser = await User.findById(req.user.id)
      .populate("skillsTeach", "name")
      .lean();
    const existingTeachNames = (existingUser?.skillsTeach || []).map((s) =>
      s.name?.toLowerCase()
    );

    const teachIds = skillsTeach.length > 0 ? await convertToSkillIds(skillsTeach) : undefined;
    const learnIds = skillsLearn.length > 0 ? await convertToSkillIds(skillsLearn) : undefined;

    const updateFields = {
      ...(name      !== undefined && { name }),
      ...(teachIds  !== undefined && { skillsTeach: teachIds }),
      ...(learnIds  !== undefined && { skillsLearn: learnIds }),
      ...(gender    !== undefined && { gender }),
      ...(location  !== undefined && { location }),
      ...(birthday  !== undefined && { birthday }),
      ...(work      !== undefined && { work }),
      ...(education !== undefined && { education }),
      ...(email     !== undefined && { email }),
      ...(username  !== undefined && { username }),
      ...(language  !== undefined && { language }),
    };

    if (password && password !== "********") {
      const bcrypt = require("bcryptjs");
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true })
      .populate("skillsTeach")
      .populate("skillsLearn");

    // ⚡ +10 XP for each NEW skill added to teach
    const newSkills = skillsTeach.filter(
      (s) => !existingTeachNames.includes(s.trim().toLowerCase())
    );
    for (const skillName of newSkills) {
      const eventKey = `skill_added_${skillName.trim().toLowerCase().replace(/\s+/g, "_")}`;
      const alreadyAwarded = await hasEarnedOneTimeXP(req.user.id, eventKey);
      if (!alreadyAwarded) {
        await awardXP(req.user.id, XP.ADD_SKILL_TO_TEACH, `Added skill: ${skillName}`);
        await markOneTimeXP(req.user.id, eventKey);
      }
    }

    // ⚡ +15 XP one-time for completing profile
    const isProfileComplete =
      user.name &&
      user.bio &&
      user.avatar &&
      user.skillsTeach?.length > 0;

    if (isProfileComplete) {
      const alreadyComplete = await hasEarnedOneTimeXP(req.user.id, "profile_complete");
      if (!alreadyComplete) {
        await awardXP(req.user.id, XP.COMPLETE_PROFILE, "Profile completed!");
        await markOneTimeXP(req.user.id, "profile_complete");
      }
    }

    res.json({ user });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ msg: "Profile update failed" });
  }
};

/* ------------------------------------
   UPDATE PUBLIC PROFILE
------------------------------------ */
// /* ------------------------------------
//    UPDATE PUBLIC PROFILE
// ------------------------------------ */
// exports.updatePublicProfile = async (req, res) => {
//   try {
//     const {
//       tagline,
//       bio,
//       demoVideo,
//       skillLevel,
//       yearsOfExperience,
//       linkedin,
//       portfolio,
//       education,
//       skillsOffered,
//       skillTags,
//       availability, // <-- should be array of strings like ["Monday", "Wednesday"]
//     } = req.body;

//     // Ensure availability is an array of strings
//     // Normalize availability: ensure array of unique, trimmed strings
// const availabilityToSave = Array.isArray(availability)
//   ? availability.map(d => d.trim())
//   : typeof availability === "string"
//     ? availability.split(",").map(d => d.trim())
//     : [];

// const uniqueAvailability = [...new Set(availabilityToSave)]; // remove duplicates

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         tagline,
//         bio,
//         demoVideo,
//         skillLevel,
//         yearsOfExperience,
//         linkedin,
//         portfolio,
//         education,
//         skillsOffered,
//         skillTags,
//         availability: uniqueAvailability, // <-- save strings directly
//       },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({ msg: "Public profile updated successfully", user });
//   } catch (err) {
//     console.error("UPDATE PUBLIC PROFILE ERROR:", err);
//     res.status(500).json({ msg: "Failed to update public profile" });
//   }
// };




/* ------------------------------------
    UPDATE PUBLIC PROFILE (With 5 XP Bonus)
------------------------------------ */
exports.updatePublicProfile = async (req, res) => {
  try {
    const {
      tagline,
      bio,
      demoVideo,
      skillLevel,
      yearsOfExperience,
      linkedin,
      portfolio,
      education,
      skillsOffered,
      skillTags,
      availability,
    } = req.body;

    // Normalize availability
    const availabilityToSave = Array.isArray(availability)
      ? availability.map((d) => d.trim())
      : typeof availability === "string"
      ? availability.split(",").map((d) => d.trim())
      : [];

    const uniqueAvailability = [...new Set(availabilityToSave)];

    // 1. Update the user record
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        tagline,
        bio,
        demoVideo,
        skillLevel,
        yearsOfExperience,
        linkedin,
        portfolio,
        education,
        skillsOffered,
        skillTags,
        availability: uniqueAvailability,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    // 2. ⚡ Check for 5 XP Bonus (One-time only)
    let earnedBonus = false;
    
    // Define what "Complete" means for your public profile
    const isPublicProfileComplete = 
      user.bio && 
      user.tagline && 
      user.skillLevel && 
      user.skillsOffered?.length > 0;

    if (isPublicProfileComplete) {
      const alreadyAwarded = await hasEarnedOneTimeXP(req.user.id, "public_profile_bonus");
      
      if (!alreadyAwarded) {
        // Award exactly 5 XP
        await awardXP(req.user.id, 5, "Completed Public Profile");
        // Mark it so they can't get it again
        await markOneTimeXP(req.user.id, "public_profile_bonus");
        earnedBonus = true;
      }
    }

    // 3. Return response with the earnedBonus flag for the frontend popup
    res.json({ 
      msg: "Public profile updated successfully", 
      user,
      earnedBonus // Frontend will use this to show the popup
    });
  } catch (err) {
    console.error("UPDATE PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to update public profile" });
  }
};
/* ------------------------------------
   GET ALL SKILLS
------------------------------------ */
/* ------------------------------------
   GET ALL SKILLS
------------------------------------ */
exports.getAllSkills = async (req, res) => {
  try {
    const users = await User.find()
      .select("name avatar skillsTeach")
      .lean();

    const skillMap = {};

    users.forEach((user) => {
      if (!Array.isArray(user.skillsTeach)) return;
      user.skillsTeach.forEach((skillId) => {
        if (!mongoose.Types.ObjectId.isValid(skillId)) return;
        const id = skillId.toString();
        if (!skillMap[id]) skillMap[id] = { mentors: [] };

        skillMap[id].mentors.push({
          id:     user._id,
          name:   user.name,
          avatar: user.avatar || null,
        });
      });
    });

    const skillDocs = await Skill.find({ _id: { $in: Object.keys(skillMap) } });
    const result = skillDocs.map((skill) => ({
      _id:     skill._id,
      name:    skill.name,
      mentors: skillMap[skill._id.toString()]?.mentors || [],
    }));

    res.json({ skills: result });
  } catch (err) {
    console.error("GET ALL SKILLS ERROR:", err);
    res.status(500).json({ msg: "Failed to load skills" });
  }
};
/* ------------------------------------
   GET MY PROFILE
------------------------------------ */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("skillsTeach")
      .populate("skillsLearn");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

/* ------------------------------------
   DASHBOARD STATS
------------------------------------ */
exports.getStats = async (req, res) => {
  try {
    const sent     = await Request.countDocuments({ fromUser: req.user.id });
    const received = await Request.countDocuments({ toUser: req.user.id });
    const accepted = await Request.countDocuments({ toUser: req.user.id, status: "accepted" });
    const completedSessions = await Session.countDocuments({
      learner: req.user.id,
      status: "completed",
    });
    res.json({ sent, received, accepted, completedSessions });
  } catch (err) {
    res.status(500).json({ msg: "Stats failed" });
  }
};

/* ------------------------------------
   GET PUBLIC PROFILE BY ID
------------------------------------ */
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        "name tagline bio education skillLevel yearsOfExperience linkedin portfolio availability demoVideo skillsTeach skillsLearn avatar averageRating totalReviews xp badges"
      )
      .populate("skillsTeach", "name")
      .populate("skillsLearn", "name");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to load public profile" });
  }
};

/* ------------------------------------
   UPLOAD AVATAR
------------------------------------ */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "skill_swap_profiles",
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );

    // ⚡ Check profile complete after avatar upload
    const isProfileComplete =
      user.name && user.bio && user.avatar && user.skillsTeach?.length > 0;

    if (isProfileComplete) {
      const alreadyComplete = await hasEarnedOneTimeXP(req.user.id, "profile_complete");
      if (!alreadyComplete) {
        await awardXP(req.user.id, XP.COMPLETE_PROFILE, "Profile completed!");
        await markOneTimeXP(req.user.id, "profile_complete");
      }
    }

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Image upload failed" });
  }
};

/* ------------------------------------
   GET UNSEEN BADGES  ✅ NEW
   GET /api/user/badges/unseen
   Returns badges earned but not yet celebrated
------------------------------------ */
exports.getUnseenBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const seen = user.seenBadgeIds || [];

    // Badges earned but not yet shown as a celebration
    const unseen = (user.badges || []).filter((b) => !seen.includes(b.id));

    res.json({ badges: unseen });
  } catch (err) {
    console.error("GET UNSEEN BADGES ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ------------------------------------
   MARK BADGE SEEN  ✅ NEW
   POST /api/user/badges/mark-seen
   Body: { badgeId: "first_session" }
   Prevents the same celebration firing twice
------------------------------------ */
exports.markBadgeSeen = async (req, res) => {
  try {
    const { badgeId } = req.body;
    if (!badgeId) return res.status(400).json({ msg: "badgeId is required" });

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { seenBadgeIds: badgeId }, // $addToSet = no duplicates
    });

    res.json({ success: true });
  } catch (err) {
    console.error("MARK BADGE SEEN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};