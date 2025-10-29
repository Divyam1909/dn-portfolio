const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    default: 'Present'
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  achievements: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  current: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for ordering
experienceSchema.index({ order: 1 });
experienceSchema.index({ current: -1, order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);

