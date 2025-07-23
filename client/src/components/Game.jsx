// client/src/components/Game.jsx

import React from 'react';
import PlayerArea from './PlayerArea';

const Game = ({ gameState, myId, socket }) => {
    const me = gameState.players.find(p => p.id === myId);
    const otherPlayers = gameState.players.filter(p => p.id !== myId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer.id === myId;

    const handleCardDrop = (card, targetPlayerId, targetCharacterName) => {
        if (isMyTurn) {
            socket.emit('play_card', {
                roomId: gameState.roomId,
                card: card,
                targetPlayerId: targetPlayerId,
                targetCharacterName: targetCharacterName
            });
        } else {
            alert("It's not your turn!");
        }
    };

    // ฟังก์ชันใหม่สำหรับกดปุ่มจบเทิร์น
    const handleEndTurn = () => {
        if (isMyTurn) {
            socket.emit('end_turn', { roomId: gameState.roomId });
        }
    };

    return (
        <div className="game-board">
            <div className="turn-indicator">
                <h2>Turn: {currentPlayer.name} {isMyTurn && "(Your Turn)"}</h2>
                {/* ปุ่ม End Turn จะแสดงและกดได้เฉพาะในตาของเรา */}
                {isMyTurn && (
                    <button className="end-turn-button" onClick={handleEndTurn}>
                        End Turn
                    </button>
                )}
            </div>
            
            <div className="opponents-area">
                {otherPlayers.map(player => (
                    <PlayerArea 
                        key={player.id}
                        player={player}
                        isMyArea={false}
                        onCardDrop={handleCardDrop}
                        isMyTurn={isMyTurn}
                    />
                ))}
            </div>

            <hr/>
            
            <div className="my-area">
                <PlayerArea 
                    player={me}
                    isMyArea={true}
                    onCardDrop={handleCardDrop}
                    isMyTurn={isMyTurn}
                />
            </div>
        </div>
    );
};

export default Game;