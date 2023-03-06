const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const conversationModel = require("../model/conversations");

const saveConversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("ERROR SAVING CONVERSATIONS", errors);
    return next(new HttpError("Error Saving Conversation", 422));
  }

  const conversationData = new conversationModel(req.body);

  try {
    // save conversations
    const newConversation = await conversationData.save();
    res.json(newConversation);
  } catch (err) {
    console.log("Error Saving Conversations", err);
    return next(new HttpError("Error Saving Conversation", 422));
  }
};

const getConversation = async (req, res, next) => {
  try {
    const fId = req.params.fId;
    const uId = req.params.uId;

    const getConversation = await conversationModel.find({
      members: { $all: [fId, uId] },
    });
    res.json(getConversation);
  } catch (err) {
    console.log("Error fetching conversation", err);
    return next(new HttpError("Error fetching conversation", 422));
  }
};

exports.saveConversation = saveConversation;
exports.getConversation = getConversation;
