const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    default: 'No Expiration'
  },
  credentialId: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  certificateImage: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for ordering
certificationSchema.index({ order: 1 });

module.exports = mongoose.model('Certification', certificationSchema);

