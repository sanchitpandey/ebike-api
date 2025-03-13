const express = require("express");
const {
  startJourney,
  endJourney,
} = require("../controllers/journeyController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/start", auth, startJourney);
router.post("/end", auth, endJourney);

module.exports = router;
