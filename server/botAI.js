// server/botAI.js

// [แก้ไข] เพิ่ม handleActionRequest เป็นพารามิเตอร์
const handleBotTurn = (roomId, rooms, endTurn, executeAction, handleActionRequest) => {
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

        // ฟังก์ชันสำหรับส่ง Action เพื่อให้โค้ดสะอาดขึ้น
        const playCard = (targetPlayer, card, targetCharacterName = null) => {
            const actionData = {
                card,
                sourcePlayerId: botPlayer.id,
                targetPlayerId: targetPlayer.id,
                targetCharacterName,
            };

            // [แก้ไข] ถ้าเป้าหมายคือผู้เล่นคนอื่นที่ไม่ใช่บอท ให้ใช้ handleActionRequest
            // เพื่อให้ผู้เล่นสามารถใช้การ์ด Prevent ได้
            if (targetPlayer.id !== botPlayer.id && !targetPlayer.isBot) {
                handleActionRequest(roomId, actionData);
            } else {
                executeAction(roomId, actionData);
            }
            actionTaken = true;
        };

        // 1. พยายามใช้การ์ด Lucky กับตัวเองก่อน
        const luckyCard = playableCards.find(c => c.type === 'instant_sleep');
        if (luckyCard) {
            const targetChar = botPlayer.characters.find(c => c.currentSleep !== c.sleepGoal);
            if (targetChar) {
                playCard(botPlayer, luckyCard, targetChar.name);
            }
        }

        // 2. ถ้ายังไม่ได้เล่น ให้ลองใช้การ์ดพิเศษอื่นๆ (Thief, Swap)
        if (!actionTaken && otherPlayers.length > 0) {
            const thiefCard = playableCards.find(c => c.type === 'special_steal');
            if (thiefCard) {
                // ขโมยผู้เล่นที่มีการ์ดเยอะที่สุด
                const targetPlayer = otherPlayers.reduce((prev, current) => (prev.hand.length > current.hand.length) ? prev : current);
                playCard(targetPlayer, thiefCard);
            }
        }
        
        if (!actionTaken && otherPlayers.length > 0) {
            const swapCard = playableCards.find(c => c.type === 'special_swap');
            // ใช้ swap ต่อเมื่อตัวเองมีการ์ดน้อยกว่า 3 ใบ และมีคนอื่นที่มีการ์ดมากกว่า
            const targetPlayer = otherPlayers.find(p => p.hand.length > botPlayer.hand.length);
            if (swapCard && botPlayer.hand.length < 3 && targetPlayer) {
                 playCard(targetPlayer, swapCard);
            }
        }
        
        // 3. ถ้ายังไม่ได้เล่น ให้เล่นการ์ด add/subtract ตามปกติ
        if (!actionTaken) {
            for (let card of playableCards) {
                if (card.type === 'add') {
                    const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
                    if (targetChar) {
                        playCard(botPlayer, card, targetChar.name);
                        break;
                    }
                } else if (card.type === 'subtract') {
                    // [แก้ไข] ให้โจมตีผู้เล่นที่เป็นคนก่อน ถ้าไม่มี ค่อยโจมตีบอท
                    const humanPlayers = otherPlayers.filter(p => !p.isBot);
                    const targetPlayers = humanPlayers.length > 0 ? humanPlayers : otherPlayers;

                    if (targetPlayers.length > 0) {
                        const targetPlayer = targetPlayers[Math.floor(Math.random() * targetPlayers.length)];
                        const targetChar = targetPlayer.characters.find(c => c.currentSleep > 0 && c.currentSleep !== c.sleepGoal);
                        if (targetChar) {
                            playCard(targetPlayer, card, targetChar.name);
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