const User = require('../models/user');

const { validationResult } = require('express-validator');

const friendsMap = new Map();
const RELATIONSHIP_LIMIT = 10;
const RELATIONSHIP_NON_EXISTING = -1;

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

    const existingUser = await User.find({ email: email });
    if (existingUser.length > 0) {
      const error = new Error('Email already exists.');
      error.statusCode = 422;
      throw error;
    }

    const user = new User({
      name,
      email,
    });
    await user.save();
    await updateFriends(user, friends);

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

// Update graph map
function updateFriendsMap(userId, friendId) {
  const userIdStr = userId.toString();
  const friendIdStr = friendId.toString();
  if (!friendsMap.has(userIdStr)) {
    friendsMap.set(userIdStr, []);
  }
  friendsMap.set(userIdStr, [...friendsMap.get(userIdStr), friendIdStr]);
}

exports.updateFriends = async (user, friends) => {
  try {
    // TODO: validate friend ids exist in DB
    for (const friendId of friends || []) {
      await user.updateFriend(friendId.toString());
      // Update graph both ways
      updateFriendsMap(user._id, friendId);
      updateFriendsMap(friendId, user._id);
    }
    return true;
  } catch (err) {
    console.log(err);
    const error = new Error('Problem assigning the friends.');
    error.statusCode = 422;
    throw error;
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

    const users = await User.find({ _id: userId });
    if (!users) {
      const error = new Error('User does not exist.');
      error.statusCode = 422;
      throw error;
    }
    const user = users.pop();

    user.name = name;
    user.email = email;
    await user.save();
    await updateFriends(user, friends);

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

function friendLevelBFS(from, to, limit) {
  const queue = [from];
  const visited = new Set([from]);

  if (from === to) {
    return 0;
  }
  if (!friendsMap.has(to)) {
    return RELATIONSHIP_NON_EXISTING;
  }

  let level = 1;
  while (queue.length > 0) {
    let queueLen = queue.length;
    for (let i = 0; i < queueLen; i++) {
      const node = queue.shift();
      const neighbors = friendsMap.get(node);
      for (const neighbor of neighbors) {
        if (neighbor == to) {
          return level;
        }
        if (visited.has(neighbor)) {
          continue;
        }
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    level++;
    if (level > limit) {
      return RELATIONSHIP_NON_EXISTING;
    }
  }
}

exports.getUserRelationship = (req, res, next) => {
  const userId = req.params.id;
  const friendId = req.params.friendId;
  try {
    const level = friendLevelBFS(userId, friendId, RELATIONSHIP_LIMIT);
    res.status(200).json({ data: level });
  } catch (err) {
    next(err);
  }
};
