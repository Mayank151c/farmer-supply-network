const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: 'N/A'
  },
  type: {
    type: String,
    enum: ['Farmer', 'Distributor', 'Retailer'],
    required: true
  },
  tokens: [String]
});

module.exports = mongoose.model('User', userSchema);
