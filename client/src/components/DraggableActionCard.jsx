// client/src/components/DraggableActionCard.jsx

import React, { useState, useEffect, useRef } from 'react';
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
  const cardRef = useRef(null); // เพิ่ม ref สำหรับอ้างอิง DOM

  const isClickOnlyCard = card.type.startsWith('special_');
  const isReactionCard = card.type.startsWith('reaction_');

  useEffect(() => {
    const images = actionCardImages[language] || actionCardImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${card.name}.png`));
    if (imagePath) {
      setImageUrl(images[imagePath].default);
    } else {
      setImageUrl('');
    }
  }, [card.name, language]);

  const [{ isDragging }, drag, preview] = useDrag(() => ({ // เพิ่ม preview เข้ามา
    type: ItemTypes.CARD,
    item: { card },
    canDrag: !isClickOnlyCard && !isReactionCard,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isClickOnlyCard, isReactionCard, card]);

  // เชื่อมต่อ drag source และ drag preview กับ ref
  useEffect(() => {
    if (cardRef.current) {
        // ใช้ element เดียวกันเป็นทั้ง source และ preview
        preview(cardRef.current, { captureDraggingState: true });
    }
  }, [cardRef, preview]);


  const handleClick = () => {
    if (isClickOnlyCard && onClick) {
      onClick(card);
    }
  };

  return (
    <div
      ref={isClickOnlyCard || isReactionCard ? cardRef : (el) => {
          cardRef.current = el; // กำหนด ref
          drag(el); // เชื่อมต่อ drag source
      }}
      onClick={handleClick}
      className={`action-card image-action-card ${isReactionCard ? 'reaction-card' : ''} ${isDragging ? 'is-dragging' : ''}`}
      style={{
        cursor: isClickOnlyCard ? 'pointer' : (isReactionCard ? 'default' : 'grab'),
        opacity: isDragging ? 0.5 : 1, // ซ่อนการ์ดต้นฉบับเล็กน้อยขณะลาก
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