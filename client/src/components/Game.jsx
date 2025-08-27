// client/src/components/Game.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayerArea from './PlayerArea';
import PlayerSelectionModal from './PlayerSelectionModal';
import ConfirmationModal from './ConfirmationModal';
import GameLog from './GameLog';
import DraggableActionCard from './DraggableActionCard';
import endTurnButtonImage from '../assets/button/end.png';

const Game = ({ gameState, myId, socket, language }) => {
    const [isStealModalOpen, setIsStealModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [specialCard, setSpecialCard] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [isLogVisible, setIsLogVisible] = useState(true);

    // --- [เพิ่ม] Logic สำหรับลากกล่องการ์ด ---
    const handContainerRef = useRef(null);
    const [handPosition, setHandPosition] = useState({ x: 16, y: 0 });
    const [isDraggingHand, setIsDraggingHand] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Set initial position once after the component mounts
    useEffect(() => {
        if (handContainerRef.current) {
            const rect = handContainerRef.current.getBoundingClientRect();
            setHandPosition({
                x: 16,
                y: window.innerHeight - rect.height - 16
            });
        }
    }, []);

    const onHandDragStart = useCallback((e) => {
        setIsDraggingHand(true);
        dragOffset.current = {
            x: e.clientX - handPosition.x,
            y: e.clientY - handPosition.y,
        };
        e.preventDefault();
    }, [handPosition]);

    const onHandDragMove = useCallback((e) => {
        if (isDraggingHand) {
            setHandPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        }
    }, [isDraggingHand]);

    const onHandDragEnd = useCallback(() => {
        setIsDraggingHand(false);
    }, []);

    useEffect(() => {
        if (isDraggingHand) {
            window.addEventListener('mousemove', onHandDragMove);
            window.addEventListener('mouseup', onHandDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onHandDragMove);
            window.removeEventListener('mouseup', onHandDragEnd);
        };
    }, [isDraggingHand, onHandDragMove, onHandDragEnd]);
    // --- สิ้นสุด Logic สำหรับลากกล่องการ์ด ---

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
        socket.on('action_effect', (data) => {
            const newText = { id: Date.now() + Math.random(), ...data };
            setFloatingTexts(currentTexts => [...currentTexts, newText]);
            setTimeout(() => {
                setFloatingTexts(currentTexts => currentTexts.filter(text => text.id !== newText.id));
            }, 1500);
        });
        return () => {
            socket.off('action_request');
            socket.off('counter_request');
            socket.off('action_effect');
        };
    }, [socket]);

    const me = gameState.players.find(p => p.id === myId);
    const otherPlayers = gameState.players.filter(p => p.id !== myId);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isMyTurn = currentPlayer.id === myId;
    const playerCount = gameState.players.length;

    const handleCardDrop = (card, targetPlayerId, targetCharacterName) => {
        if (isMyTurn) {
            socket.emit('play_card', { roomId: gameState.roomId, card, targetPlayerId, targetCharacterName });
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
        if (card.type === 'special_steal') setIsStealModalOpen(true);
        else if (card.type === 'special_swap') {
            if (me.hand.length <= 1) {
                alert("You need at least one other card to swap.");
                return;
            }
            setIsSwapModalOpen(true);
        }
    };
    const handleSelectPlayer = (targetPlayerId) => {
        const eventName = specialCard.type === 'special_steal' ? 'steal_cards' : 'swap_cards';
        socket.emit(eventName, { roomId: gameState.roomId, card: specialCard, targetPlayerId });
        closeModal();
    };
    const closeModal = () => {
        setIsStealModalOpen(false);
        setIsSwapModalOpen(false);
        setSpecialCard(null);
    };
    const handleConfirmation = (useCard) => {
        if (confirmation.type === 'prevent') socket.emit('action_response', { roomId: gameState.roomId, useCard });
        else if (confirmation.type === 'counter') socket.emit('counter_response', { roomId: gameState.roomId, useCard });
        setConfirmation(null);
    };
    const handleLogToggle = () => setIsLogVisible(!isLogVisible);

    let top, left, right, bottom;
    if (playerCount === 2) {
        left = me;
        right = otherPlayers[0];
    } else if (playerCount === 3) {
        left = otherPlayers[0];
        right = otherPlayers[1];
        bottom = me;
    } else if (playerCount === 4) {
        top = otherPlayers[0];
        left = otherPlayers[1];
        right = otherPlayers[2];
        bottom = me;
    }

    const layoutClass = `game-board layout-${playerCount}p`;

    return (
        <>
            {confirmation && <ConfirmationModal message={confirmation.message} onConfirm={() => handleConfirmation(true)} onDecline={() => handleConfirmation(false)} />}
            {(isStealModalOpen || isSwapModalOpen) && <PlayerSelectionModal title={isStealModalOpen ? "Who to steal from?" : "Who to swap with?"} players={otherPlayers} onSelectPlayer={handleSelectPlayer} onCancel={closeModal} />}
            <div className={layoutClass}>
                {top && <div className="player-position-top"><PlayerArea player={top} isMyArea={false} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} floatingTexts={floatingTexts.filter(t => t.targetPlayerId === top.id)} /></div>}
                {left && <div className="player-position-left"><PlayerArea player={left} isMyArea={left.id === myId} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} floatingTexts={floatingTexts.filter(t => t.targetPlayerId === left.id)} /></div>}
                <div className="center-controls">
                    <div className="turn-indicator">
                        <img src={currentPlayer.avatar} alt={`${currentPlayer.name}'s turn`} className="turn-indicator-avatar" />
                        <h2>Turn: {currentPlayer.name}</h2>
                        {isMyTurn && <button className="end-turn-image-button" onClick={handleEndTurn}><img src={endTurnButtonImage} alt="End Turn" /></button>}
                    </div>
                </div>
                {right && <div className="player-position-right"><PlayerArea player={right} isMyArea={right.id === myId} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} floatingTexts={floatingTexts.filter(t => t.targetPlayerId === right.id)} /></div>}
                {bottom && <div className="player-position-bottom"><PlayerArea player={bottom} isMyArea={true} onCardDrop={handleCardDrop} isMyTurn={isMyTurn} language={language} onSpecialCardClick={handleSpecialCardClick} floatingTexts={floatingTexts.filter(t => t.targetPlayerId === bottom.id)} /></div>}
            </div>
            {me && (
                <div 
                    ref={handContainerRef}
                    className="action-hand-container"
                    style={{
                        top: `${handPosition.y}px`,
                        left: `${handPosition.x}px`,
                    }}
                >
                    <h4 onMouseDown={onHandDragStart}>
                        Your Hand {isMyTurn ? "(Drag a card to play)" : "(Wait for your turn)"}
                    </h4>
                    <div className="action-cards">
                        {me.hand.map((card) => (
                            <DraggableActionCard key={card.id} card={card} language={language} onClick={handleSpecialCardClick} />
                        ))}
                    </div>
                </div>
            )}
            {isLogVisible && <GameLog logs={gameState.log} />}
            <button className="log-toggle-tab" onClick={handleLogToggle}>
                {isLogVisible ? 'Close Log' : 'Open Log'}
            </button>
        </>
    );
};

export default Game;