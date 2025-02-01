const FAQ = require('../models/faqModel');
const Redis = require('ioredis');
const redis = new Redis();
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({ keyFilename: 'src/config/ServiceKey.json' });

const getCachedTranslation = async (faqId, lang) => redis.get(`faq:${faqId}:${lang}`);

const setTranslationCache = async (faqId, lang, translation) => {
  await redis.set(`faq:${faqId}:${lang}`, JSON.stringify(translation));
};

const autoTranslate = async (text, targetLang = 'en') => {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.error('Translation Error:', err);
    return text;
  }
};

const createFaq = async (req, res) => {
  try {
    const newFaq = new FAQ(req.body);
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(await translateFaqs(faqs, 'en'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFaqById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(await translateFaq(faq, 'en'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const updatedFaq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFaq) return res.status(404).json({ message: 'FAQ not found' });
    await invalidateCache(req.params.id);
    res.json(await translateFaq(updatedFaq, 'en'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const deletedFaq = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFaq) return res.status(404).json({ message: 'FAQ not found' });
    await invalidateCache(req.params.id);
    res.json(deletedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const translateFaq = async (faq, lang) => {
  if (faq.translations?.get(lang)) return faq;
  const translated = {
    question: await autoTranslate(faq.question, lang),
    answer: await autoTranslate(faq.answer, lang),
  };
  if (!faq.translations) {
    faq.translations = new Map();
  }
  faq.translations.set(lang, translated);
  await faq.save();
  await setTranslationCache(faq._id, lang, translated);
  return faq;
};

const translateFaqs = async (faqs, lang) => Promise.all(faqs.map(faq => translateFaq(faq, lang)));

const invalidateCache = async (faqId) => {
  for (const lang of ['en', 'hi', 'bn']) {
    await redis.del(`faq:${faqId}:${lang}`);
  }
};

module.exports = { createFaq, getFaqs, getFaqById, updateFaq, deleteFaq };