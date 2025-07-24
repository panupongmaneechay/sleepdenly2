// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { characterCards, shuffleDeck, createDeckFromRarity } = require('./gameData');
const { handleBotTurn } = require('./botAI');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});
const rooms = {};

// =================================================================
// GAME HELPER FUNCTIONS
// =================================================================
const endTurn = (roomId) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const state = room.gameState;
    const currentPlayer = state.players[state.currentPlayerIndex];
    let cardsToDraw = 5 - currentPlayer.hand.length;
    if (cardsToDraw > 0) {
        for(let i = 0; i < cardsToDraw; i++) {
            if (state.deck.length === 0) {
                if (state.discardPile.length === 0) {
                    state.log.unshift("--- Deck and Discard Pile are empty. No more cards to draw! ---");
                    break;
                }
                state.log.unshift("--- Deck is empty. Reshuffling discard pile... ---");
                state.deck = shuffleDeck(state.discardPile);
                state.discardPile = [];
            }
            currentPlayer.hand.push(state.deck.pop());
        }
    }
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % room.maxPlayers;
    const nextPlayer = state.players[state.currentPlayerIndex];
    state.log.unshift(`--- ${currentPlayer.name}'s turn ended. Now it's ${nextPlayer.name}'s turn. ---`);

    // **[แก้ไข]** เพิ่มเวอร์ชันก่อนส่ง
    state.turnVersion++;
    io.to(roomId).emit('update_game_state', state);

    if (nextPlayer.isBot) {
        console.log(`Next turn is for Bot: ${nextPlayer.name}. Handling...`);
        handleBotTurn(roomId, rooms, endTurn);
    }
};

// =================================================================
// SOCKET.IO EVENT HANDLERS
// =================================================================
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('create_room', (data) => {
    const { maxPlayers, bots } = data;
    const roomId = uuidv4();
    rooms[roomId] = {
      id: roomId,
      players: [{ id: socket.id, name: `Player ${socket.id.substring(0, 5)}` }],
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
            room.players.push({ id: socket.id, name: `Player ${socket.id.substring(0, 5)}` });
            socket.join(roomId);
            socket.emit('room_joined', room);
            io.to(roomId).emit('room_updated', room);
            checkAndStartGame(roomId);
        } else {
            socket.emit('error_message', 'Room is full.');
        }
    } else if (room && room.gameState) {
        socket.emit('error_message', 'Game has already started in this room.');
    } else {
        socket.emit('error_message', 'Room not found.');
    }
  });


  socket.on('add_bot', (data) => {
      const { roomId } = data;
      if (rooms[roomId]) {
          const room = rooms[roomId];
          if (room.players.length + room.bots < room.maxPlayers) {
              room.bots++;
              io.to(roomId).emit('room_updated', room);
              checkAndStartGame(roomId);
          }
      }
  });

  const checkAndStartGame = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;
    const totalEntities = room.players.length + room.bots;
    if (totalEntities === room.maxPlayers) {
        const shuffledChars = shuffleDeck([...characterCards]);
        const initialDeck = createDeckFromRarity();
        const shuffledActions = shuffleDeck(initialDeck);
        const gameState = {
            roomId: roomId,
            players: [],
            deck: shuffledActions,
            discardPile: [],
            currentPlayerIndex: 0,
            log: ["Game has started!"],
            turnVersion: 0, // **[แก้ไข]** เพิ่ม turnVersion เริ่มต้น
        };
        room.players.forEach(player => {
            gameState.players.push({
                id: player.id, name: player.name,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        });
        for(let i = 0; i < room.bots; i++) {
             gameState.players.push({
                id: `bot-${i+1}`, name: `Bot ${i+1}`, isBot: true,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        }
        room.gameState = gameState;
        io.to(roomId).emit('game_started', room.gameState);
        if (gameState.players[0].isBot) {
            handleBotTurn(roomId, rooms, endTurn);
        }
    }
  };

  socket.on('play_card', (data) => {
    const { roomId, card, targetPlayerId, targetCharacterName } = data;
    const room = rooms[roomId];
    if (!room || !room.gameState) return;
    const state = room.gameState;
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (currentPlayer.id !== socket.id) return socket.emit('error_message', "It's not your turn!");

    const targetPlayer = state.players.find(p => p.id === targetPlayerId);
    const targetCharacter = targetPlayer.characters.find(c => c.name === targetCharacterName);

    if (targetCharacter.currentSleep === targetCharacter.sleepGoal && targetCharacter.sleepGoal > 0) {
        return socket.emit('error_message', `${targetCharacter.name} is already sleeping perfectly and cannot be targeted.`);
    }

    if(card.type === 'add') {
        targetCharacter.currentSleep += card.value;
    } else if (card.type === 'subtract') {
        if (targetCharacter.currentSleep >= card.value) {
            targetCharacter.currentSleep -= card.value;
        } else {
            const overflowDamage = card.value - targetCharacter.currentSleep;
            targetCharacter.currentSleep = 0;
            targetCharacter.sleepGoal += overflowDamage;
        }
    } else if (card.type === 'instant_sleep') {
        targetCharacter.currentSleep = targetCharacter.sleepGoal;
    }
    state.log.unshift(`${currentPlayer.name} used ${card.name} on ${targetPlayer.name}'s ${targetCharacter.name}.`);

    const cardIndex = currentPlayer.hand.findIndex(c => c.name === card.name && c.description === card.description);
    if (cardIndex > -1) {
        const playedCard = currentPlayer.hand.splice(cardIndex, 1)[0];
        state.discardPile.push(playedCard);
    }

    const newSleptCount = targetPlayer.characters.filter(c => c.sleepGoal > 0 && c.currentSleep === c.sleepGoal).length;
    targetPlayer.sleptCharacters = newSleptCount;

    if(targetPlayer.sleptCharacters >= 3) {
        io.to(roomId).emit('game_over', { winner: targetPlayer.name });
        delete rooms[roomId];
        return;
    }
    if (currentPlayer.hand.length === 0) {
        state.log.unshift(`${currentPlayer.name} has no cards left, ending turn automatically.`);
        endTurn(roomId);
    } else {
        // **[แก้ไข]** เพิ่มเวอร์ชันก่อนส่ง
        state.turnVersion++;
        io.to(roomId).emit('update_game_state', state);
    }
  });

  socket.on('end_turn', ({ roomId }) => {
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