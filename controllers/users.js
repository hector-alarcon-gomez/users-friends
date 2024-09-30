const User = require('../models/user');

const { validationResult } = require('express-validator');

// TODO: refactored hardcoded status codes
// TODO: refactored hardcoded messages

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('friends');
    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate('friends');
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  const { name, email, friends } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // TODO: validate friend ids exist in DB
    const existingUser = await User.find({ email: email });
    if (existingUser) {
      const error = new Error('Email already exists.');
      error.statusCode = 422;
      throw error;
    }

    const user = new User({
      name,
      email,
      friends,
    });
    await user.save();

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, friends } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // TODO: validate friend ids exist in DB
    const users = await User.find({ _id: userId });
    if (!users) {
      const error = new Error('User does not exist.');
      error.statusCode = 422;
      throw error;
    }
    const user = users.pop();

    user.name = name;
    user.email = email;
    user.friends = friends;
    await user.save();

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};
