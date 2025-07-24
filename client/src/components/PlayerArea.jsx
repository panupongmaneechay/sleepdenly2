// client/src/components/PlayerArea.jsx

import React from 'react';
import DraggableActionCard from './DraggableActionCard';
import DroppableCharacterCard from './DroppableCharacterCard';

// [แก้ไข] เพิ่ม = [] เพื่อกำหนดค่าเริ่มต้นให้ floatingTexts
const PlayerArea = ({ player, isMyArea, onCardDrop, isMyTurn, language, onSpecialCardClick, floatingTexts = [] }) => {
    return (
        <div className={`player-area ${isMyArea ? 'my-player-area' : 'opponent-player-area'}`}>
            <h3>{player.name} (Slept: {player.sleptCharacters}/3)</h3>
            <div className="characters">
                {player.characters.map(char => (
                    <DroppableCharacterCard
                        key={char.name}
                        character={char}
                        playerId={player.id}
                        onCardDrop={onCardDrop}
                        language={language}
                        // ตอนนี้ floatingTexts จะเป็น array เสมอ ทำให้ filter ได้อย่างปลอดภัย
                        floatingTexts={floatingTexts.filter(t => t.targetCharacterName === char.name)}
                    />
                ))}
            </div>
            {isMyArea && (
                <div className="hand">
                    <h4>Your Hand {isMyTurn ? "(Drag a card to play)" : "(Wait for your turn)"}</h4>
                    <div className="action-cards">
                    {player.hand.map((card) => (
                        <DraggableActionCard
                           key={card.id}
                           card={card}
                           language={language}
                           onClick={onSpecialCardClick}
                        />
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerArea;
