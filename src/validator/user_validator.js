const {body, validationResult} = require('express-validator');
const commonError = require('../constants/commanError');
const model = require('../models/index');
const user = model.User;

const validate = [
  body('email')
      .escape()
      .trim()
      .isEmail()
      .isLength({
        min: 1,
      })
      .normalizeEmail({gmail_remove_dots: false})
      .withMessage(commonError.REQUIRED.replace('{fieldname}', 'Email'))
      .custom(async (value) => {
        const isExist = await user.findOne({email: value});
        if (isExist) {
          throw new Error(commonError.EXISTS.replace('{fieldname}', 'Email'));
        }
      }),
  body('password')
      .escape()
      .trim()
      .custom(async (value) => {
        if (value.length < 8) {
          throw new Error('Password must be 8 characters or more');
        } else {
          return value;
        }
      })
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
      .withMessage(
          'Password must contain a number, alphabet and special character',
      )
      .withMessage(commonError.REQUIRED.replace('{fieldname}', 'Password')),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

module.exports = validate;
