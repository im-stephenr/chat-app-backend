const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  members: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  conversationId: { type: String },
});

module.exports = mongoose.model("Conversation", conversationSchema);
