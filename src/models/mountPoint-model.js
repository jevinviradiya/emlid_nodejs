const mongoose = require('../config/db_connection');

const mountPointSchema = new mongoose.Schema({
  profile_id: {
    type: mongoose.Types.ObjectId,
    ref: 'NTRIP_profil',
  },
  port: Number,
  address: String,
  mount_point: String,
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('mount_point', mountPointSchema);
