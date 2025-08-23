// client/src/components/HowToPlay.jsx

import React from 'react';
import '../styles/HowToPlay.css';

// [แก้ไข] โหลดรูปภาพทั้งหมด
const howToPlayImages = {
  en: new URL('/src/assets/how_to_play/how_to_play_en.jpg', import.meta.url).href,
  th: new URL('/src/assets/how_to_play/how_to_play_th.jpg', import.meta.url).href,
  jp: new URL('/src/assets/how_to_play/how_to_play_jp.jpg', import.meta.url).href,
};

const HowToPlay = ({ language, onBack }) => {
  const imageUrl = howToPlayImages[language] || howToPlayImages.en; // ใช้รูปภาพตามภาษาที่เลือก หรือใช้ภาษาอังกฤษเป็นค่าเริ่มต้น

  return (
    <div className="how-to-play-container">
      {/* [เพิ่ม] แสดงรูปภาพแทนข้อความ */}
      <img src={imageUrl} alt="How to Play" className="how-to-play-image" />
      <button onClick={onBack} className="back-button">ย้อนกลับ</button>
    </div>
  );
};

export default HowToPlay;