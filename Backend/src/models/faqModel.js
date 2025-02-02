// models/faqModel.js
import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  answerHtml: {
    type: String,
    required: true,
  },
  translations: [
    {
      question: String,
      answer: String,
      answerHtml: String,
      lang: String,
    },
  ],
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', FAQSchema);
export default FAQ;
