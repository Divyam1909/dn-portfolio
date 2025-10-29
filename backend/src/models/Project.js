const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  demoLink: {
    type: String,
    default: ''
  },
  sourceLink: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);

