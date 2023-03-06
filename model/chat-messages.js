const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatMesagesSchema = new Schema({
  conversationId: { type: String },
  sender_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  receiver_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  room: { type: String },
  message: { type: String },
  date_sent: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", chatMesagesSchema);
