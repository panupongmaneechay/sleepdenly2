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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card },
    canDrag: !isClickOnlyCard && !isReactionCard,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    if (isClickOnlyCard && onClick) {
      onClick(card);
    }
  };

  return (
    <div
      ref={isClickOnlyCard || isReactionCard ? null : drag}
      onClick={handleClick}
      // เพิ่ม className 'is-dragging' เมื่อ isDragging เป็นจริง
      className={`action-card image-action-card ${isReactionCard ? 'reaction-card' : ''} ${isDragging ? 'is-dragging' : ''}`}
      style={{
        cursor: isClickOnlyCard ? 'pointer' : (isReactionCard ? 'default' : 'grab'),
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