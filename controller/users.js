const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const User = require("../model/users");

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("INPUT ERRORS ", errors);
    return next(new HttpError("Input validation failed", 422));
  }
  const newUser = new User(req.body);

  // check if user exist
  try {
    const checkUser = await User.find({ userName: req.body.userName });
    if (checkUser.length > 0) {
      res.status(200).json({ error: true, message: "User already exist!" });
    }
  } catch (err) {
    return next(new HttpError("Error checking", 422));
  }

  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.log("ERROR SAVING CONSOLE LOG", err);
    return next(new HttpError("Error saving", 422));
  }
};

const getUser = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const getUser = await User.findById(userId);
    if (getUser) {
      res.status(200).json(getUser);
    } else {
      res.status(200).json({ error: true, message: "User does not exist!" });
    }
  } catch (err) {
    return next(new HttpError("Error fetching users", 422));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const getAllUsers = await User.find({}, "-ip");
    if (getAllUsers.length > 0) {
      res.status(200).json(getAllUsers);
    } else {
      res.status(200).json({ error: true, message: "User does not empty!" });
    }
  } catch (err) {
    return next(new HttpError("Error fetching user", 422));
  }
};

exports.registerUser = registerUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
