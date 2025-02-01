const faqService = require('../services/faqServices');

// **Create FAQ**
exports.createFaq = async (req, res) => {
  const { question, answer, language } = req.body;

  try {
    const faqData = { question, answer, language };
    const newFaq = await faqService.createFaq(faqData);
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Get All FAQs**
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await faqService.getFaqs();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Get Single FAQ by ID**
exports.getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await faqService.getFaqById(id);
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Update FAQ**
exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, language } = req.body;
  try {
    const faqData = { question, answer, language };
    const updatedFaq = await faqService.updateFaq(id, faqData);
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Delete FAQ**
exports.deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaq = await faqService.deleteFaq(id);
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
