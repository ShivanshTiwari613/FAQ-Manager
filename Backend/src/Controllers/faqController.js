// controllers/faqController.js
import FAQService from '../services/faqServices.js';
import Joi from 'joi';

// Create FAQ
export const createFaq = async (req, res) => {
  const { question, answer, answerHtml, languages } = req.body;
  
  // Validate input.
  const schema = Joi.object({
    question: Joi.string().min(5).required(),
    answer: Joi.string().required(),
    answerHtml: Joi.string().allow("").optional(),
    languages: Joi.array().items(Joi.string()).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  try {
    const newFaq = await FAQService.create_FAQ({ question, answer, answerHtml, languages });
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all FAQs
export const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQService.get_FAQs();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single FAQ by ID
export const getFaqById = async (req, res) => {
  try {
    const faq = await FAQService.get_FAQById(req.params.id);
    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, answerHtml } = req.body;
  
  // Validate input.
  const schema = Joi.object({
    question: Joi.string().min(5).required(),
    answer: Joi.string().required(),
    answerHtml: Joi.string().allow("").optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  try {
    const updatedFaq = await FAQService.update_FAQ(id, { question, answer, answerHtml });
    res.status(200).json(updatedFaq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
  const { id } = req.params;
  try {
    await FAQService.delete_FAQ(id);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
