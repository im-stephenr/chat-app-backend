const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  ip: { type: String, required: true },
  date_registered: { type: Date, default: Date.now },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
