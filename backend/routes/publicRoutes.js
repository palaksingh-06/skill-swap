const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/publicController");

// router.get("/user-by-name/:name", getUserByName);
router.get("/user/:id", getUserById);

module.exports = router;
