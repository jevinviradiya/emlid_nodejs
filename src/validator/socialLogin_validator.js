const {body, validationResult} = require('express-validator');

const validate = [
  body('social_id')
      .trim()
      .notEmpty()
      .withMessage('Social ID is required.'),
  body('social_type')
      .trim()
      .notEmpty()
      .withMessage('Social Type is required.'),
  body('email')
      .escape()
      .trim()
      .isLength({
        min: 1,
      })
      .normalizeEmail({gmail_remove_dots: true})
      .withMessage('Email is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

module.exports = validate;
