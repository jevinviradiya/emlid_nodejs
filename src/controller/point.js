const model = require('../models/index');
const pointModel = model.Point;
const userModel = model.User;
const responseData = require('../constants/response');
const helper = require('../constants/helper');

const pointController = {
  createPoint: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const info = {
          name: req.body.name,
          user_id: checkingUserData._id,
          desc: req.body.desc,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          east: req.body.east,
          north: req.body.north,
          elevation: req.body.elevation,
          codes: req.body.codes,
          coordinate_system: req.body.coordinate_system,
        };
        const findName = await pointModel.findOne({name: info.name});
        if (!findName) {
          const createData = await pointModel.create(info);
          responseData.sendResponse(res, 'Point Created Successfully', createData);
        } else {
          helper.logger.error('Point Name Should Be Unique');
          responseData.errorResponse(res, 'Point Name Should Be Unique');
        };
      } else {
        helper.logger.error('Invalid Authentication');
        responseData.errorResponse(res, 'Invalid Authentication');
      };
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  getPointDetails: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const pointData = await pointModel.findOne({_id: req.params.id, user_id: checkingUserData._id, is_deleted: false});
        if (pointData) {
          responseData.sendResponse(res, 'Success', pointData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data not Found');
        }
      } else {
        helper.logger.error('Invalid Authentication Provided');
        responseData.errorResponse(res, 'Invalid Authentication Provided');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  updatePoint: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const {name, desc, codes} = req.body;
        const query = {};
        if (name) query.name = name;
        if (desc) query.desc = desc;
        if (codes) query.codes = codes;

        const updateData = await pointModel.findByIdAndUpdate(
            {_id: req.params.id, user_id: checkingUserData._id, is_deleted: false},
            {
              $set: {
                ...query,
              },
            },
            {new: true},
        );
        if (updateData) {
          responseData.sendResponse(res, 'Point Data Updated Successfully', updateData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data Not Found');
        }
      } else {
        helper.logger.error('Invalid Authentication');
        responseData.errorResponse(res, 'Invalid Authentication');
      };
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  deletePoint: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const pointData = await pointModel.findOne({_id: req.params.id, user_id: checkingUserData._id});
        if (pointData) {
          await pointModel.updateOne({_id: req.params.id}, {is_deleted: true, deletedAt: new Date()});
          responseData.sendResponse(res, 'Point Deleted Successfully', pointData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data Not found');
        }
      } else {
        helper.logger.error('Invalid Authentication');
        responseData.errorResponse(res, 'Invalid Authentication');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = pointController;
