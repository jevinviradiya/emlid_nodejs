const model = require('../models/index');
const verticalDatumModel = model.VerticalDatum;
const responseData = require('../constants/response');
const helper = require('../constants/helper');

const verticalDatumController = {
  createVerticalDatum: async (req, res, next) => {
    try {
      const fileData = req.files.url;
      const info = {
        name: req.body.name,
        country: req.body.country,
        url: `${process.env.IMAGE_PATH}/uploads/${fileData[0].filename}`,
        file_name: req.body.file_name,
      };
      const vdData = await verticalDatumModel.create(info);
      responseData.sendResponse(res, 'Successfully Added', vdData);
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  getVerticalDList: async (req, res, next) => {
    try {
      const vdInfo = await verticalDatumModel.findOne({name: req.body.name, country: req.body.country});
      if (vdInfo) {
        responseData.sendResponse(res, 'Vertical Datum Info', vdInfo);
      } else {
        helper.logger.error('Data Not Found');
        responseData.errorResponse(res, 'Data Not Found');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = verticalDatumController;
