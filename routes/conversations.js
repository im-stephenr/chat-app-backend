const express = require("express");
const router = express.Router();
const conversationsController = require("../controller/conversations");
const { check } = require("express-validator");

router.post("/new", conversationsController.saveConversation);

router.get("/get/:fId/:uId", conversationsController.getConversation);

module.exports = router;
