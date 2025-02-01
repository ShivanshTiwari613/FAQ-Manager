const express = require('express');
const router = express.Router();
const { createFaq, getFaqs, getFaqById, updateFaq, deleteFaq } = require('../services/faqServices');

router.post('/faq', createFaq);
router.get('/faq', getFaqs);
router.get('/faq/:id', getFaqById);
router.put('/faq/:id', updateFaq);
router.delete('/faq/:id', deleteFaq);

module.exports = router;