// client/src/components/DraggableActionCard.jsx

import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';

export const ItemTypes = {
  CARD: 'card',
};

// โหลดรูปภาพทั้งหมดเข้ามา
const actionCardImages = {
  en: import.meta.glob('../assets/action_en/*.png', { eager: true }),
  th: import.meta.glob('../assets/action_th/*.png', { eager: true }),
  jp: import.meta.glob('../assets/action_jp/*.png', { eager: true }),
};

const DraggableActionCard = ({ card, language }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const images = actionCardImages[language] || actionCardImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${card.name}.png`));
    if (imagePath) {
      setImageUrl(images[imagePath].default);
    } else {
      setImageUrl(''); // หรือใส่ URL รูปภาพสำรอง
    }
  }, [card.name, language]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="action-card image-action-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
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
