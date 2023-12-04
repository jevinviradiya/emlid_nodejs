const {body, validationResult} = require('express-validator');

const validate = [
  body('port')
      .trim()
      .notEmpty()
      .withMessage('Port Is Required.'),
  body('address')
      .trim()
      .notEmpty()
      .withMessage('Address Is Required.'),
  body('mount_point')
      .trim()
      .notEmpty()
      .withMessage('Mount Point Is Required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

module.exports = validate;
