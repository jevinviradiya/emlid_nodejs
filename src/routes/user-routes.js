const {userController} = require('../controller');
// const validator = require('../validator/index');
const cpUpload = require('../middleware/multer');
const authentication = require('../middleware/userVerification');

const userRoutes = (app) => {
  app.post('/signup', cpUpload, (req, res, next) => userController.signup(req, res, next));
  app.post('/login', (req, res, next) => userController.login(req, res, next));
  app.get('/user-details', authentication, (req, res, next) => userController.getUserDetails(req, res, next));
  app.post('/social-login', cpUpload, (req, res, next) => userController.social_login(req, res, next));
  app.put('/update-userinfo/:id', authentication, (req, res, next) => userController.updateUser(req, res, next));
  app.put('/update-image/:id', authentication, cpUpload, (req, res, next) => userController.updateImage(req, res, next));
  app.get('/logout', authentication, (req, res, next) => userController.logout(req, res, next));
  app.get('/delete-account', authentication, (req, res, next) => userController.deleteUserAccount(req, res, next));
};

module.exports = userRoutes;
