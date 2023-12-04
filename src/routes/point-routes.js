const {pointController} = require('../controller/index');
const authentication = require('../middleware/userVerification');

const pointRoutes = (app) => {
  app.post('/create-point', authentication, (req, res, next) => pointController.createPoint(req, res, next));
  app.get('/get-points/:id', authentication, (req, res, next) => pointController.getPointDetails(req, res, next));
  app.post('/update-point/:id', authentication, (req, res, next) => pointController.updatePoint(req, res, next));
  app.delete('/delete-point/:id', authentication, (req, res, next) => pointController.deletePoint(req, res, next));
};

module.exports = pointRoutes;
