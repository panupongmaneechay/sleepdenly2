// client/src/components/HowToPlay.jsx

import React from 'react';
import '../styles/HowToPlay.css';

// โหลดรูปภาพทั้งหมด
const howToPlayImages = {
  en: new URL('/src/assets/how_to_play/how_to_play_en.jpg', import.meta.url).href,
  th: new URL('/src/assets/how_to_play/how_to_play_th.jpg', import.meta.url).href,
  jp: new URL('/src/assets/how_to_play/how_to_play_jp.jpg', import.meta.url).href,
};

// [เพิ่ม] สร้างอ็อบเจกต์สำหรับข้อความปุ่มในแต่ละภาษา
const buttonTexts = {
  en: 'Back',
  th: 'ย้อนกลับ',
  jp: '戻る', // เพิ่มภาษาญี่ปุ่นเป็นตัวเลือกเผื่อไว้
};

const HowToPlay = ({ language, onBack }) => {
  const imageUrl = howToPlayImages[language] || howToPlayImages.en; // ใช้รูปภาพตามภาษาที่เลือก
  const buttonText = buttonTexts[language] || buttonTexts.en; // [แก้ไข] ใช้ข้อความปุ่มตามภาษาที่เลือก

  return (
    <div className="how-to-play-container">
      <img src={imageUrl} alt="How to Play" className="how-to-play-image" />
      {/* [แก้ไข] แสดงข้อความจากตัวแปร buttonText */}
      <button onClick={onBack} className="back-button">
        {buttonText}
      </button>
    </div>
  );
};

export default HowToPlay;