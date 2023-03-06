const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const chatMessagesModel = require("../model/chat-messages");
const conversationsModel = require("../model/conversations");

const saveMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("ERROR SAVING MESSAGE", err);
    return next(new HttpError("Error saving message", 422));
  }
  const newMessage = chatMessagesModel(req.body);
  try {
    // Save message here
    const saveMessage = await newMessage.save();
    res.json(saveMessage);
  } catch (err) {
    console.log("Error saving message", err);
    return next(new HttpError("Error saving message", 422));
  }
};

const getMessage = async (req, res, next) => {
  const mid = req.params.mid;
  try {
    const getMessage = await chatMessagesModel.findById(mid);
    res.json(getMessage);
  } catch (err) {
    console.log("Error Fetching messages", err);
    return next(new HttpError("Error Fetching message", err));
  }
};

const getMessageByConversationId = async (req, res, next) => {
  const cid = req.params.cid;
  try {
    const getConversationMessages = await chatMessagesModel
      .find({
        conversationId: cid,
      })
      .sort({ date_sent: "asc" });
    res.json(getConversationMessages);
  } catch (err) {
    console.log("Error Fetching conversation messages", err);
    return next(new HttpError("Error Fetching conversation message", err));
  }
};

exports.saveMessage = saveMessage;
exports.getMessage = getMessage;
exports.getMessageByConversationId = getMessageByConversationId;
