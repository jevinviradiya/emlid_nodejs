const mongoose = require('../config/db_connection');

const ntripSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  profile_name: {
    type: String,
    default: null,
  },
  port: {
    type: Number,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  user_name: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  mount_point: {
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

module.exports = mongoose.model('NTRIP_profile', ntripSchema);
