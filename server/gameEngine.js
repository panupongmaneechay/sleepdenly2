// server/gameEngine.js

const { shuffleDeck } = require('./gameData');
const { handleBotTurn } = require('./botAI');
const { rooms } = require('./state');

// ฟังก์ชัน executeAction และ endTurn ถูกย้ายมาที่นี่
// และต้องส่ง io เข้ามาเป็น parameter

function executeAction(roomId, actionData, io) {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const state = room.gameState;
    const { card, sourcePlayerId, targetPlayerId, targetCharacterName } = actionData;

    const sourcePlayer = state.players.find(p => p.id === sourcePlayerId);
    const targetPlayer = state.players.find(p => p.id === targetPlayerId);

    if (['add', 'subtract'].includes(card.type)) {
        io.to(roomId).emit('action_effect', {
            targetPlayerId: targetPlayerId,
            targetCharacterName: targetCharacterName,
            value: card.value,
            type: card.type
        });
    }

    const cardIndex = sourcePlayer.hand.findIndex(c => c.id === card.id);
    if (cardIndex > -1) {
        const playedCard = sourcePlayer.hand.splice(cardIndex, 1)[0];
        state.discardPile.push(playedCard);
    }

    switch (card.type) {
        case 'add':
            const targetCharAdd = targetPlayer.characters.find(c => c.name === targetCharacterName);
            targetCharAdd.currentSleep += card.value;
            break;
        case 'subtract':
            const targetCharSub = targetPlayer.characters.find(c => c.name === targetCharacterName);
            if (targetCharSub.currentSleep >= card.value) {
                targetCharSub.currentSleep -= card.value;
            } else {
                const overflowDamage = card.value - targetCharSub.currentSleep;
                targetCharSub.currentSleep = 0;
                targetCharSub.sleepGoal += overflowDamage;
            }
            break;
        case 'instant_sleep':
            const targetCharInstant = targetPlayer.characters.find(c => c.name === targetCharacterName);
            targetCharInstant.currentSleep = targetCharInstant.sleepGoal;
            break;
        case 'special_steal':
            const stolenCards = [...targetPlayer.hand];
            targetPlayer.hand = [];
            sourcePlayer.hand.push(...stolenCards);
            break;
        case 'special_swap':
            const cardsToGive = [...sourcePlayer.hand];
            const cardsToReceive = [...targetPlayer.hand];
            sourcePlayer.hand = cardsToReceive;
            targetPlayer.hand = cardsToGive;
            break;
    }

    if (['add', 'subtract', 'instant_sleep'].includes(card.type)) {
        state.playHistory.push(actionData);
    }

    state.log.unshift(`--- ${sourcePlayer.name} used ${card.name} on ${targetPlayer.name}! ---`);

    state.players.forEach(p => {
        p.sleptCharacters = p.characters.filter(c => c.sleepGoal > 0 && c.currentSleep === c.sleepGoal).length;
        if(p.sleptCharacters >= 3) {
            io.to(roomId).emit('game_over', { winner: p, playHistory: state.playHistory });
            delete rooms[roomId];
            return;
        }
    });

    if (!rooms[roomId]) return;

    state.turnVersion++;
    io.to(roomId).emit('update_game_state', state);
}

const endTurn = (roomId, io) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const state = room.gameState;
    const currentPlayer = state.players[state.currentPlayerIndex];

    if (currentPlayer.hand.length < 5) {
        let cardsToDraw = 5 - currentPlayer.hand.length;
        for(let i = 0; i < cardsToDraw; i++) {
            if (state.deck.length === 0) {
                if (state.discardPile.length === 0) break;
                state.deck = shuffleDeck(state.discardPile);
                state.discardPile = [];
            }
            if (state.deck.length > 0) currentPlayer.hand.push(state.deck.pop());
        }
    }

    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % room.maxPlayers;
    const nextPlayer = state.players[state.currentPlayerIndex];
    state.log.unshift(`--- ${currentPlayer.name}'s turn ended. Now it's ${nextPlayer.name}'s turn. ---`);
    state.turnVersion++;
    io.to(roomId).emit('update_game_state', state);

    if (nextPlayer.isBot) {
        const { handleActionRequest } = require('./playerActions'); // Lazy require to prevent circular dependency
        handleBotTurn(roomId, rooms, () => endTurn(roomId, io), (r, a) => executeAction(r, a, io), (r, a) => handleActionRequest(r, a, io));
    }
};

module.exports = {
    executeAction,
    endTurn
};