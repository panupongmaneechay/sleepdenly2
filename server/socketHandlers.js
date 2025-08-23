// server/socketHandlers.js

const { createRoom, joinRoom, addBot } = require('./roomManager');
const { endTurn, executeAction } = require('./gameEngine');
const { handleActionRequest } = require('./playerActions');
const { rooms, pendingActions } = require('./state');

function initializeSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('create_room', (data) => createRoom(socket, data));
        socket.on('join_room', (data) => joinRoom(socket, data));
        socket.on('add_bot', (data) => addBot(socket, data));

        socket.on('play_card', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }, io));
        socket.on('steal_cards', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }, io));
        socket.on('swap_cards', (data) => handleActionRequest(data.roomId, { ...data, sourcePlayerId: socket.id }, io));

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
                executeAction(roomId, actionData, io);
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
                    executeAction(roomId, actionData, io);
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
                endTurn(roomId, io);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
}

module.exports = { initializeSocketHandlers };