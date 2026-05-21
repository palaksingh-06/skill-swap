// const router = require("express").Router();
// const auth = require("../middleware/authMiddleware");

// const {
//   getNotifications,
//   markAsRead,
//   deleteNotification
// } = require("../controllers/notificationController");

// router.get("/", auth, getNotifications);
// router.put("/:id/read", auth, markAsRead);
// router.delete("/:id", auth, deleteNotification);

// module.exports = router;



const router = require("express").Router();
const auth   = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get   ("/",           auth, getNotifications);
router.put   ("/read-all",   auth, markAllAsRead);       // ← add this
router.put   ("/:id/read",   auth, markAsRead);
router.delete("/:id",        auth, deleteNotification);

module.exports = router;