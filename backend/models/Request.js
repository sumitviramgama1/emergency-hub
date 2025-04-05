const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);