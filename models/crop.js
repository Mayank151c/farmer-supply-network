const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cropname: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },

});

module.exports = mongoose.model('Crop', cropSchema);
