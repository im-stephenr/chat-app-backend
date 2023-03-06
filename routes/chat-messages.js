const express = require("express");
const router = express.Router();
const chatMessageController = require("../controller/chat-messages");
const { check } = require("express-validator");

router.post("/save-message", chatMessageController.saveMessage);

router.get("/get-message/:mid", chatMessageController.getMessage);

router.get(
  "/get-conversation-messages/:cid",
  chatMessageController.getMessageByConversationId
);

module.exports = router;
