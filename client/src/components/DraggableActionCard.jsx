// client/src/components/DraggableActionCard.jsx

import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';

export const ItemTypes = {
  CARD: 'card',
};

const actionCardImages = {
  en: import.meta.glob('../assets/action_en/*.png', { eager: true }),
  th: import.meta.glob('../assets/action_th/*.png', { eager: true }),
  jp: import.meta.glob('../assets/action_jp/*.png', { eager: true }),
};

const DraggableActionCard = ({ card, language, onClick }) => {
  const [imageUrl, setImageUrl] = useState('');
  
  // [แก้ไข] ตรวจสอบเฉพาะการ์ดที่ต้อง "คลิกเท่านั้น" เช่น Thief
  const isClickOnlyCard = card.type === 'special_steal';

  useEffect(() => {
    const images = actionCardImages[language] || actionCardImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${card.name}.png`));
    if (imagePath) {
      setImageUrl(images[imagePath].default);
    } else {
      setImageUrl('');
    }
  }, [card.name, language]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card },
    // [แก้ไข] อนุญาตให้ลากการ์ดได้ทุกใบ ยกเว้นการ์ดที่ต้องคลิกเท่านั้น
    canDrag: !isClickOnlyCard,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    // ถ้าเป็นการ์ดที่ต้องคลิกและมีฟังก์ชัน onClick ส่งมา ก็ให้ทำงาน
    if (isClickOnlyCard && onClick) {
      onClick(card);
    }
  };

  return (
    <div
      ref={isClickOnlyCard ? null : drag} // [แก้ไข] ใช้ ref สำหรับลากกับการ์ดทุกใบที่ไม่ใช่แบบคลิกเท่านั้น
      onClick={handleClick}
      className="action-card image-action-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isClickOnlyCard ? 'pointer' : 'grab', // [แก้ไข] เปลี่ยน cursor ตามประเภท
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={card.name} />
      ) : (
        <div className="card-placeholder">{card.name}</div>
      )}
    </div>
  );
};

export default DraggableActionCard;
