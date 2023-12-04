const mongoose = require('../config/db_connection');

const datumSchema = new mongoose.Schema({
  ellipsoid: String,
  axis: String,
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('datum', datumSchema);
