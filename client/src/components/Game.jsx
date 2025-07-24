// client/src/components/Game.jsx

import React, { useState } from 'react';
import PlayerArea from './PlayerArea';
import PlayerSelectionModal from './PlayerSelectionModal';
import endTurnButtonImage from '../assets/button/end.png';

const Game = ({ gameState, myId, socket, language }) => {
    const [isStealModalOpen, setIsStealModalOpen] = useState(false);
    const [thiefCard, setThiefCard] = useState(null);

    const me = gameState.players.find(p => p.id === myId);
    const otherPlayers = gameState.players.filter(p => p.id !== myId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer.id === myId;
    const playerCount = gameState.players.length;

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

    const handleEndTurn = () => {
        if (isMyTurn) {
            socket.emit('end_turn', { roomId: gameState.roomId });
        }
    };

    const handleSpecialCardClick = (card) => {
        if (!isMyTurn) {
            alert("It's not your turn!");
            return;
        }
        if (card.type === 'special_steal') {
            setThiefCard(card);
            setIsStealModalOpen(true);
        }
    };

    const handleSelectPlayerToSteal = (targetPlayerId) => {
        socket.emit('steal_cards', {
            roomId: gameState.roomId,
            card: thiefCard,
            targetPlayerId: targetPlayerId,
        });
        setIsStealModalOpen(false);
        setThiefCard(null);
    };

    let topPlayer = null;
    let leftPlayer = null;
    let rightPlayer = null;

    if (playerCount === 2) {
        topPlayer = otherPlayers[0];
    } else if (playerCount === 3) {
        leftPlayer = otherPlayers[0];
        rightPlayer = otherPlayers[1];
    } else if (playerCount === 4) {
        topPlayer = otherPlayers[0];
        leftPlayer = otherPlayers[1];
        rightPlayer = otherPlayers[2];
    }

    const layoutClass = `game-board layout-${playerCount}p`;

    return (
        <>
            {isStealModalOpen && (
                <PlayerSelectionModal 
                    players={otherPlayers}
                    onSelectPlayer={handleSelectPlayerToSteal}
                    onCancel={() => setIsStealModalOpen(false)}
                />
            )}
            <div className={layoutClass}>
                {topPlayer && (
                    <div className="player-position-top">
                        <PlayerArea player={topPlayer} isMyArea={false} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} />
                    </div>
                )}

                {leftPlayer && (
                    <div className="player-position-left">
                        <PlayerArea player={leftPlayer} isMyArea={false} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} />
                    </div>
                )}
                
                <div className="center-controls">
                    <div className="turn-indicator">
                        <h2>Turn: {currentPlayer.name}</h2>
                        {isMyTurn && (
                            <button className="end-turn-image-button" onClick={handleEndTurn}>
                                <img src={endTurnButtonImage} alt="End Turn" />
                            </button>
                        )}
                    </div>
                </div>

                {rightPlayer && (
                    <div className="player-position-right">
                        <PlayerArea player={rightPlayer} isMyArea={false} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} />
                    </div>
                )}

                <div className="player-position-bottom">
                    <PlayerArea 
                        player={me} 
                        isMyArea={true} 
                        onCardDrop={handleCardDrop} 
                        isMyTurn={isMyTurn} 
                        language={language}
                        onSpecialCardClick={handleSpecialCardClick} 
                    />
                </div>
            </div>
        </>
    );
};

export default Game;
