const model = require('../models/index');
const projectModel = model.Project;
const responseData = require('../constants/response');
const helper = require('../constants/helper');

const projectController = {
  createProject: async (req, res, next) => {
    try {
      const findName = await projectModel.findOne({name: req.body.name});
      if (!findName) {
        const csData = await projectModel.create(req.body);
        responseData.sendResponse(res, 'Project Created Successfuly', csData);
      } else {
        helper.logger.error('Project Name Should Be Unique');
        responseData.errorResponse(res, 'Project Name Should Be Unique');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  surveyDetails: async (req, res, next) => {
    try {
      const projectData = await projectModel.find();
      if (projectData.length !== 0) {
        projectData.forEach(async (i) => {
          if (!i.is_deleted) {
            responseData.sendResponse(res, 'All Project Data', projectData);
          } else {
            helper.logger.error('Data Not Found');
            responseData.sendResponse(res, 'Data Not Found', []);
          }
        });
      } else {
        helper.logger.error('Data Not Found');
        responseData.sendResponse(res, 'Data Not Found', []);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  editProject: async (req, res, next) => {
    try {
      const {name, author, description, codes} = req.body;
      const query = {};
      if (name) query.name = name;
      if (author) query.author = author;
      if (description) query.description = description;
      if (codes) query.codes = codes;

      const updateData = await projectModel.findByIdAndUpdate(
          {_id: req.params.id, is_deleted: false},
          {
            $set: {
              ...query,
            },
          },
          {new: true},
      );
      if (updateData) {
        responseData.sendResponse(res, 'Project Details Updated Successfully', updateData);
      } else {
        helper.logger.error('ID Not Found');
        responseData.errorResponse(res, 'ID Not Found');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },

  deleteProject: async (req, res, next) => {
    try {
      const projectData = await projectModel.findOne({_id: req.body._id, name: req.body.name});
      if (projectData && !projectData.is_deleted) {
        const updateData = await projectModel.findByIdAndUpdate({_id: projectData._id}, {is_deleted: true, deletedAt: new Date()});
        responseData.sendResponse(res, 'Project Deleted Successfully', updateData);
      } else {
        helper.logger.error(res, 'Data Not Found');
        responseData.errorResponse(res, 'Data Not Found');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, error);
    }
  },
};

module.exports = projectController;
