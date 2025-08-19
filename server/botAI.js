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

    // ฟังก์ชันสำหรับส่ง Action
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
    
    // สร้างรายการการ์ดที่ "สามารถเล่นได้" ในเทิร์นนี้
    const playableCards = botPlayer.hand.filter(card => 
        !card.type.startsWith('reaction_')
    );

    if (playableCards.length === 0) {
        console.log(`Bot ${botPlayer.name} has no playable cards and ends its turn.`);
        endTurn(roomId);
        return;
    }

    // 1. พยายามใช้การ์ด Lucky กับตัวเอง
    const luckyCard = playableCards.find(c => c.type === 'instant_sleep');
    if (luckyCard) {
        const targetChar = botPlayer.characters.find(c => c.currentSleep !== c.sleepGoal);
        if (targetChar) {
            playCard(botPlayer, luckyCard, targetChar.name);
            await delay(2000);
        }
    }

    // 2. ใช้การ์ดพิเศษอื่นๆ (Thief, Swap) ถ้าเหมาะสม
    const thiefCard = playableCards.find(c => c.type === 'special_steal');
    if (thiefCard && otherPlayers.length > 0) {
        // ขโมยผู้เล่นที่มีการ์ดเยอะที่สุด
        const targetPlayer = otherPlayers.reduce((prev, current) => (prev.hand.length > current.hand.length) ? prev : current);
        playCard(targetPlayer, thiefCard);
        await delay(2000);
    }
    
    const swapCard = playableCards.find(c => c.type === 'special_swap');
    if (swapCard && otherPlayers.length > 0) {
        // ใช้ swap เมื่อตัวเองมีการ์ดน้อยกว่า 3 ใบ และมีคนอื่นที่มีการ์ดมากกว่า
        const targetPlayer = otherPlayers.find(p => p.hand.length > botPlayer.hand.length);
        if (targetPlayer) {
             playCard(targetPlayer, swapCard);
             await delay(2000);
        }
    }
    
    // 3. เล่นการ์ด add/subtract ทั้งหมดที่อยู่ในมือ
    // การลบคำสั่ง 'break' ทำให้บอทเล่นการ์ดทั้งหมดในประเภทนั้นๆ
    for (let card of playableCards) {
        if (card.type === 'add') {
            const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
            if (targetChar) {
                playCard(botPlayer, card, targetChar.name);
                await delay(2000);
            }
        } else if (card.type === 'subtract') {
            const humanPlayers = otherPlayers.filter(p => !p.isBot);
            const targetPlayers = humanPlayers.length > 0 ? humanPlayers : otherPlayers;

            if (targetPlayers.length > 0) {
                const targetPlayer = targetPlayers[Math.floor(Math.random() * targetPlayers.length)];
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