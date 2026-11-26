"use strict";

const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("REQUEST BODY>>>>", req.body);
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Hey you!!",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// module.exports = {
//   register,
//   login,
//   getMe,
// };
