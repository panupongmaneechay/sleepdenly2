// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { characterCards, actionCards, shuffleDeck, createDeckFromRarity } = require('./gameData');
const { handleBotTurn } = require('./botAI');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
    cors: { origin: "http://10.30.16.104:5173", methods: ["GET", "POST"] }
});
const rooms = {};
const pendingActions = {};

function generateRoomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const handleActionRequest = (roomId, actionData) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const { card, sourcePlayerId, targetPlayerId } = actionData;
    const sourcePlayer = room.gameState.players.find(p => p.id === sourcePlayerId);
    const targetPlayer = room.gameState.players.find(p => p.id === targetPlayerId);

    if (!targetPlayer) {
        console.error(`Target player with ID ${targetPlayerId} not found in room ${roomId}`);
        return;
    }
    
    const hasPreventCard = targetPlayer.hand.some(c => c.type === 'reaction_prevent');

    if (hasPreventCard && sourcePlayerId !== targetPlayerId) {
        pendingActions[roomId] = { actionData, stage: 'prevention' };
        io.to(targetPlayer.id).emit('action_request', {
            message: `${sourcePlayer.name} is using ${card.name} on you. Use Prevent?`,
        });
    } else {
        executeAction(roomId, actionData);
    }
};


const endTurn = (roomId) => {
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
        handleBotTurn(roomId, rooms, endTurn, executeAction, handleActionRequest);
    }
};

function executeAction(roomId, actionData) {
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

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('create_room', (data) => {
    const { maxPlayers, bots } = data;
    let roomId;
    do {
        roomId = generateRoomId(4);
    } while (rooms[roomId]);

    rooms[roomId] = {
      id: roomId,
      players: [{ id: socket.id, name: `Player 1` }],
      bots: bots || 0, maxPlayers: parseInt(maxPlayers),
    };
    socket.join(roomId);
    socket.emit('room_created', rooms[roomId]);
    checkAndStartGame(roomId);
  });

  socket.on('join_room', (data) => {
    const { roomId } = data;
    const room = rooms[roomId];
    if (room && !room.gameState) {
        if (room.players.length + room.bots < room.maxPlayers) {
            const playerNumber = room.players.length + 1;
            room.players.push({ id: socket.id, name: `Player ${playerNumber}` });
            socket.join(roomId);
            socket.emit('room_joined', room);
            io.to(roomId).emit('room_updated', room);
            checkAndStartGame(roomId);
        } else {
            socket.emit('error_message', 'Room is full.');
        }
    } else {
        socket.emit('error_message', 'Room not found or game already started.');
    }
  });

  // [เพิ่ม] listener สำหรับ add_bot
  socket.on('add_bot', (data) => {
    const { roomId } = data;
    const room = rooms[roomId];
    if (room && room.players[0].id === socket.id && room.players.length + room.bots < room.maxPlayers) {
        room.bots++;
        io.to(roomId).emit('room_updated', room);
        checkAndStartGame(roomId);
    } else {
        socket.emit('error_message', 'You cannot add a bot to this room.');
    }
  });
  
  const checkAndStartGame = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;
    const totalEntities = room.players.length + room.bots;
    if (totalEntities === room.maxPlayers) {
        const shuffledChars = shuffleDeck([...characterCards]);
        const initialDeck = createDeckFromRarity();
        const gameState = {
            roomId: roomId,
            players: [],
            deck: shuffleDeck(initialDeck),
            discardPile: [],
            currentPlayerIndex: 0,
            log: ["Game has started!"],
            playHistory: [],
            turnVersion: 0,
        };
        
        let playerCounter = 1;
        let botCounter = 1;

        room.players.forEach(player => {
            gameState.players.push({
                ...player,
                name: `Player ${playerCounter++}`,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        });

        for(let i = 0; i < room.bots; i++) {
             gameState.players.push({
                id: `bot-${i+1}`, 
                name: `Bot ${botCounter++}`,
                isBot: true,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        }

        room.gameState = gameState;
        io.to(roomId).emit('game_started', room.gameState);
        if (gameState.players[0].isBot) {
            handleBotTurn(roomId, rooms, endTurn, executeAction, handleActionRequest);
        }
    }
  };
  
  socket.on('play_card', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }));
  socket.on('steal_cards', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }));
  socket.on('swap_cards', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }));

  socket.on('action_response', (data) => {
    const { roomId, useCard } = data;
    const pendingAction = pendingActions[roomId];
    if (!pendingAction || pendingAction.stage !== 'prevention') return;

    const { actionData } = pendingAction;
    const state = rooms[roomId].gameState;
    const targetPlayer = state.players.find(p => p.id === socket.id);
    const sourcePlayer = state.players.find(p => p.id === actionData.sourcePlayerId);

    if (useCard) {
        const preventCardIndex = targetPlayer.hand.findIndex(c => c.type === 'reaction_prevent');
        if (preventCardIndex > -1) {
            const preventCard = targetPlayer.hand.splice(preventCardIndex, 1)[0];
            state.discardPile.push(preventCard);
            
            const hasCounterCard = sourcePlayer.hand.some(c => c.type === 'reaction_counter');
            if (hasCounterCard) {
                pendingActions[roomId].stage = 'counter';
                io.to(sourcePlayer.id).emit('counter_request', {
                    message: `${targetPlayer.name} used Prevent. Use Break Down Defenses?`
                });
            } else {
                const sourceCardIndex = sourcePlayer.hand.findIndex(c => c.id === actionData.card.id);
                 if (sourceCardIndex > -1) {
                    const playedCard = sourcePlayer.hand.splice(sourceCardIndex, 1)[0];
                    state.discardPile.push(playedCard);
                }
                state.log.unshift(`--- ${targetPlayer.name} prevented ${sourcePlayer.name}'s action! ---`);
                state.turnVersion++;
                io.to(roomId).emit('update_game_state', state);
                delete pendingActions[roomId];
            }
        }
    } else {
        executeAction(roomId, actionData);
        delete pendingActions[roomId];
    }
  });

  socket.on('counter_response', (data) => {
    const { roomId, useCard } = data;
    const pendingAction = pendingActions[roomId];
    if (!pendingAction || pendingAction.stage !== 'counter') return;
    
    const { actionData } = pendingAction;
    const state = rooms[roomId].gameState;
    const sourcePlayer = state.players.find(p => p.id === socket.id);
    const targetPlayer = state.players.find(p => p.id === actionData.targetPlayerId);

    if (useCard) {
        const counterCardIndex = sourcePlayer.hand.findIndex(c => c.type === 'reaction_counter');
        if (counterCardIndex > -1) {
            const counterCard = sourcePlayer.hand.splice(counterCardIndex, 1)[0];
            state.discardPile.push(counterCard);
            state.log.unshift(`--- ${sourcePlayer.name} broke the defense! ---`);
            executeAction(roomId, actionData);
        }
    } else {
       const sourceCardIndex = sourcePlayer.hand.findIndex(c => c.id === actionData.card.id);
       if (sourceCardIndex > -1) {
          const playedCard = sourcePlayer.hand.splice(sourceCardIndex, 1)[0];
          state.discardPile.push(playedCard);
       }
       state.log.unshift(`--- ${sourcePlayer.name}'s action was prevented by ${targetPlayer.name}! ---`);
       state.turnVersion++;
       io.to(roomId).emit('update_game_state', state);
    }
    delete pendingActions[roomId];
  });

  socket.on('end_turn', ({ roomId }) => {
    if(pendingActions[roomId]) return;
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const currentPlayer = room.gameState.players[room.gameState.currentPlayerIndex];
    if (currentPlayer.id === socket.id) {
        endTurn(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});