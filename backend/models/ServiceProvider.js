const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ServiceProviderSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  serviceType: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true }, // Add phoneNumber field
});

ServiceProviderSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);