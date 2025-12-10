const router = require("express").Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, messageController.sendMessage);
router.get("/:chatId", auth, messageController.getChatMessages);

module.exports = router;
