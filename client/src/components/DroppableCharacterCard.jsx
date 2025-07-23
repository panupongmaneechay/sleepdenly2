// client/src/components/DroppableCharacterCard.jsx

import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './DraggableActionCard';

const DroppableCharacterCard = ({ character, playerId, onCardDrop }) => {
  // **กติกาใหม่ 2:** เช็คว่าหลับ "พอดี" หรือไม่
  const isSleeping = character.sleepGoal > 0 && character.currentSleep === character.sleepGoal;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    // **กติกาใหม่ 2:** จะวางการ์ดได้ก็ต่อเมื่อค่าไม่เท่ากับ goal พอดี
    canDrop: (item) => {
        // ถ้าเป็นการ์ดบวก จะวางได้เมื่อค่ายังไม่เกิน goal
        if(item.card.type === 'add') {
            return !isSleeping;
        }
        // ถ้าเป็นการ์ดลบ จะวางได้เสมอ ตราบใดที่ยังไม่หลับพอดี (เพื่อลดค่าที่เกินได้)
        if(item.card.type === 'subtract') {
            return !isSleeping;
        }
        return false;
    },
    drop: (item) => onCardDrop(item.card, playerId, character.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const getBackgroundColor = () => {
    if (isOver && canDrop) return '#c8e6c9';
    if (isOver && !canDrop) return '#ffcdd2';
    return 'white';
  };

  return (
    <div
      ref={drop}
      className="character-card"
      style={{
        backgroundColor: getBackgroundColor(),
        cursor: isSleeping ? 'not-allowed' : 'default',
        opacity: isSleeping ? 0.7 : 1,
      }}
    >
      <strong>{character.name}</strong> ({character.age} y/o)
      
      {isSleeping ? (
        <div className="slept-status">
            SLEPT
        </div>
      ) : (
        <div className="progress-status">
            <p>Sleep: {character.currentSleep} / {character.sleepGoal}</p>
            <progress value={character.currentSleep} max={character.sleepGoal}></progress>
        </div>
      )}
    </div>
  );
};

export default DroppableCharacterCard;