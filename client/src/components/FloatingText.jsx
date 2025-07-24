// client/src/components/FloatingText.jsx

import React from 'react';
import '../styles/FloatingText.css';

const FloatingText = ({ text, type }) => {
  // กำหนดคลาสสีตามประเภทของการ์ด
  const textClass = type === 'add' ? 'positive' : 'negative';

  return (
    <div className={`floating-text ${textClass}`}>
      {text}
    </div>
  );
};

export default FloatingText;
