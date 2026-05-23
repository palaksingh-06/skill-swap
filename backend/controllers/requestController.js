const Notification = require("../models/Notification");
const Request = require("../models/Request");

/* ------------------------------
   GET INCOMING REQUESTS
-------------------------------- */
exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ toUser: req.user.id })
      .populate("fromUser", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
};


/* ------------------------------
   SEND REQUEST
-------------------------------- */
exports.sendRequest = async (req, res) => {
  try {
    const { toUser, skill, message } = req.body;

    const request = await Request.create({
      fromUser: req.user.id,
      toUser,
      skill,
      message,
      status: "pending",
    });

    // Save notification to DB
    const notification = await Notification.create({
      user: toUser,
      message: `${req.user.name} sent you a skill request`,
      type: "request",
      read: false
    });

    // Emit realtime toast — event name must match frontend listener
    global.io.to(String(toUser)).emit("new_notification", {
      _id:       notification._id,
      message:   notification.message,
      type:      notification.type,
      createdAt: notification.createdAt
    });

    res.json({ msg: "Request sent", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send request" });
  }
};


/* ------------------------------
   UPDATE REQUEST STATUS
-------------------------------- */
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    //  Notify for ACCEPTED
    if (status === "accepted") {
      const notification = await Notification.create({
        user:    request.fromUser,
        message: `✅ ${req.user.name} accepted your skill request`,
        type:    "accepted",
        read:    false,
      });

      global.io.to(String(request.fromUser)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });
    }

    //  Notify for REJECTED (was missing before)
    if (status === "rejected") {
      const notification = await Notification.create({
        user:    request.fromUser,
        message: `❌ ${req.user.name} declined your skill request`,
        type:    "request",
        read:    false,
      });

      global.io.to(String(request.fromUser)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });
    }

    res.json(request);

  } catch (err) {
    res.status(500).json({ msg: "Failed to update request" });
  }
};