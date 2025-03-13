const express = require("express");
const { updateBikeStatus } = require("../controllers/bikeController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Update bike status
router.patch("/:bikeId", auth, updateBikeStatus);

module.exports = router;
