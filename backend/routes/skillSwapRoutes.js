const express = require("express");
const router = express.Router();

const { getFeaturedSwaps } = require("../controllers/skillSwapController");

router.get("/featured", getFeaturedSwaps);

module.exports = router;
