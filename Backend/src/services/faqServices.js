import { v2 as Translate } from '@google-cloud/translate';
import Redis from 'ioredis';
import FAQ from '../models/faqModel.js';
import { extractTextFromHTML } from '../utils/htmlUtils.js';

const translateClient = new Translate.Translate({
  keyFilename: 'src/config/ServiceKey.json',
});

const redis = new Redis();

class FAQService {
  // Create a new FAQ with translations.
  async create_FAQ(data) {
    try {
      const { question, answer, answerHtml, languages } = data;
      
      const answerText = extractTextFromHTML(answerHtml || "");

      const translatePromises = languages.map(async (lang) => {
        try {

          const [translatedQuestion] = await translateClient.translate(question, lang);

          const [translatedAnswer] = await translateClient.translate(answerText, lang);

          const translatedAnswerHtml = answerHtml
            ? (await translateClient.translate(answerHtml, lang))[0]
            : "";

          return {
            lang,
            question: translatedQuestion,
            answer: translatedAnswer,
            answerHtml: translatedAnswerHtml,
          };
        } catch (error) {
          console.error(`Translation to ${lang} failed:`, error);
          return null;
        }
      });

      const translatedResults = await Promise.all(translatePromises);
      
      const translations = translatedResults.filter(t => t !== null);

      const faq = await FAQ.create({
        question,
        answer: answerText,
        answerHtml,
        translations,
      });

      // Invalidate the cache for the FAQs list.
      await redis.del("faqs:all");

      return faq;
    } catch (error) {
      console.error("Error in service layer (create_FAQ):", error);
      throw error;
    }
  }

  async get_FAQs() {
    try {

      const cachedFaqs = await redis.get("faqs:all");
      if (cachedFaqs) {
        return JSON.parse(cachedFaqs);
      }

      const faqs = await FAQ.find();
      // Cache the FAQs for 1 hour.
      await redis.set("faqs:all", JSON.stringify(faqs), "EX", 3600);
      return faqs;
    } catch (error) {
      console.error("Error in service layer (get_FAQs):", error);
      throw error;
    }
  }

  async get_FAQById(id) {
    try {
      const cacheKey = `faq:${id}`;
      const cachedFaq = await redis.get(cacheKey);
      if (cachedFaq) {
        return JSON.parse(cachedFaq);
      }

      const faq = await FAQ.findById(id);
      if (!faq) {
        throw new Error('FAQ not found');
      }
      // Cache the FAQ for 1 hour.
      await redis.set(cacheKey, JSON.stringify(faq), "EX", 3600);
      return faq;
    } catch (error) {
      console.error("Error in service layer (get_FAQById):", error);
      throw error;
    }
  }

  async update_FAQ(id, faqData) {
    try {
      const updatedFaq = await FAQ.findByIdAndUpdate(id, faqData, { new: true });
      if (!updatedFaq) {
        throw new Error('FAQ not found');
      }

      await redis.del(`faq:${id}`);
      await redis.del("faqs:all");
      return updatedFaq;
    } catch (error) {
      console.error("Error in service layer (update_FAQ):", error);
      throw error;
    }
  }

  // Delete FAQ.
  async delete_FAQ(id) {
    try {
      const deletedFaq = await FAQ.findByIdAndDelete(id);
      if (!deletedFaq) {
        throw new Error('FAQ not found');
      }

      await redis.del(`faq:${id}`);
      await redis.del("faqs:all");
      return deletedFaq;
    } catch (error) {
      console.error("Error in service layer (delete_FAQ):", error);
      throw error;
    }
  }
}

export default new FAQService();
