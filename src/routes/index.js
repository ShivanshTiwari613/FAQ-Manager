const express = require('express');
const router = express.Router();
const { createFaq, getFaqs, getFaqById, updateFaq, deleteFaq} = require('../Controllers/faqController'); 

router.post('/faq', createFaq); // Call controller to create FAQ

router.get('/faq', getFaqs); // Call controller to get all FAQs

router.get('/faq/:id', getFaqById); // Call controller to get FAQ by ID

router.put('/faq/:id', updateFaq); // Call controller to update FAQ

router.delete('/faq/:id', deleteFaq); // Call controller to delete FAQ

module.exports = router;
