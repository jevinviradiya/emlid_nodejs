const mongoose = require('../config/db_connection');

const verticalDatumSchema = new mongoose.Schema({
  name: String,
  country: String,
  url: String,
  file_name: String,
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('vertical_datum', verticalDatumSchema);
