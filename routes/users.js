const express = require("express");
const router = express.Router();
const userController = require("../controller/users");
const { check } = require("express-validator");

router.post(
  "/register",
  [check("userName").not().isEmpty()],
  userController.registerUser
);

router.get("/:uid", userController.getUser);

router.get("/", userController.getAllUsers);

module.exports = router;
