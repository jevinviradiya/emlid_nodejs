const mongoose = require('../config/db_connection');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Please fill a valid email address',
    ],
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  google_social_id: {
    type: String,
    default: null,
  },
  facebook_social_id: {
    type: String,
    default: null,
  },
  apple_social_id: {
    type: String,
    default: null,
  },
  is_valid: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    default: null,
  },
  port: {
    type: String,
    default: '',
  },
  last_data_sync: {
    type: Date,
    default: new Date(),
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

module.exports = mongoose.model('user', userSchema);
