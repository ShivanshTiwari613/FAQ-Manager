// src/Components/FaqList.jsx
import React, { useState, useEffect } from 'react';
import { getFaqs } from "../services/FaqService";
import '../index.css';

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);

  const fetchFaqs = async () => {
    try {
      const data = await getFaqs();
      const sortedFaqs = data.reverse();
      setFaqs(sortedFaqs);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  try {
    return (
      <div className="faq-list">
        <h2>📋 FAQ List</h2>
        {error && <p className="error">{error}</p>}

        {faqs.length > 0 ? (
          faqs.map((faq, idx) => (
            <div key={faq._id} className="faq-item">
              <h3>{idx + 1}. {faq.question}</h3>
              <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answerHtml || faq.answer }} />

              {faq.translations && faq.translations.length > 0 ? (
                <div className="faq-translations">
                  <h4>🌍 Translations:</h4>
                  <ul>
                    {faq.translations.map((t, index) => (
                      <li key={index}>
                        <strong>[{t.lang ? t.lang.toUpperCase() : 'N/A'}]</strong>
                        <span> {t.question || 'No question'} - </span>
                        <span dangerouslySetInnerHTML={{ __html: t.answerHtml || t.answer || 'No answer available' }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p><em>No translations available.</em></p>
              )}

            </div>
          ))
        ) : (
          <p>No FAQs available.</p>
        )}
      </div>
    );
  } catch (err) {
    console.error('Rendering error in FAQList:', err);
    return <p className="error">Something went wrong while displaying the FAQs.</p>;
  }
};

export default FAQList;
