// server/botAI.js

const handleBotTurn = (roomId, rooms, endTurn, executeAction) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) {
        console.log(`Bot turn ended prematurely for room ${roomId} as it no longer exists.`);
        return;
    }

    const state = room.gameState;
    const botPlayer = state.players[state.currentPlayerIndex];
    const otherPlayers = state.players.filter(p => p.id !== botPlayer.id);

    setTimeout(() => {
        // สร้างรายการการ์ดที่ "สามารถเล่นได้" ในเทิร์นนี้
        const playableCards = botPlayer.hand.filter(card => 
            !card.type.startsWith('reaction_') // ไม่เล่นการ์ดป้องกัน/เคาน์เตอร์
        );

        if (playableCards.length === 0) {
            // ถ้าไม่มีการ์ดเล่นได้เลย ให้จบเทิร์น
            console.log(`Bot ${botPlayer.name} has no playable cards and ends its turn.`);
            endTurn(roomId);
            return;
        }

        let actionTaken = false;

        // Logic การตัดสินใจของ Bot (เรียงตามลำดับความสำคัญ)
        // 1. พยายามใช้การ์ด Lucky กับตัวเองก่อน
        const luckyCard = playableCards.find(c => c.type === 'instant_sleep');
        if (luckyCard) {
            const targetChar = botPlayer.characters.find(c => c.currentSleep !== c.sleepGoal);
            if (targetChar) {
                executeAction(roomId, { card: luckyCard, sourcePlayerId: botPlayer.id, targetPlayerId: botPlayer.id, targetCharacterName: targetChar.name });
                actionTaken = true;
            }
        }

        // 2. ถ้ายังไม่ได้เล่น ให้ลองใช้การ์ดพิเศษอื่นๆ (Thief, Swap)
        if (!actionTaken && otherPlayers.length > 0) {
            const thiefCard = playableCards.find(c => c.type === 'special_steal');
            if (thiefCard) {
                // ขโมยผู้เล่นที่มีการ์ดเยอะที่สุด
                const targetPlayer = otherPlayers.reduce((prev, current) => (prev.hand.length > current.hand.length) ? prev : current);
                executeAction(roomId, { card: thiefCard, sourcePlayerId: botPlayer.id, targetPlayerId: targetPlayer.id });
                actionTaken = true;
            }
        }
        
        if (!actionTaken && otherPlayers.length > 0) {
            const swapCard = playableCards.find(c => c.type === 'special_swap');
            // ใช้ swap ต่อเมื่อตัวเองมีการ์ดน้อยกว่า 3 ใบ และมีคนอื่นที่มีการ์ดมากกว่า
            const targetPlayer = otherPlayers.find(p => p.hand.length > botPlayer.hand.length);
            if (swapCard && botPlayer.hand.length < 3 && targetPlayer) {
                 executeAction(roomId, { card: swapCard, sourcePlayerId: botPlayer.id, targetPlayerId: targetPlayer.id });
                 actionTaken = true;
            }
        }
        
        // 3. ถ้ายังไม่ได้เล่น ให้เล่นการ์ด add/subtract ตามปกติ
        if (!actionTaken) {
            for (let card of playableCards) {
                if (card.type === 'add') {
                    const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
                    if (targetChar) {
                        executeAction(roomId, { card: card, sourcePlayerId: botPlayer.id, targetPlayerId: botPlayer.id, targetCharacterName: targetChar.name });
                        actionTaken = true;
                        break;
                    }
                } else if (card.type === 'subtract') {
                    const humanPlayers = state.players.filter(p => !p.isBot);
                    if (humanPlayers.length > 0) {
                        const targetPlayer = humanPlayers[Math.floor(Math.random() * humanPlayers.length)];
                        const targetChar = targetPlayer.characters.find(c => c.currentSleep > 0 && c.currentSleep !== c.sleepGoal);
                        if (targetChar) {
                            executeAction(roomId, { card: card, sourcePlayerId: botPlayer.id, targetPlayerId: targetPlayer.id, targetCharacterName: targetChar.name });
                            actionTaken = true;
                            break;
                        }
                    }
                }
            }
        }
        
        console.log(`Bot ${botPlayer.name} finished its action. Ending turn.`);
        endTurn(roomId); 
    }, 2000); // หน่วงเวลาให้เหมือนบอทกำลังคิด
};

module.exports = { handleBotTurn };
