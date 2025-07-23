// server/botAI.js

const handleBotTurn = (roomId, rooms, endTurn) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const state = room.gameState;
    const botPlayer = state.players[state.currentPlayerIndex];

    setTimeout(() => {
        let cardPlayed = false;
        for (let i = 0; i < botPlayer.hand.length; i++) {
            const card = botPlayer.hand[i];
            
            if (card.type === 'add') {
                const targetChar = botPlayer.characters.find(c => c.currentSleep < c.sleepGoal);
                if (targetChar) {
                    targetChar.currentSleep += card.value;
                    state.log.unshift(`(BOT) ${botPlayer.name} used ${card.name} on their ${targetChar.name}.`);
                    botPlayer.hand.splice(i, 1);
                    cardPlayed = true;
                    break;
                }
            } else if (card.type === 'subtract') {
                const humanPlayers = state.players.filter(p => !p.isBot);
                if (humanPlayers.length > 0) {
                    const targetPlayer = humanPlayers[Math.floor(Math.random() * humanPlayers.length)];
                    const availableTargets = targetPlayer.characters.filter(c => c.sleepGoal > 0 && c.currentSleep !== c.sleepGoal);

                    if (availableTargets.length > 0) {
                        const targetChar = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                        
                        // **Logic ใหม่สำหรับบอท**
                        if (targetChar.currentSleep >= card.value) {
                            targetChar.currentSleep -= card.value;
                        } else {
                            const overflowDamage = card.value - targetChar.currentSleep;
                            targetChar.currentSleep = 0;
                            targetChar.sleepGoal += overflowDamage;
                        }

                        state.log.unshift(`(BOT) ${botPlayer.name} used ${card.name} on ${targetPlayer.name}'s ${targetChar.name}.`);
                        botPlayer.hand.splice(i, 1);
                        cardPlayed = true;
                        break;
                    }
                }
            }
        }
        console.log(`Bot ${botPlayer.name} ended its turn.`);
        endTurn(roomId); 
    }, 2000);
};

module.exports = { handleBotTurn };