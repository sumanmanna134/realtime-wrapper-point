const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    default: '0.0',
    required: true,
  },
  size: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: String,
  },
  isSizeMatter: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model('Menu', menuSchema);
