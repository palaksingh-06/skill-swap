const express = require("express");
const router = express.Router();
const { getSkillMatches } = require("../controllers/matchController");

router.get("/skill-match/:userId", getSkillMatches);

module.exports = router;
