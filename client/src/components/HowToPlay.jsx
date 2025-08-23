// client/src/components/HowToPlay.jsx

import React from 'react';
import '../styles/HowToPlay.css'; // You'll need to create this CSS file

const translations = {
  en: {
    title: 'How to Play',
    greenCards: 'Green cards are used to add sleep hours.',
    redCards: 'Red cards are used to subtract sleep hours.',
    back: 'Back'
  },
  th: {
    title: 'วิธีเล่น',
    greenCards: 'การ์ดสีเขียวใช้เพื่อเพิ่มเวลานอน',
    redCards: 'การ์ดสีแดงใช้เพื่อลดเวลานอน',
    back: 'ย้อนกลับ'
  },
  jp: {
    title: '遊び方',
    greenCards: '緑のカードは睡眠時間を増やすために使用されます。',
    redCards: '赤いカードは睡眠時間を減らすために使用されます。',
    back: '戻る'
  }
};

const HowToPlay = ({ language, onBack }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="how-to-play-container">
      <h2>{t.title}</h2>
      <ul>
        <li>{t.greenCards}</li>
        <li>{t.redCards}</li>
      </ul>
      <button onClick={onBack} className="back-button">{t.back}</button>
    </div>
  );
};

export default HowToPlay;