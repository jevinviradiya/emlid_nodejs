const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// http://localhost:3000/api-docs/#/

app.get('/', (req, res) => {
  res.send('Running');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

routes(app, router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
