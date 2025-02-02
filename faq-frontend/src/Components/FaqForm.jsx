// src/Components/FAQForm.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createFaq } from "../services/FaqService";


const FAQForm = ({ onFaqCreated }) => {
  const [questionHtml, setQuestionHtml] = useState('');
  const [answerHtml, setAnswerHtml] = useState('');
  const [languages, setLanguages] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      question: questionHtml,
      answer: "N/A", // Provide a default non-empty value
      answerHtml: answerHtml,
      languages: languages.split(',').map(lang => lang.trim()),
    };

    try {
      await createFaq(payload);
      setResponseMessage('FAQ added successfully!');
      setQuestionHtml('');
      setAnswerHtml('');
      setLanguages('');
      onFaqCreated(); // Trigger a refresh of the FAQ list
    } catch (error) {
      console.error(error);
      setResponseMessage(`Failed to add FAQ: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="faq-form">
      <h2>Submit FAQ</h2>
      <form onSubmit={handleSubmit} className="faq-form__input-group">
        <label>
          <strong>Question (rich text):</strong>
          <ReactQuill
            value={questionHtml}
            onChange={setQuestionHtml}
            placeholder="Enter your question here..."
            className="faq-form__quill"
          />
        </label>

        <label>
          <strong>Answer (rich text):</strong>
          <ReactQuill
            value={answerHtml}
            onChange={setAnswerHtml}
            placeholder="Enter your answer here..."
            className="faq-form__quill"
          />
        </label>

        <label>
          <strong>Languages (comma-separated):</strong>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="e.g., es, fr, de"
            className="faq-form__input"
          />
        </label>

        <button type="submit" className="faq-form__button">Submit FAQ</button>
      </form>
      {responseMessage && (
        <div className={responseMessage.includes('Failed') ? 'error' : 'success'}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default FAQForm;
