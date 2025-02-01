const faqService = require('../services/faqServices');
const Joi = require('joi'); 

// Create FAQ
exports.createFaq = async (req, res) => {
  const { question, answer, languageCode } = req.body;

  const schema = Joi.object({
    question: Joi.string().required().min(5), 
    answer: Joi.string().required(),
    languageCode: Joi.string().valid('en', 'hi', 'bn').required(), 
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const faqData = { question, answer, languageCode };
    const newFaq = await faqService.createFaq(faqData);
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All FAQs
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await faqService.getFaqs();

    const translatedFaqs = await Promise.all(faqs.map(async (faq) => {
      const translatedQuestion = await faqService.autoTranslate(faq.question, 'en');
      const translatedAnswer = await faqService.autoTranslate(faq.answer, 'en'); 
      return { 
        ...faq.toObject(), 
        question: translatedQuestion, 
        answer: translatedAnswer 
      };
    }));

    res.status(200).json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single FAQ by ID
exports.getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await faqService.getFaqById(id);
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, languageCode } = req.body;

  const schema = Joi.object({
    question: Joi.string().required().min(5), 
    answer: Joi.string().required(),
    languageCode: Joi.string().valid('en', 'hi', 'bn').required(), 
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const faqData = { question, answer, languageCode };
    const updatedFaq = await faqService.updateFaq(id, faqData);
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaq = await faqService.deleteFaq(id);
    res.status(200).json({ message: 'FAQ deleted successfully' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};