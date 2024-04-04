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
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email'),
      check('firstName')
      .exists({ checkFalsy: true })
      .isAlpha()
      .isLength({ min: 4 , max: 30})
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .isAlpha()
      .isLength({ min: 2 , max: 30})
      .withMessage('Last Name is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password is required'),
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

      //Issue 2: missing firstName and lastName - critical, missing properties can break the frontend
      // let errorBody = {
      //   message: "Bad Request",
      //   errors: {}
      // };
      // if(!firstName) errorBody.errors.firstName = "First Name is required";
      // if(!lastName) errorBody.errors.lastName = "Last Name is required";
      // if(errorBody.errors.firstName || errorBody.errors.lastName) return res.status(500).json(errorBody);

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