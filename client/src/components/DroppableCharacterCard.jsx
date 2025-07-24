// client/src/components/DroppableCharacterCard.jsx

import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './DraggableActionCard';

const characterImages = {
  en: import.meta.glob('../assets/character_en/*.png', { eager: true }),
  th: import.meta.glob('../assets/character_th/*.png', { eager: true }),
  jp: import.meta.glob('../assets/character_jp/*.png', { eager: true }),
};


const DroppableCharacterCard = ({ character, playerId, onCardDrop, language }) => {
  const isSleeping = character.sleepGoal > 0 && character.currentSleep === character.sleepGoal;
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const images = characterImages[language] || characterImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${character.name}.png`));
    if (imagePath) {
      setImageUrl(images[imagePath].default);
    } else {
      setImageUrl('');
    }
  }, [character.name, language]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    canDrop: () => !isSleeping,
    drop: (item) => onCardDrop(item.card, playerId, character.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [character, playerId, onCardDrop, isSleeping]);

  const getOverlayColor = () => {
    if (isOver && canDrop) return 'rgba(102, 187, 106, 0.5)';
    if (isOver && !canDrop) return 'rgba(239, 83, 80, 0.5)';
    return 'transparent';
  };

  return (
    <div className="character-card-container">
      <div
        ref={drop}
        className="character-card image-based-card"
        style={{
          cursor: isSleeping ? 'not-allowed' : 'default',
          opacity: isSleeping ? 0.7 : 1,
        }}
      >
        {imageUrl && <img src={imageUrl} alt={character.name} className="character-image" />}
        <div className="card-overlay" style={{ backgroundColor: getOverlayColor() }}></div>
        
        <div className="character-info-overlay-top">
          {/* ว่าง */}
        </div>

        {/* Overlay ด้านล่าง - แสดงสถานะหลับเท่านั้น (เอาชื่อออกแล้ว) */}
        <div className="character-info-overlay-bottom">
            {isSleeping && (
                <div className="slept-status-on-card">SLEPT</div>
            )}
        </div>
      </div>

      <div className="sleep-details">
        {!isSleeping && (
          <>
            <progress value={character.currentSleep} max={character.sleepGoal}></progress>
            <div className="sleep-status-text">
              {character.currentSleep} / {character.sleepGoal}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DroppableCharacterCard;
