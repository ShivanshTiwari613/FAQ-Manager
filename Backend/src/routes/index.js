// routes/faqRoutes.js
import express from 'express';
import { createFaq, getFaqs, getFaqById, updateFaq, deleteFaq } from '../controllers/faqController.js';

const router = express.Router();

router.post('/faq', createFaq);
router.get('/faq', getFaqs);
router.get('/faq/:id', getFaqById);
router.put('/faq/:id', updateFaq);
router.delete('/faq/:id', deleteFaq);

export default router;
