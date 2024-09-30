const User = require('../models/user');

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

  user1.friends.push(user2._id);
  user2.friends.push(user1._id);

  user3.friends.push(user2._id);
  user2.friends.push(user3._id);

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();

  console.log(`DB seeded`);
};

const down = async () => {
  // Removes all registries with @email.com
  await User.deleteMany({ email: /@email.com/ });
  console.log(`DB cleaned`);
};

module.exports = { up, down };
