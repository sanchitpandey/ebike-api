const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  getNearbyStations,
  createStation,
} = require("../controllers/stationController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// @route    GET /api/stations/nearby
// @desc     Get stations within specified radius
// @access   Private
router.get(
  "/nearby",
  auth,
  [
    check("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be between -90 and 90")
      .toFloat(),
    check("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be between -180 and 180")
      .toFloat(),
    check("maxDistance")
      .optional()
      .isInt({ min: 100, max: 5000 })
      .withMessage("Max distance must be between 100-5000 meters")
      .toInt(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getNearbyStations
);

// @route    POST /api/stations
// @desc     Create a new station
// @access   Private (Admin)
router.post(
  "/",
  auth,
  [
    check("name")
      .trim()
      .notEmpty()
      .withMessage("Station name is required")
      .isLength({ max: 50 })
      .withMessage("Name must be ≤50 characters"),

    check("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude (-90 to 90)")
      .toFloat(),

    check("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude (-180 to 180)")
      .toFloat(),

    check("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be ≥1")
      .toInt(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createStation
);

module.exports = router;
