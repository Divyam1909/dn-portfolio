const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add quote text'],
    trim: true,
    maxlength: [500, 'Quote cannot be more than 500 characters']
  },
  author: {
    type: String,
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['technology', 'universe', 'science', 'inspiration', 'programming'],
    default: 'technology'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);

