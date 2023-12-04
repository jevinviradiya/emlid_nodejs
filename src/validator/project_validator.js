const {body, validationResult} = require('express-validator');

const validate = [
  body('name')
      .trim()
      .notEmpty()
      .withMessage('Project Name Is Required.'),
  body('codes')
      .trim()
      .notEmpty()
      .withMessage('Codes Is Required.'),
  body('coordinatevalue')
      .trim()
      .notEmpty()
      .withMessage('Coordinate Value Is Required.'),
  body('vertical_datum')
      .trim()
      .notEmpty()
      .withMessage('Vertical Datum Is Required.'),
  body('linear_units')
      .trim()
      .notEmpty()
      .withMessage('Linear Unit Is Required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

module.exports = validate;
