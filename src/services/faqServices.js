const FAQ = require('../models/faqModel');

const createFaq = async (faqData) => {
    try {
        const newFaq = new FAQ(faqData);
        await newFaq.save();
        return newFaq;
    } catch (error) {
        throw new Error('Error adding FAQ: ' + error.message);
    }
};

// **Get All FAQs**
const getFaqs = async () => {
    try {
        const faqs = await FAQ.find();
        return faqs;
    } catch (error) {
        throw new Error('Error fetching FAQs: ' + error.message);
    }
};

// **Get FAQ by ID**
const getFaqById = async (id) => {
    try {
        const faq = await FAQ.findById(id);
        if (!faq) throw new Error('FAQ not found');
        return faq;
    } catch (error) {
        throw new Error('Error fetching FAQ: ' + error.message);
    }
};


const updateFaq = async (id, faqData) => {
    try {
        const updatedFaq = await FAQ.findByIdAndUpdate(id, faqData, { new: true });
        if (!updatedFaq) throw new Error('FAQ not found');
        return updatedFaq;
    } catch (error) {
        throw new Error('Error updating FAQ: ' + error.message);
    }
};

// **Delete FAQ**
const deleteFaq = async (id) => {
    try {
        const deletedFaq = await FAQ.findByIdAndDelete(id);
        if (!deletedFaq) throw new Error('FAQ not found');
        return deletedFaq;
    } catch (error) {
        throw new Error('Error deleting FAQ: ' + error.message);
    }
};

module.exports = {
    createFaq,
    getFaqs,
    getFaqById,
    updateFaq,
    deleteFaq,
};
