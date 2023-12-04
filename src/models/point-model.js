const mongoose = require('../config/db_connection');

const pointSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    default: null,
  },
  desc: {
    type: String,
    default: null,
  },
  latitude: {
    type: String,
    default: null,
  },
  longitude: {
    type: String,
    default: null,
  },
  east: {
    type: String,
    default: null,
  },
  north: {
    type: String,
    default: null,
  },
  elevation: {
    type: String,
    default: null,
  },
  codes: {
    type: Number,
    default: 0,
  },
  coordinate_system: {
    type: String,
    default: 'Local',
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('point', pointSchema);
