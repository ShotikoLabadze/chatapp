const router = require("express").Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

router.post("/direct", auth, (req, res) =>
  chatController.createDirectChat(req, res)
);
router.get("/", auth, (req, res) => chatController.getMyChats(req, res));

module.exports = router;
