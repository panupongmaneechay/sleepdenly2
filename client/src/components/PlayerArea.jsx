// client/src/components/PlayerArea.jsx

import React from 'react';
import DraggableActionCard from './DraggableActionCard';
import DroppableCharacterCard from './DroppableCharacterCard';

const PlayerArea = ({ player, isMyArea, onCardDrop, isMyTurn }) => {
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
                    />
                ))}
            </div>
            {isMyArea && (
                <div className="hand">
                    <h4>Your Hand {isMyTurn ? "(Drag a card to play)" : "(Wait for your turn)"}</h4>
                    <div className="action-cards">
                    {player.hand.map((card, index) => (
                        <DraggableActionCard
                           key={`${card.name}-${index}`} // เพิ่ม index เพื่อ handle การ์ดซ้ำ
                           card={card}
                        />
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerArea;