const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  const validateUsername = async (req, res, next) => {
    const { username } = req.body


    const existingUsername = await User.findOne({
      where: {username: username}
    })
    if(existingUsername) {
      res.status(500).json({
        message: "User already exists",
        errors: {
          username: "User with that username already exists",
        },


      });
      return
    }
    next()
}

const validateEmail = async (req, res, next) => {
  const { email } = req.body


  const existingEmail = await User.findOne({
    where: {email: email}
  })
  if(existingEmail) {
    res.status(500).json({

        message: "User already exists",
        errors: {
          email: "User with that email already exists"
        }


    });
    return
  }
  next()
};

router.post(
    '/',
    validateSignup,
    validateUsername,
    validateEmail,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;