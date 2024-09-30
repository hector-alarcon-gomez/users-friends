const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.updateFriend = async function (friendId) {
  if (this.friends.includes(friendId)) return false;
  this.friends.push(friendId);
  await this.save();
  const result = await this.model('User').findByIdAndUpdate(
    friendId,
    { $push: { friends: this._id } },
    { new: true }
  );
  return result;
};

module.exports = mongoose.model('User', userSchema);
