const model = require('../models/index');
const datumModel = model.Datum;
const responseData = require('../constants/response');
const helper = require('../constants/helper');

const datumController = {
  createDatum: async (req, res, next) =>{
    try {
      const info = {
        ellipsoid: req.body.ellipsoid,
        axis: req.body.axis,
      };
      const datumData = await datumModel.create(info);
      responseData.sendResponse(res, 'Datum Created Successfully', datumData);
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  getEllipsoid: async (req, res, next) =>{
    try {
      const ellipData = await datumModel.findOne({_id: req.params.id});
      if (ellipData) {
        responseData.sendResponse(res, 'Datums Data', ellipData);
      } else {
        helper.logger.error('ID Not Found');
        responseData.errorResponse(res, 'ID Not Found');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = datumController;
