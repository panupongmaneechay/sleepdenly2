// server/playerActions.js

const { rooms, pendingActions } = require('./state');
const { executeAction } = require('./gameEngine');

const handleActionRequest = (roomId, actionData, io) => {
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

    if (hasPreventCard && sourcePlayerId !== targetPlayerId && !targetPlayer.isBot) {
        pendingActions[roomId] = { actionData, stage: 'prevention' };
        io.to(targetPlayer.id).emit('action_request', {
            message: `${sourcePlayer.name} is using ${card.name} on you. Use Prevent?`,
            actionData
        });
    } else {
        executeAction(roomId, actionData, io);
    }
};

module.exports = { handleActionRequest };