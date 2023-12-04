const {datumController} = require('../controller');

const datumRoutes = (app) => {
  app.post('/create-datum', (req, res, next)=> datumController.createDatum(req, res, next));
  app.get('/get-ellipsoid/:id', (req, res, next) => datumController.getEllipsoid(req, res, next));
};

module.exports = datumRoutes;
