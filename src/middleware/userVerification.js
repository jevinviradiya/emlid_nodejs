require('dotenv').config();
const {verify} = require('jsonwebtoken');
const model = require('../models/index');
const user = model.User;
const responseData = require('../constants/response');

// User authentication
const authentication = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) responseData.errorResponse(res, 'Token not defined');
  else {
    const temporary = authorization.split(' ');
    const token = temporary.length > 0 && temporary[0] === 'Bearer' ? temporary[1] : undefined;

    if (!token) responseData.errorResponse(res, 'Token not defined');

    const userData = await user.findOne({token: token});
    if (userData === null) responseData.errorResponse(res, 'Unauthorized user');
    else {
      if (token == undefined) {
        responseData.errorResponse(res, 'invalide Token!');
      } else {
        verify(token, process.env.USER_PRIVATE_KEY, (err, tokendata) => {
          if (err) {
            responseData.errorResponse(res, err);
          } else if (tokendata._id == undefined) {
            responseData.errorResponse(res, 'Token not defined');
          } else {
            req.tokendata = tokendata;
            next();
          }
        });
      }
    }
  }
};


module.exports = authentication;
