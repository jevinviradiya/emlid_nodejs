require('dotenv').config();
const model = require('../models/index');
const user = model.User;
const responseData = require('../constants/response');
const helper = require('../constants/helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const userController = {
  signup: async (req, res) => {
    try {
      let imagePath;
      const socialInfo = {
        email: req.body.email,
        password: req.body.password,
        social_id: req.body.social_id,
        social_type: req.body.social_type,
        image: req.files.image,
      };

      let responseInfo;
      const resultResponse = async (updatedData, Token) => {
        responseInfo = {
          _id: updatedData._id,
          email: updatedData.email,
          password: updatedData.password,
          name: updatedData.name,
          image: updatedData.image,
          social_id: updatedData.social_id,
          social_type: socialInfo.social_type,
          token: Token,
        };
      };

      if (req.body.login_type == 0) {
        if (req.body.email == undefined) {
          responseData.errorResponse(res, 'Email Is Required');
        } else if (req.body.password == undefined) {
          responseData.errorResponse(res, 'Password Is Required');
        } else {
          const userData = await user.findOne({email: socialInfo.email});
          if (!userData) {
            if (socialInfo.image == undefined || socialInfo.image == '') {
              imagePath = helper.generateImage(socialInfo.email);
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }
            socialInfo.password = await helper.HasPass(req.body.password);
            const userInfoData = {
              email: socialInfo.email,
              password: socialInfo.password,
              image: imagePath,
            };
            const saveUserData = await user.create(userInfoData);
            const authToken = jwt.sign({_id: saveUserData._id}, process.env.USER_PRIVATE_KEY);
            await user.updateOne({email: socialInfo.email}, {token: authToken});

            resultResponse(saveUserData, authToken);
            responseData.sendResponse(res, 'User Created Successfully', responseInfo);
          } else {
            responseData.errorResponse(res, 'This Email Is Already In Use.');
          };
        }
      }
      if (req.body.login_type == 1) {
        if (req.body.social_id == undefined) {
          responseData.errorResponse(res, 'Social ID Is Required');
        } else if (req.body.social_type == undefined) {
          responseData.errorResponse(res, 'Social Type Is Required');
        } else {
          const userData = await user.findOne({email: socialInfo.email});
          if (!userData) {
            let type;
            if (socialInfo.image == undefined || socialInfo.image == '') {
              const imageName = socialInfo.email || 'test_email@gmail.com';
              imagePath = helper.generateImage(imageName);
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }

            let addData = {};
            if (socialInfo.social_type == 'google') {
              addData = {
                email: socialInfo.email,
                password: socialInfo.password,
                google_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'google';
            }
            if (socialInfo.social_type == 'facebook') {
              addData = {
                email: socialInfo.email,
                password: socialInfo.password,
                facebook_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'facebook';
            }
            if (socialInfo.social_type == 'apple') {
              addData = {
                email: socialInfo.email,
                password: socialInfo.password,
                apple_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'apple';
            }
            const userAdd = new user({...addData});
            await userAdd.save();

            const getToken = jwt.sign({_id: userAdd._id}, process.env.USER_PRIVATE_KEY);
            await user.updateOne({email: socialInfo.email}, {token: getToken});

            if (getToken) {
              resultResponse(userAdd, getToken);
              responseData.sendResponse(res, `Registration successful With ${type}.`, responseInfo);
            }
          } else {
            let type;
            if (socialInfo.image == undefined || socialInfo.image == '') {
              const imageName = socialInfo.email || 'test_email@gmail.com';
              imagePath = helper.generateImage(imageName);
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }

            if (socialInfo.social_type == 'google') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      google_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'google';
            }
            if (socialInfo.social_type == 'facebook') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      facebook_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'facebook';
            }
            if (socialInfo.social_type == 'apple') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      apple_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'apple';
            }
            const getToken = jwt.sign({_id: userData._id}, process.env.USER_PRIVATE_KEY);
            const updatedData = await user.findOneAndUpdate({email: socialInfo.email}, {token: getToken});

            resultResponse(updatedData, getToken);
            responseData.sendResponse(res, `Registration successful With ${type}`, responseInfo);
          }
        }
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  login: async (req, res, next) => {
    try {
      if (req.body.login_type == undefined) {
        responseData.errorResponse(res, 'Please Enter Login Type 0/1');
      } else {
        if (req.body.login_type == 0) {
          if (req.body.email == undefined) {
            responseData.errorResponse(res, 'Email Is Required');
          } else if (req.body.password == undefined) {
            responseData.errorResponse(res, 'Password Is Required');
          } else {
            const findExist = await user.findOne({email: req.body.email});
            if (findExist) {
              const checkingPassword = bcrypt.compareSync(req.body.password, findExist.password);
              if (checkingPassword) {
                if (!findExist.is_deleted) {
                  const authToken = jwt.sign({_id: findExist._id}, process.env.USER_PRIVATE_KEY);
                  await user.updateOne({email: req.body.email}, {token: authToken});
                  const isUserData = await user.findOne({email: req.body.email});
                  responseData.sendResponse(res, 'User Login Successfully', isUserData);
                } else {
                  responseData.errorResponse(res, 'Account Not Exist');
                }
              } else {
                helper.logger.error('Please check your password again');
                responseData.errorResponse(res, 'Please check your password again');
              }
            } else {
              helper.logger.error('Please check your email again');
              responseData.errorResponse(res, 'Please check your email again');
            }
          }
        } else if (req.body.login_type == 1) {
          const socialInfo = {
            social_id: req.body.social_id,
            social_type: req.body.social_type,
          };
          if (socialInfo.social_id == undefined) {
            responseData.errorResponse(res, 'Social ID Is Required');
          } else if (socialInfo.social_type == undefined) {
            responseData.errorResponse(res, 'Social Type Is Required');
          } else {
            let responseInfo;
            const resultResponse = async (updatedData, Token) => {
              responseInfo = {
                _id: updatedData._id,
                email: updatedData.email,
                password: updatedData.password,
                name: updatedData.name,
                image: updatedData.image,
                social_id: updatedData.social_id,
                social_type: socialInfo.social_type,
                token: Token,
              };
            };

            if (socialInfo.social_type == 'google') {
              const findUserData = await user.findOne({google_social_id: socialInfo.social_id});
              if (findUserData) {
                const getToken = jwt.sign({_id: findUserData._id}, process.env.USER_PRIVATE_KEY);
                const updatedData = await user.findOneAndUpdate({google_social_id: socialInfo.social_id}, {token: getToken});

                resultResponse(updatedData, getToken);
                responseData.sendResponse(res, `Successfully Login With Google`, responseInfo);
              } else {
                responseData.errorResponse(res, 'Please Check Social ID');
              }
            }
            if (socialInfo.social_type == 'facebook') {
              const findUserData = await user.findOne({facebook_social_id: socialInfo.social_id});
              if (findUserData) {
                const getToken = jwt.sign({_id: findUserData._id}, process.env.USER_PRIVATE_KEY);
                const updatedData = await user.findOneAndUpdate({facebook_social_id: socialInfo.social_id}, {token: getToken});

                resultResponse(updatedData, getToken);
                responseData.sendResponse(res, `Successfully Login With Facebook`, responseInfo);
              } else {
                responseData.errorResponse(res, 'Please Check Social ID');
              }
            }
            if (socialInfo.social_type == 'apple') {
              const findUserData = await user.findOne({apple_social_id: socialInfo.social_id});
              if (findUserData) {
                const getToken = jwt.sign({_id: findUserData._id}, process.env.USER_PRIVATE_KEY);
                const updatedData = await user.findOneAndUpdate({apple_social_id: socialInfo.social_id}, {token: getToken});

                resultResponse(updatedData, getToken);
                responseData.sendResponse(res, `Successfully Login With Apple`, responseInfo);
              } else {
                responseData.errorResponse(res, 'Please Check Social ID');
              }
            };
          }
        } else {
          responseData.errorResponse(res, 'Please Enter Valid Login Type 0/1');
        }
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  getUserDetails: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const userDetails = await user.findOne({token: checkToken});
      if (userDetails) {
        if (!userDetails.is_deleted) {
          const userInfo = {
            user_id: userDetails._id,
            user_name: userDetails.name,
            profile_image: userDetails.image,
            email: userDetails.email,
            lastdatasync: userDetails.last_data_sync,
            address: userDetails.address,
            port: userDetails.port,
          };
          responseData.sendResponse(res, 'User Details', userInfo);
        } else {
          helper.logger.error('Account Not Exist');
          responseData.errorResponse(res, 'Account Not Exist');
        }
      } else {
        helper.logger.error('Invalid Auth Token');
        responseData.errorResponse(res, 'Invalid Auth Token');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  social_login: async (req, res, next) => {
    try {
      let imagePath;
      const socialInfo = {
        email: req.body.email,
        password: req.body.password,
        social_id: req.body.social_id,
        social_type: req.body.social_type,
        image: req.files.image,
        login_type: req.body.login_type,
      };

      let responseInfo;
      const resultResponse = async (updatedData, Token) => {
        responseInfo = {
          _id: updatedData._id,
          email: updatedData.email,
          password: updatedData.password,
          name: updatedData.name,
          image: updatedData.image,
          social_id: updatedData.social_id,
          social_type: socialInfo.social_type,
          token: Token,
        };
      };

      const removeImage = async (userData) => {
        if (userData.image !== null || userData.image !== '') {
          const oldImagePath = userData.image.split('uploads')[1];
          if (oldImagePath) {
            fs.unlink(`uploads/${oldImagePath}`, (err) => {
              if (err) {
                helper.logger.error(err);
                throw err;
              }
              console.log('Delete File successfully.');
            });
          } else {
            helper.logger.error('Image Path Not Found');
            return responseData.errorResponse(res, 'Image Path Not Found');
          }
        };
      };

      if (socialInfo.login_type == 1) {
        if (socialInfo.email == undefined || socialInfo.email == '') {
          const userData = await user.findOne({facebook_social_id: socialInfo.social_id});
          if (userData) {
            removeImage(userData);

            if (socialInfo.image == undefined || socialInfo.image == '') {
              imagePath = helper.generateImage('update@gmail.com');
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }

            if (socialInfo.social_type == 'facebook') {
              await user.updateOne({facebook_social_id: socialInfo.social_id},
                  {
                    $set: {
                      email: socialInfo.email,
                      facebook_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
            }
            const getToken = jwt.sign({_id: userData._id}, process.env.USER_PRIVATE_KEY);
            const updatedData = await user.findOneAndUpdate({facebook_social_id: socialInfo.social_id}, {token: getToken});

            resultResponse(updatedData, getToken);
            responseData.sendResponse(res, `Successfully Login With Facebook`, responseInfo);
          } else {
            if (socialInfo.social_type == 'facebook') {
              if (socialInfo.image == undefined || socialInfo.image == '') {
                imagePath = helper.generateImage('test@gmail.com');
              } else {
                imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
              }

              const addData = {
                facebook_social_id: socialInfo.social_id,
                social_type: socialInfo.social_type,
                image: imagePath,
              };
              const userAdd = await user.create(addData);
              const getToken = jwt.sign({_id: userAdd._id}, process.env.USER_PRIVATE_KEY);
              await user.updateOne({facebook_social_id: userAdd.facebook_social_id}, {token: getToken});

              resultResponse(userAdd, getToken);
              responseData.sendResponse(res, 'Successfully Register With Facebook', responseInfo);
            }
          }
        } else {
          const isUser = await user.findOne({email: socialInfo.email});
          if (isUser) {
            let type;
            removeImage(isUser);

            if (socialInfo.image == undefined || socialInfo.image == '') {
              imagePath = helper.generateImage(socialInfo.email);
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }

            if (socialInfo.social_type == 'google') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      google_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'google';
            }
            if (socialInfo.social_type == 'facebook') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      facebook_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'facebook';
            }
            if (socialInfo.social_type == 'apple') {
              await user.updateOne({email: socialInfo.email},
                  {
                    $set: {
                      email: socialInfo.email,
                      apple_social_id: socialInfo.social_id,
                      image: imagePath,
                      is_valid: true,
                    },
                  },
              );
              type = 'apple';
            }
            const getToken = jwt.sign({_id: isUser._id}, process.env.USER_PRIVATE_KEY);
            const updatedData = await user.findOneAndUpdate({email: socialInfo.email}, {token: getToken});

            resultResponse(updatedData, getToken);
            responseData.sendResponse(res, `Successfully Login With ${type}`, responseInfo);
          } else {
            let type;
            if (socialInfo.image == undefined || socialInfo.image == '') {
              imagePath = helper.generateImage(socialInfo.email);
            } else {
              imagePath = `${process.env.IMAGE_PATH}/${socialInfo.image[0].path}`;
            }

            let addData = {};
            if (socialInfo.social_type == 'google') {
              addData = {
                email: socialInfo.email,
                google_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'google';
            }
            if (socialInfo.social_type == 'facebook') {
              addData = {
                email: socialInfo.email,
                facebook_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'facebook';
            }
            if (socialInfo.social_type == 'apple') {
              addData = {
                email: socialInfo.email,
                apple_social_id: socialInfo.social_id,
                image: imagePath,
                is_valid: true,
              };
              type = 'apple';
            }
            const userAdd = new user({...addData});
            await userAdd.save();

            const getToken = jwt.sign({_id: userAdd._id}, process.env.USER_PRIVATE_KEY);
            await user.updateOne({email: socialInfo.email}, {token: getToken});

            if (getToken) {
              resultResponse(userAdd, getToken);
              responseData.sendResponse(res, `Registration successful With ${type}.`, responseInfo);
            }
          }
        }
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const userInfo = await user.findOne({_id: req.params.id, is_deleted: false});
      if (!userInfo) {
        helper.logger.error('User ID not Found');
        responseData.errorResponse(res, 'User ID not Found');
      } else {
        if (userInfo.token == checkToken) {
          const {name, email, password} = req.body;
          const query = {};
          if (name) query.name = name;
          if (email) {
            const checkEmail = await user.find({email: email});
            if (checkEmail.length === 0) {
              query.email = email.toLowerCase();
            } else {
              helper.logger.error('Please Enter A Unique Email. This Email Already Exist');
              return responseData.errorResponse(res, 'Please Enter A Unique Email. This Email Already Exist');
            }
          };
          if (password) query.password = await helper.HasPass(password);
          const updateData = await user.findByIdAndUpdate(
              {_id: req.params.id},
              {
                $set: {
                  ...query,
                },
              },
              {new: true},
          );
          if (updateData) {
            responseData.sendResponse(res, 'User Data Updated Successfully', updateData);
          }
        } else {
          helper.logger.error('Invalid Authentication!');
          responseData.errorResponse(res, 'Invalid Authentication!');
        }
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  updateImage: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const imagePath = req.files.image;
      const userImage = await user.findOne({_id: req.params.id, is_deleted: false});
      if (userImage) {
        if (userImage.token == checkToken) {
          if (userImage.image == null || userImage.image == '') {
            await user.updateOne({_id: req.params.id},
                {
                  $set:
                  {image: `${process.env.IMAGE_PATH}/uploads/${imagePath[0].filename}`},
                },
            );
            const userData = await user.find({_id: req.params.id});
            responseData.sendResponse(res, 'Image Uploaded successfully', userData);
          } else {
            const oldImagePath = userImage.image.split('uploads/')[1];
            if (oldImagePath) {
              fs.unlink(`uploads/${oldImagePath}`, (err) => {
                if (err) {
                  throw err;
                }
                console.log('Delete File successfully.');
              });
              await user.updateOne({_id: req.params.id},
                  {
                    $set:
                    {image: `${process.env.IMAGE_PATH}/uploads/${imagePath[0].filename}`},
                  },
              );
              const userData = await user.find({_id: req.params.id});
              responseData.sendResponse(res, 'Image Updated Successfully', userData);
            }
          }
        } else {
          helper.logger.error('Invalid Authentication!');
          responseData.errorResponse(res, 'Invalid Authentication!');
        }
      } else {
        helper.logger.error('User ID Not Found');
        responseData.errorResponse(res, 'User ID Not Found');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      await user.updateOne({token: checkToken}, {token: null, is_valid: false});
      const tokenData = {token: null};
      responseData.sendResponse(res, 'User Logout Successfully', tokenData);
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  deleteUserAccount: async (req, res, next) => {
    try {
      const checkToken = req.headers.authorization.replace('Bearer ', '');
      const userDetails = await user.findOne({token: checkToken});
      if (userDetails && !userDetails.is_deleted) {
        await user.updateOne({token: checkToken}, {is_deleted: true, deletedAt: new Date()});
        responseData.sendResponse(res, 'User Account Deleted Successfully', userDetails);
      } else {
        helper.logger.error('Account Not Exist');
        responseData.errorResponse(res, 'Account Not Exist');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = userController;
