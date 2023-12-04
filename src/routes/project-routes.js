const {projectController} = require('../controller/index');
const validator = require('../validator/index');

const csRoutes = (app) => {
  app.post('/create-project', validator.projectValidator, (req, res, next) => projectController.createProject(req, res, next));
  app.get('/survey-details', (req, res, next) => projectController.surveyDetails(req, res, next));
  app.post('/edit-project/:id', (req, res, next) => projectController.editProject(req, res, next));
  app.post('/delete-project', (req, res, next) => projectController.deleteProject(req, res, next));
};

module.exports = csRoutes;
