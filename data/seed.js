const User = require('../models/user');

const { updateFriends } = require('./../controllers/users');

const up = async () => {
  const user1 = new User({
    name: 'John',
    email: 'john@email.com',
    friends: [],
  });
  const user2 = new User({
    name: 'Jane',
    email: 'jane@email.com',
    friends: [],
  });
  const user3 = new User({ name: 'Tom', email: 'tom@email.com', friends: [] });
  const user4 = new User({
    name: 'Frank',
    email: 'frank@email.com',
    friends: [],
  });

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();

  await updateFriends(user1, [user2._id]);
  await updateFriends(user2, [user3._id]);
  await updateFriends(user3, [user4._id]);

  console.log(`DB seeded`);
};

const down = async () => {
  // Removes all registries with @email.com
  await User.deleteMany({ email: /@email.com/ });
  console.log(`DB cleaned`);
};

module.exports = { up, down };
