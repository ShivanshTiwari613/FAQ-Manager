// src/pages/FaqPage.jsx
import React, { useState } from 'react';
import FAQForm from '../Components/FAQForm';
import FAQList from '../Components/FAQList';

const FaqPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleFaqCreated = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="faq-container" style={{ display: 'flex', gap: '2rem', padding: '20px' }}>
      <div className="faq-left" style={{ flex: 1 }}>
        <FAQForm onFaqCreated={handleFaqCreated} />
      </div>
      <div className="faq-right" style={{ flex: 1 }}>
        {/* Using refresh as a key forces FAQList to re-render */}
        <FAQList key={refresh} />
      </div>
    </div>
  );
};

export default FaqPage;
