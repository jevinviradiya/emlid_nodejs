const {verticalDatumController} = require('../controller');
const cpUpload = require('../middleware/multer');

const verticaldRoutes = (app) => {
  app.post('/create-verticaldatum', cpUpload, (req, res, next) => verticalDatumController.createVerticalDatum(req, res, next));
  app.post('/verticaldatum-list', (req, res, next) => verticalDatumController.getVerticalDList(req, res, next));
};

module.exports = verticaldRoutes;
