// models/faqModel.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  languageCode: { type: String, default: 'en' }, // Default to English if not provided
  translations: {
    type: Map,
    of: Object,
    default: {} // Default to an empty map/object
  }
  
});


module.exports = mongoose.model('FAQ', faqSchema);