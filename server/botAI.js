// server/botAI.js

const handleBotTurn = async (roomId, rooms, endTurn, executeAction, handleActionRequest) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) {
        console.log(`Bot turn ended prematurely for room ${roomId} as it no longer exists.`);
        return;
    }

    const state = room.gameState;
    const botPlayer = state.players[state.currentPlayerIndex];
    const otherPlayers = state.players.filter(p => p.id !== botPlayer.id);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const playCard = (targetPlayer, card, targetCharacterName = null) => {
        const actionData = {
            card,
            sourcePlayerId: botPlayer.id,
            targetPlayerId: targetPlayer.id,
            targetCharacterName,
        };

        if (targetPlayer.id !== botPlayer.id && !targetPlayer.isBot) {
            handleActionRequest(roomId, actionData);
        } else {
            executeAction(roomId, actionData);
        }
    };
    
    const playableCards = botPlayer.hand.filter(card => 
        !card.type.startsWith('reaction_')
    );

    if (playableCards.length === 0) {
        console.log(`Bot ${botPlayer.name} has no playable cards and ends its turn.`);
        endTurn(roomId);
        return;
    }

    // [เพิ่ม] กลยุทธ์ใหม่: ตรวจสอบว่ามีตัวละครของตัวเองที่เวลานอนเกินเป้าหมายหรือไม่
    const overSleptChar = botPlayer.characters.find(c => c.currentSleep > c.sleepGoal);
    if (overSleptChar) {
        const subtractCard = playableCards.find(c => c.type === 'subtract');
        if (subtractCard) {
            // คำนวณค่าที่จะต้องลดเพื่อให้เวลานอนพอดี
            const requiredSubtract = overSleptChar.currentSleep - overSleptChar.sleepGoal;
            // ใช้การ์ดลบกับตัวเองถ้ามีค่าเหมาะสม
            if (subtractCard.value === requiredSubtract) {
                console.log(`Bot ${botPlayer.name} used a subtract card on its own character ${overSleptChar.name} to correct the sleep goal.`);
                playCard(botPlayer, subtractCard, overSleptChar.name);
                await delay(2000);
            }
        }
    }

    // 1. พยายามใช้การ์ด Lucky กับตัวเอง
    const luckyCard = playableCards.find(c => c.type === 'instant_sleep');
    if (luckyCard) {
        const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
        if (targetChar) {
            playCard(botPlayer, luckyCard, targetChar.name);
            await delay(2000);
        }
    }

    // 2. ใช้การ์ดพิเศษอื่นๆ (Thief, Swap) ถ้าเหมาะสม
    const thiefCard = playableCards.find(c => c.type === 'special_steal');
    if (thiefCard && otherPlayers.length > 0) {
        const targetPlayer = otherPlayers.reduce((prev, current) => (prev.hand.length > current.hand.length) ? prev : current);
        playCard(targetPlayer, thiefCard);
        await delay(2000);
    }
    
    const swapCard = playableCards.find(c => c.type === 'special_swap');
    if (swapCard && otherPlayers.length > 0) {
        const targetPlayer = otherPlayers.find(p => p.hand.length > botPlayer.hand.length);
        if (targetPlayer) {
             playCard(targetPlayer, swapCard);
             await delay(2000);
        }
    }
    
    // 3. เล่นการ์ด add/subtract ทั้งหมดที่อยู่ในมือ
    // [แก้ไข] เปลี่ยนกลยุทธ์การโจมตี
    for (let card of playableCards) {
        if (card.type === 'add') {
            const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
            if (targetChar) {
                playCard(botPlayer, card, targetChar.name);
                await delay(2000);
            }
        } else if (card.type === 'subtract') {
            // [แก้ไข] โจมตีผู้เล่นที่มีตัวละครที่ใกล้หลับมากที่สุด
            let bestTargetPlayer = null;
            let minRemainingSleep = Infinity;

            for (const player of otherPlayers) {
                for (const char of player.characters) {
                    const remainingSleep = char.sleepGoal - char.currentSleep;
                    if (remainingSleep > 0 && remainingSleep < minRemainingSleep) {
                        minRemainingSleep = remainingSleep;
                        bestTargetPlayer = player;
                    }
                }
            }

            if (bestTargetPlayer) {
                const targetChar = bestTargetPlayer.characters.find(c => c.sleepGoal - c.currentSleep === minRemainingSleep);
                if (targetChar) {
                    playCard(bestTargetPlayer, card, targetChar.name);
                    await delay(2000);
                }
            } else {
                // หากไม่มีใครใกล้จะหลับเลย ให้โจมตีแบบสุ่มเหมือนเดิม
                const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
                const targetChar = targetPlayer.characters.find(c => c.currentSleep > 0 && c.currentSleep !== c.sleepGoal);
                if (targetChar) {
                    playCard(targetPlayer, card, targetChar.name);
                    await delay(2000);
                }
            }
        }
    }
    
    console.log(`Bot ${botPlayer.name} finished its actions. Ending turn.`);
    endTurn(roomId); 
};

module.exports = { handleBotTurn };