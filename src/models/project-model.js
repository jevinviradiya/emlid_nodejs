const mongoose = require('../config/db_connection');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    default: null,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  codes: {
    type: String,
    default: 0,
  },
  coordinatevalue: {
    type: String,
    default: null,
  },
  vertical_datum: {
    type: String,
    default: null,
  },
  linear_units: {
    type: String,
    default: null,
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

module.exports = mongoose.model('project', projectSchema);
