const express = require("express");
const router = express.Router();
const { createSkill, getAllSkills } = require("../controllers/skillController");

router.post("/", createSkill);
router.get("/", getAllSkills);

module.exports = router;
