const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/users');

const router = express.Router();

const userValidations = [
  body('name').trim().isLength({ min: 5 }),
  body('email').trim().isEmail(),
];

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUser);

router.post('/', userValidations, userController.postUser);

router.patch('/:id', userValidations, userController.patchUser);

router.delete('/:id', userController.deleteUser);

router.get('/:id/relationship/:friendId', userController.getUserRelationship);

module.exports = router;
