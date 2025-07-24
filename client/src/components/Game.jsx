// client/src/components/Game.jsx

import React, { useState, useEffect } from 'react';
import PlayerArea from './PlayerArea';
import PlayerSelectionModal from './PlayerSelectionModal';
import ConfirmationModal from './ConfirmationModal';
import endTurnButtonImage from '../assets/button/end.png';

const Game = ({ gameState, myId, socket, language }) => {
    const [isStealModalOpen, setIsStealModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [specialCard, setSpecialCard] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        socket.on('action_request', (data) => {
            setConfirmation({
                type: 'prevent',
                message: data.message,
                actionData: data.actionData
            });
        });

        socket.on('counter_request', (data) => {
            setConfirmation({
                type: 'counter',
                message: data.message
            });
        });

        return () => {
            socket.off('action_request');
            socket.off('counter_request');
        };
    }, [socket]);


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
        }
    };

    const handleEndTurn = () => {
        if (isMyTurn) {
            socket.emit('end_turn', { roomId: gameState.roomId });
        }
    };

    const handleSpecialCardClick = (card) => {
        if (!isMyTurn) return;
        setSpecialCard(card);
        if (card.type === 'special_steal') {
            setIsStealModalOpen(true);
        } else if (card.type === 'special_swap') {
            if (me.hand.length <= 1) {
                alert("You need at least one other card to swap.");
                return;
            }
            setIsSwapModalOpen(true);
        }
    };

    const handleSelectPlayer = (targetPlayerId) => {
        const eventName = specialCard.type === 'special_steal' ? 'steal_cards' : 'swap_cards';
        socket.emit(eventName, {
            roomId: gameState.roomId,
            card: specialCard,
            targetPlayerId: targetPlayerId,
        });
        closeModal();
    };

    const closeModal = () => {
        setIsStealModalOpen(false);
        setIsSwapModalOpen(false);
        setSpecialCard(null);
    };
    
    const handleConfirmation = (useCard) => {
        if (confirmation.type === 'prevent') {
            socket.emit('action_response', { roomId: gameState.roomId, useCard });
        } else if (confirmation.type === 'counter') {
            socket.emit('counter_response', { roomId: gameState.roomId, useCard });
        }
        setConfirmation(null);
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
            {confirmation && (
                <ConfirmationModal 
                    message={confirmation.message}
                    onConfirm={() => handleConfirmation(true)}
                    onDecline={() => handleConfirmation(false)}
                />
            )}

            {(isStealModalOpen || isSwapModalOpen) && (
                <PlayerSelectionModal 
                    title={isStealModalOpen ? "Who to steal from?" : "Who to swap with?"}
                    players={otherPlayers}
                    onSelectPlayer={handleSelectPlayer}
                    onCancel={closeModal}
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
