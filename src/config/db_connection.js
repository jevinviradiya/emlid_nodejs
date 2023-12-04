const mongoose = require('mongoose');
const config = require('./config.json');

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(config.db_connect, connectionOptions);

module.exports = mongoose;
