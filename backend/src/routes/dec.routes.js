const express = require("express");
const router = express.Router();
const decContoller = require("../controllers/decController");

// POST /logout
router.post("/", decContoller.logout);

module.exports = router;

