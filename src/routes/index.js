// routes call
const userRoutes = require('./user-routes');
const verticaldRoutes = require('./verticalDatum-routes');
const datumRoutes = require('./datum-routes');
const csRoutes = require('./project-routes');
const pointRoutes = require('./point-routes');
const NTRIPProfileRoutes = require('./NTRIPProfile-routes');

const routes = (app, router) => {
  app.use('/api/v1', router);
  app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
  });
  app.use((error, req, res, next) => {
    return res.status(error.status || 500).send({message: error.message});
  });

  userRoutes(router);
  verticaldRoutes(router);
  datumRoutes(router);
  csRoutes(router);
  pointRoutes(router);
  NTRIPProfileRoutes(router);
};

module.exports = routes;
