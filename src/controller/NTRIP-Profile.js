const model = require('../models/index');
const NTRIPProfileModel = model.NTRIPProfile;
const mountPointModel = model.MountPoint;
const userModel = model.User;
const responseData = require('../constants/response');
const helper = require('../constants/helper');

const NTRIPProfileController = {
  createProfile: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const profileInfo = {
          user_id: checkingUserData._id,
          profile_name: req.body.profile_name,
          port: req.body.port,
          address: req.body.address,
          user_name: req.body.user_name,
          password: req.body.password,
          mount_point: req.body.mount_point,
        };
        const addData = await NTRIPProfileModel.create(profileInfo);
        await mountPointModel.create({
          profile_id: addData._id,
          port: profileInfo.port,
          address: profileInfo.address,
          mount_point: profileInfo.mount_point,
        });
        responseData.sendResponse(res, 'NTRIP Profile Created Successfully', addData);
      } else {
        helper.logger.error('Invalid Authentication');
        responseData.errorResponse(res, 'Invalid Authentication');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  mountList: async (req, res, next) => {
    try {
      const getData = await mountPointModel.find();
      if (getData.length !== 0) {
        getData.forEach(async (i)=> {
          if (!i.is_deleted) {
            responseData.sendResponse(res, 'Mount Point List', getData);
          } else {
            helper.logger.error('Data Not Found');
            responseData.sendResponse(res, 'Data Not Found', []);
          }
        });
      } else {
        helper.logger.error('Not Found Any Data');
        responseData.sendResponse(res, 'Not Found Any Data', []);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  getProfileDetails: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const checkingUserData = await userModel.findOne({token: checkToken});
      if (checkingUserData) {
        const profileData = await NTRIPProfileModel.findOne({_id: req.params.id, user_id: checkingUserData._id, is_deleted: false});
        if (profileData) {
          responseData.sendResponse(res, 'NTRIP Profile Details', profileData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data Not Found');
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

  updateProfile: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const userData = await userModel.findOne({token: checkToken});
      if (userData) {
        const {profile_name, port, address, user_name, password, mount_point} = req.body;
        const query = {};
        if (profile_name) query.profile_name = profile_name;
        if (port) query.port = port;
        if (address) query.address = address;
        if (user_name) query.user_name = user_name;
        if (password) query.password = password;
        if (mount_point) query.mount_point = mount_point;

        const updateData = await NTRIPProfileModel.findByIdAndUpdate(
            {_id: req.params.id, user_id: userData._id, is_deleted: false},
            {
              $set: {
                ...query,
              },
            },
            {new: true},
        );
        await mountPointModel.updateOne(
            {profile_id: req.params.id, is_deleted: false},
            {
              $set: {
                ...query,
              },
            },
            {new: true},
        );
        if (updateData) {
          responseData.sendResponse(res, 'Profile Updated Successfully', updateData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data Not Found');
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

  deleteProfile: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const userData = await userModel.findOne({token: checkToken});
      if (userData) {
        const profileData = await NTRIPProfileModel.findOne({_id: req.params.id, user_id: userData._id, is_deleted: false});
        if (profileData) {
          await NTRIPProfileModel.updateOne({_id: profileData._id}, {is_deleted: true, deletedAt: new Date()});
          await mountPointModel.updateOne({profile_id: profileData._id}, {is_deleted: true, deletedAt: new Date()});
          responseData.sendResponse(res, 'Profile Deleted Successfully', profileData);
        } else {
          helper.logger.error('Data Not Found');
          responseData.errorResponse(res, 'Data Not Found');
        }
      } else {
        helper.logger.error('Invalid Authentication');
        responseData.errorResponse(res, 'Invalid Authentication');
      }
    } catch (error) {
      helper.logger.error(res, error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = NTRIPProfileController;
