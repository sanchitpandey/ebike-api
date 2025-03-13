const express = require("express");
const {
  updateBikeStatus,
  createBike,
  deleteBike,
} = require("../controllers/bikeController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Update bike status
router.patch("/:bikeId", auth, updateBikeStatus);
router.post("/", auth, createBike);
router.delete("/:bikeId", auth, deleteBike);

module.exports = router;
