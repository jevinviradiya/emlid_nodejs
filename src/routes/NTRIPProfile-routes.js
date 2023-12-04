const {NTRIPProfileController} = require('../controller/index');
const authentication = require('../middleware/userVerification');
const validator = require('../validator/index');

const NTRIPProfileRoutes = (app) => {
  app.post('/create-profile', validator.NTRIPProfileValidator, authentication, (req, res, next) => NTRIPProfileController.createProfile(req, res, next));
  app.get('/mount-list', (req, res, next) => NTRIPProfileController.mountList(req, res, next));
  app.get('/profile-details/:id', authentication, (req, res, next) => NTRIPProfileController.getProfileDetails(req, res, next));
  app.post('/update-profile/:id', authentication, (req, res, next) => NTRIPProfileController.updateProfile(req, res, next));
  app.delete('/delete-profile/:id', authentication, (req, res, next) => NTRIPProfileController.deleteProfile(req, res, next));
};

module.exports = NTRIPProfileRoutes;
