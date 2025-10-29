const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language'],
    required: [true, 'Skill category is required']
  },
  // For language skills
  proficiency: {
    type: String,
    enum: ['Native', 'Fluent', 'Intermediate', 'Basic', ''],
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for category and ordering
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);

