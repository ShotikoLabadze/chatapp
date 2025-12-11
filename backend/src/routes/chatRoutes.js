const express = require("express");
const router = express.Router();
const { createDirectChat, getChats } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createDirectChat);
router.get("/", authMiddleware, getChats);

module.exports = router;
