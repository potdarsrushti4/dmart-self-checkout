const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
});

module.exports = mongoose.model('User', userSchema);
