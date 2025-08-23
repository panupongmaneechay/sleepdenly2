// client/src/components/PlayerArea.jsx

import React from 'react';
import DroppableCharacterCard from './DroppableCharacterCard';

// [แก้ไข] เพิ่ม = [] เพื่อกำหนดค่าเริ่มต้นให้ floatingTexts
const PlayerArea = ({ player, isMyArea, onCardDrop, isMyTurn, language, onSpecialCardClick, floatingTexts = [] }) => {
    return (
        <div className={`player-area ${isMyArea ? 'my-player-area' : 'opponent-player-area'}`}>
            <div className="player-header">
                {/* [เพิ่ม] แสดง Avatar ของผู้เล่น */}
                <div className="player-avatar-container">
                    <img src={player.avatar} alt={`${player.name}'s avatar`} className="player-avatar" />
                </div>
                <h3>{player.name} (Slept: {player.sleptCharacters}/3)</h3>
            </div>
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
            {/* ส่วนของ Hand ถูกลบออกจากไฟล์นี้ */}
        </div>
    );
};

export default PlayerArea;