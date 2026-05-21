// const User = require("../models/User");
// const Notification = require("../models/Notification");

// exports.getSkillMatches = async (req, res) => {

//   try {
//     const currentUser = await User.findById(req.params.userId);

//     if (!currentUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // console.log("CURRENT USER ID:", currentUser._id);
//     // console.log("CURRENT USER TEACH:", currentUser.skillsTeach);
//     // console.log("CURRENT USER LEARN:", currentUser.skillsLearn);

//     // 1️⃣ Get all other users
//     const users = await User.find({
//       _id: { $ne: currentUser._id },
//     })
//       .populate("skillsTeach", "name")
//       .populate("skillsLearn", "name");

//     // 2️⃣ Bidirectional matching
//     const matchedUsers = users.filter((u) => {

//       if (
//         !Array.isArray(u.skillsTeach) ||
//         !Array.isArray(u.skillsLearn)
//       ) {
//         return false;
//       }

//       const teachesWhatILearn = u.skillsTeach.some((skill) =>
//         currentUser.skillsLearn.includes(skill._id)
//       );

//       const learnsWhatITeach = u.skillsLearn.some((skill) =>
//         currentUser.skillsTeach.includes(skill._id)
//       );

//       return teachesWhatILearn && learnsWhatITeach;
//     });

//     console.log("MATCHED USERS COUNT:", matchedUsers.length);

//     // 🔔 Create notifications for matches
//     for (const user of matchedUsers) {

//       const notification = await Notification.create({
//         user: user._id,
//         message: `You have a new skill match with ${currentUser.name}`,
//         type: "match",
//         read: false
//       });

//       // realtime socket notification
//       global.io.to(user._id.toString()).emit("notification", notification);
//     }

//     // 3️⃣ Send array response
//     return res.status(200).json(matchedUsers);

//   } catch (error) {
//     console.error("MATCH ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



const User = require("../models/User");
const Notification = require("../models/Notification");

exports.getSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({ _id: { $ne: currentUser._id } })
      .populate("skillsTeach", "name")
      .populate("skillsLearn", "name");

    const matchedUsers = users.filter((u) => {
      if (!Array.isArray(u.skillsTeach) || !Array.isArray(u.skillsLearn)) return false;

      const teachesWhatILearn = u.skillsTeach.some((skill) =>
        currentUser.skillsLearn.includes(skill._id)
      );
      const learnsWhatITeach = u.skillsLearn.some((skill) =>
        currentUser.skillsTeach.includes(skill._id)
      );

      return teachesWhatILearn && learnsWhatITeach;
    });

    // ✅ Notify matched users with correct event name
    for (const user of matchedUsers) {
      const notification = await Notification.create({
        user:    user._id,
        message: `🔗 You have a new skill match with ${currentUser.name}!`,
        type:    "match",
        read:    false,
      });

      if (global.io) {
        global.io.to(user._id.toString()).emit("new_notification", {
          _id:       notification._id,
          message:   notification.message,
          type:      notification.type,
          createdAt: notification.createdAt,
        });
      }
    }

    return res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("MATCH ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


