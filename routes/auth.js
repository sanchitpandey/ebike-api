const express = require("express");
const { check } = require("express-validator");
const { login, signup } = require("../controllers/authController.js");

const router = express.Router();

router.post(
  "/signup",
  [
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post(
  "/login",
  [check("email").isEmail().normalizeEmail(), check("password").exists()],
  login
);

module.exports = router;
