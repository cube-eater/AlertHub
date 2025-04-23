const mongoose = require('mongoose');
const Category = require('./Category');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  imageUrl: {
    type: String,   // URL to the uploaded image (can be stored on cloud storage)
  },
  isDraft: {
    type: Boolean,
    default: false,  // Flag to mark whether the report is a draft or submitted
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Report', reportSchema);
