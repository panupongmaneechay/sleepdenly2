// client/src/components/Game.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayerArea from './PlayerArea';
import PlayerSelectionModal from './PlayerSelectionModal';
import ConfirmationModal from './ConfirmationModal';
import GameLog from './GameLog';
import DraggableActionCard from './DraggableActionCard';
import endTurnButtonImage from '../assets/button/end.png';

const translations = {
    en: {
        useCardOnYou: (playerName, cardName) => `${playerName} is using ${cardName} on you. Use Prevent?`,
        useCounterCard: (playerName) => `${playerName} used Prevent. Use Break Down Defenses?`, // [เพิ่ม]
        yes: 'Yes',
        no: 'No',
        stealTitle: 'Who to steal from?',
        swapTitle: 'Who to swap with?',
        cancel: 'Cancel',
        cardNames: {
            "no_daytime_naps": "No daytime naps",
            "avoid_heavymeals": "Avoid heavy meals before bedtime",
            "work_life_balance": "Work & life balance",
            "go_to_bed": "Go to bed on time",
            "free_from_noise": "Free from noise",
            "avoid_caffeine": "Avoid caffeine",
            "stop_using_phone": "Stop using phone before going to bed",
            "free_from_odor_pollution": "Free from odor pollution",
            "exercise": "Exercise",
            "lights_off": "Sleep with the lights off",
            "bedroom_dark": "The bedroom is completely dark",
            "meditate": "Meditate",
            "cool_room": "Cool room colors",
            "drink_chamomile": "Drink chamomile",
            "good_income": "Good income",
            "drink_alcohol": "Drink alcohol (short term)",
            "listen_music": "Listen to music to reduce stress",
            "eye_patch": "Use eye patch",
            "drink_warm_milk": "Drink warm milk before going to bed",
            "eat_banana": "Eat a banana before going to bed",
            "massage_anmian": "Massage AnMian acupoint",
            "depression": "Depression",
            "sleeping_pills": "Consuming sleeping pills",
            "stressed": "Stressed",
            "loud_noise": "Loud noise",
            "drink_caffeine": "Drink caffeine before going to bed",
            "smoke": "Smoke",
            "stomachache": "Stomach ache",
            "play_phone": "Play phone before going to bed",
            "cold": "Cold hands & feet",
            "light_bedroom": "Light on in a bedroom",
            "heavy_meal": "Eat a heavy meal before going to bed",
            "sick": "Sick",
            "hot_weather": "Hot weather",
            "acid_reflux": "Acid reflux",
            "not_exercising": "Not exercising",
            "stay_up_late": "Stay up late",
            "snoring": "Snoring",
            "socialize_well": "Socialize well",
            "cough": "Cough",
            "get_odor_pollution": "Get odor pollution",
            "nightmare": "Nightmare",
            "drink_water_before_bed": "Drink water before going to bed",
            "eat_and_sleep": "Eat and sleep",
            "lucky": "Lucky!"
        }
    },
    th: {
        useCardOnYou: (playerName, cardName) => `${playerName} กำลังใช้การ์ด ${cardName} กับคุณ, ต้องการป้องกันหรือไม่?`,
        useCounterCard: (playerName) => `${playerName} ใช้การ์ดป้องกัน, ต้องการใช้การ์ดสลายการป้องกันหรือไม่?`, // [เพิ่ม]
        yes: 'ใช่',
        no: 'ไม่ใช่',
        stealTitle: 'ขโมยการ์ดจากใคร?',
        swapTitle: 'สลับการ์ดกับใคร?',
        cancel: 'ยกเลิก',
        cardNames: {
            "no_daytime_naps": "ไม่หลับกลางวัน",
            "avoid_heavymeals": "หลีกเลี่ยงมื้อหนักก่อนนอน",
            "work_life_balance": "งานกับชีวิตสมดุล",
            "go_to_bed": "นอนตรงเวลา",
            "free_from_noise": "ปราศจากเสียงรบกวน",
            "avoid_caffeine": "หลีกเลี่ยงคาเฟอีน",
            "stop_using_phone": "งดเล่นโทรศัพท์ก่อนนอน",
            "free_from_odor_pollution": "ปราศจากมลพิษทางกลิ่น",
            "exercise": "ออกกำลังกาย",
            "lights_off": "นอนปิดไฟ",
            "bedroom_dark": "ห้องนอนมืดสนิท",
            "meditate": "นั่งสมาธิ",
            "cool_room": "สีห้องเย็นตา",
            "drink_chamomile": "ดื่มคาโมมายล์",
            "good_income": "รายได้ดี",
            "drink_alcohol": "ดื่มแอลกอฮอล์ (ระยะสั้น)",
            "listen_music": "ฟังดนตรีลดความเครียด",
            "eye_patch": "ผ้าปิดตา",
            "drink_warm_milk": "ดื่มนมก่อนนอน",
            "eat_banana": "กินกล้วยก่อนนอน",
            "massage_anmian": "นวดจุดแอนเมียน",
            "depression": "ภาวะซึมเศร้า",
            "sleeping_pills": "กินยานอนหลับ",
            "stressed": "เครียด",
            "loud_noise": "เสียงดังรบกวน",
            "drink_caffeine": "ดื่มคาเฟอีนก่อนนอน",
            "smoke": "สูบบุหรี่",
            "stomachache": "ปวดท้อง",
            "play_phone": "เล่นโทรศัพท์ก่อนนอน",
            "cold": "อากาศหนาว",
            "light_bedroom": "ห้องนอนมีแสงสว่าง",
            "heavy_meal": "กินมื้อหนักก่อนนอน",
            "sick": "ป่วย",
            "hot_weather": "อากาศร้อน",
            "acid_reflux": "กรดไหลย้อน",
            "not_exercising": "ไม่ออกกำลังกาย",
            "stay_up_late": "นอนดึก",
            "snoring": "นอนกรน",
            "socialize_well": "เข้าสังคมดี",
            "cough": "ไอ",
            "get_odor_pollution": "มีมลพิษทางกลิ่น",
            "nightmare": "ฝันร้าย",
            "drink_water_before_bed": "ดื่มน้ำก่อนนอน",
            "eat_and_sleep": "กินแล้วนอน",
            "lucky": "โชคดี!"
        }
    },
    jp: {
        useCardOnYou: (playerName, cardName) => `${playerName} があなたに ${cardName} を使用しています。防御しますか？`,
        useCounterCard: (playerName) => `${playerName} が防御カードを使用しました。防御破壊カードを使用しますか？`, // [เพิ่ม]
        yes: 'はい',
        no: 'いいえ',
        stealTitle: '誰から盗みますか？',
        swapTitle: '誰と交換しますか？',
        cancel: 'キャンセル',
        cardNames: {
            "no_daytime_naps": "昼寝は禁止",
            "avoid_heavymeals": "就寝前に重い食事を避ける",
            "work_life_balance": "仕事と生活のバランス",
            "go_to_bed": "時間通りに寝る",
            "free_from_noise": "ノイズなし",
            "avoid_caffeine": "カフェインを避ける",
            "stop_using_phone": "寝る前に携帯電話の使用をやめましょう",
            "free_from_odor_pollution": "悪臭汚染なし",
            "exercise": "エクササイズ",
            "lights_off": "電気を消して寝る",
            "bedroom_dark": "寝室は真っ暗だ",
            "meditate": "瞑想する",
            "cool_room": "クールな部屋の色",
            "drink_chamomile": "カモミールを飲む",
            "good_income": "良い収入",
            "drink_alcohol": "アルコールを飲む (短期)",
            "listen_music": "音楽を聴いてストレスを軽減する",
            "eye_patch": "アイパッチ",
            "drink_warm_milk": "寝る前に暖かい牛乳を飲む",
            "eat_banana": "寝る前にバナナを食べる",
            "massage_anmian": "マッサージアンミアンポイント",
            "depression": "うつ",
            "sleeping_pills": "睡眠薬の服用",
            "stressed": "ストレス",
            "loud_noise": "大きな音",
            "drink_caffeine": "寝る前にカフェインを飲む",
            "smoke": "タバコ",
            "stomachache": "腹痛",
            "play_phone": "寝る前に携帯で遊ぶ",
            "cold": "手足が冷たい",
            "light_bedroom": "寝室が明るい",
            "heavy_meal": "寝る前にしっかりとした食事をとる",
            "sick": "病気",
            "hot_weather": "暑い天気",
            "acid_reflux": "胃酸の逆流",
            "not_exercising": "運動をしない",
            "stay_up_late": "夜更かしする",
            "snoring": "いびき",
            "socialize_well": "社交を上手にに行う",
            "cough": "咳",
            "get_odor_pollution": "悪臭公害がある",
            "nightmare": "悪夢",
            "drink_water_before_bed": "寝る前に水を飲む",
            "eat_and_sleep": "食べて寝る",
            "lucky": "ラッキー！"
        }
    }
};


const Game = ({ gameState, myId, socket, language }) => {
    const [isStealModalOpen, setIsStealModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [specialCard, setSpecialCard] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [isLogVisible, setIsLogVisible] = useState(true);

    const handContainerRef = useRef(null);
    const [handPosition, setHandPosition] = useState({ x: 16, y: 0 });
    const [isDraggingHand, setIsDraggingHand] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

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

    useEffect(() => {
        socket.on('action_request', (data) => {
            const t = translations[language] || translations.en;
            const cardName = t.cardNames[data.placeholders.cardNameKey] || data.placeholders.cardNameKey;
            const message = t.useCardOnYou(data.placeholders.playerName, cardName);

            setConfirmation({
                type: 'prevent',
                message: message,
                actionData: data.actionData,
                yesText: t.yes,
                noText: t.no
            });
        });
        
        // [แก้ไข] เพิ่มการจัดการ counter_request
        socket.on('counter_request', (data) => {
            const t = translations[language] || translations.en;
            const message = t.useCounterCard(data.placeholders.playerName);

            setConfirmation({
                type: 'counter',
                message: message,
                yesText: t.yes,
                noText: t.no
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
    }, [socket, language]);

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
    const t = translations[language] || translations.en;

    return (
        <>
            {confirmation && (
                <ConfirmationModal 
                    message={confirmation.message} 
                    onConfirm={() => handleConfirmation(true)} 
                    onDecline={() => handleConfirmation(false)}
                    yesText={confirmation.yesText}
                    noText={confirmation.noText}
                />
            )}
            {(isStealModalOpen || isSwapModalOpen) && (
                <PlayerSelectionModal 
                    title={isStealModalOpen ? t.stealTitle : t.swapTitle} 
                    players={otherPlayers} 
                    onSelectPlayer={handleSelectPlayer} 
                    onCancel={closeModal}
                    cancelText={t.cancel}
                />
            )}
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