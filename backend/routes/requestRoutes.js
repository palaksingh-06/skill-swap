// const express = require("express");
// const auth = require("../middleware/authMiddleware");

// const {
//   getIncomingRequests,
//   updateRequestStatus,
// } = require("../controllers/requestController");

// const router = express.Router();

// /* ------------------------------
//    GET INCOMING REQUESTS
// -------------------------------- */
// router.get("/incoming", auth, getIncomingRequests);

// /* ------------------------------
//    ACCEPT / REJECT REQUEST
// -------------------------------- */
// router.put("/:id/status", auth, updateRequestStatus);

// /* ------------------------------
//    TEST ROUTE
// -------------------------------- */
// router.get("/", (req, res) => {
//   res.send("Request routes working");
// });

// module.exports = router;

const express = require("express");
const auth = require("../middleware/authMiddleware");

const {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const router = express.Router();

router.post("/send", auth, sendRequest);
router.get("/incoming", auth, getIncomingRequests);
router.put("/:id/status", auth, updateRequestStatus);

module.exports = router;