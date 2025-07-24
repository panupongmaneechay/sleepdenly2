// client/src/components/DroppableCharacterCard.jsx

import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './DraggableActionCard';

const DroppableCharacterCard = ({ character, playerId, onCardDrop }) => {
  const isSleeping = character.sleepGoal > 0 && character.currentSleep === character.sleepGoal;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    canDrop: () => !isSleeping,
    drop: (item) => onCardDrop(item.card, playerId, character.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), 
  // **[แก้ไข]** เพิ่ม dependency array เพื่อให้ hook อัปเดตตัวเองเมื่อ props เปลี่ยน
  [character, playerId, onCardDrop, isSleeping]);

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