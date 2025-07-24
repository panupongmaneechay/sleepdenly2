// client/src/components/DroppableCharacterCard.jsx

import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './DraggableActionCard';
import sleptImage from '../assets/status/slept.png';

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
    canDrop: (item) => {
      if (isSleeping) return false; // ถ้าหลับอยู่แล้ว วางไม่ได้

      // ตรวจสอบเงื่อนไขการ์ด
      const card = item.card;
      if (card.condition && card.condition.age) {
        return character.age >= card.condition.age;
      }
      return true; // ถ้าไม่มีเงื่อนไข ก็วางได้เสมอ
    },
    drop: (item) => onCardDrop(item.card, playerId, character.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [character, playerId, onCardDrop, isSleeping, language]);

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
        }}
      >
        {imageUrl && <img src={imageUrl} alt={character.name} className="character-image" />}
        <div className="card-overlay" style={{ backgroundColor: getOverlayColor() }}></div>
        
        {isSleeping && (
          <>
            <img src={sleptImage} alt="Slept" className="slept-overlay-image" />
            <div className="zzz-icon-container">
              <span className="zzz-icon">💤</span>
              <span className="zzz-icon">💤</span>
              <span className="zzz-icon">💤</span>
            </div>
          </>
        )}
      </div>

      {!isSleeping && (
        <div className="sleep-details">
          <progress value={character.currentSleep} max={character.sleepGoal}></progress>
          <div className="sleep-status-text">
            {character.currentSleep} / {character.sleepGoal}
          </div>
        </div>
      )}
    </div>
  );
};

export default DroppableCharacterCard;
