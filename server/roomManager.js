// server/roomManager.js

const { characterCards, shuffleDeck, createDeckFromRarity } = require('./gameData');
const { handleBotTurn } = require('./botAI');
const { rooms } = require('./state');

function generateRoomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function checkAndStartGame(roomId, io) {
    const room = rooms[roomId];
    if (!room) return;

    // Lazy require to avoid circular dependencies at startup
    const { endTurn, executeAction } = require('./gameEngine');
    const { handleActionRequest } = require('./playerActions');

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
        
        const botAvatars = {
            1: '/src/assets/avatar/Avatar_01.png',
            2: '/src/assets/avatar/Avatar_02.png',
            3: '/src/assets/avatar/Avatar_03.png',
            4: '/src/assets/avatar/Avatar_04.png',
            5: '/src/assets/avatar/Avatar_05.png',
            6: '/src/assets/avatar/Avatar_06.png',
            7: '/src/assets/avatar/Avatar_07.png',
            8: '/src/assets/avatar/Avatar_08.png',
            9: '/src/assets/avatar/Avatar_09.png',
            10: '/src/assets/avatar/Avatar_10.png',
            11: '/src/assets/avatar/Avatar_11.png',
            12: '/src/assets/avatar/Avatar_12.png',
            13: '/src/assets/avatar/Avatar_13.png',
            14: '/src/assets/avatar/Avatar_14.png',
            15: '/src/assets/avatar/Avatar_15.png',

        };

        room.players.forEach(player => {
            gameState.players.push({
                ...player,
                name: `Player ${gameState.players.length + 1}`,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        });

        for(let i = 0; i < room.bots; i++) {
            const botNumber = i + 1;
            const botAvatar = botAvatars[botNumber] || '/src/assets/avatar/Avatar_01.png';

            gameState.players.push({
                id: `bot-${i+1}`,
                name: `Bot ${i + 1}`,
                isBot: true,
                avatar: botAvatar,
                characters: shuffledChars.splice(0, 3).map(char => ({ ...char, currentSleep: 0 })),
                hand: gameState.deck.splice(0, 5), sleptCharacters: 0,
            });
        }

        room.gameState = gameState;
        io.to(roomId).emit('game_started', room.gameState);
        if (gameState.players[0].isBot) {
            handleBotTurn(roomId, rooms, () => endTurn(roomId, io), (r, a) => executeAction(r, a, io), (r, a) => handleActionRequest(r, a, io));
        }
    }
}

function createRoom(socket, { maxPlayers, bots, avatar }) {
    let roomId;
    do {
        roomId = generateRoomId(4);
    } while (rooms[roomId]);

    rooms[roomId] = {
      id: roomId,
      players: [{ id: socket.id, name: `Player 1`, avatar }],
      bots: bots || 0, maxPlayers: parseInt(maxPlayers),
    };
    socket.join(roomId);
    socket.emit('room_created', rooms[roomId]);
    checkAndStartGame(roomId, socket.server);
}

function joinRoom(socket, { roomId, avatar }) {
    const room = rooms[roomId];
    if (room && !room.gameState) {
        if (room.players.length + room.bots < room.maxPlayers) {
            const playerNumber = room.players.length + 1;
            room.players.push({ id: socket.id, name: `Player ${playerNumber}`, avatar });
            socket.join(roomId);
            socket.emit('room_joined', room);
            socket.server.to(roomId).emit('room_updated', room);
            checkAndStartGame(roomId, socket.server);
        } else {
            socket.emit('error_message', 'Room is full.');
        }
    } else {
        socket.emit('error_message', 'Room not found or game already started.');
    }
}

function addBot(socket, { roomId }) {
    const room = rooms[roomId];
    if (room && room.players[0].id === socket.id && room.players.length + room.bots < room.maxPlayers) {
        room.bots++;
        socket.server.to(roomId).emit('room_updated', room);
        checkAndStartGame(roomId, socket.server);
    } else {
        socket.emit('error_message', 'You cannot add a bot to this room.');
    }
}

module.exports = { createRoom, joinRoom, addBot };