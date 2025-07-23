// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Game from './components/Game';

const socket = io("http://localhost:3001");

function App() {
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [numBots, setNumBots] = useState(0);

  useEffect(() => {
    socket.on('room_created', (roomData) => {
      console.log('Room created successfully:', roomData);
      setRoom(roomData);
    });
    
    socket.on('room_updated', (roomData) => {
      console.log('Room has been updated:', roomData);
      setRoom(roomData);
    });

    socket.on('game_started', (initialGameState) => {
      console.log('Game Started!', initialGameState);
      setGameState(initialGameState);
      setRoom(null);
    });

    socket.on('update_game_state', (newGameState) => {
      console.log("Game state updated");
      setGameState(newGameState);
    });

    socket.on('game_over', (data) => {
        setGameOver(data.winner);
    });
    
    socket.on('error_message', (message) => {
        alert(message);
    });

    return () => {
      socket.off('room_created');
      socket.off('room_updated');
      socket.off('game_started');
      socket.off('update_game_state');
      socket.off('game_over');
      socket.off('error_message');
    }
  }, []);
  
  const handleMaxPlayersChange = (e) => {
    const newSize = parseInt(e.target.value);
    setMaxPlayers(newSize);
    if (numBots >= newSize) {
      setNumBots(newSize - 1);
    }
  };

  const handleNumBotsChange = (e) => {
    setNumBots(parseInt(e.target.value));
  };

  const handleCreateRoom = () => {
    socket.emit('create_room', { maxPlayers: maxPlayers, bots: numBots });
  };
  
  // --- ส่วนแสดงผล ---

  if (gameOver) {
    return (
        <div className="App">
            <h1>Game Over!</h1>
            <h2>Winner is: {gameOver}</h2>
            <button className="create-button" onClick={() => window.location.reload()}>Play Again</button>
        </div>
    );
  }

  if (gameState) {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <Game 
                    gameState={gameState} 
                    myId={socket.id} 
                    socket={socket}
                />
            </div>
        </DndProvider>
    )
  }

  if (room) {
    const addBot = () => {
        if (room) {
          socket.emit('add_bot', { roomId: room.id });
        }
      }

    return (
      <div className="App">
        <h1>Room ID: {room.id}</h1>
        <h2>Waiting for players... ({room.players.length + room.bots}/{room.maxPlayers})</h2>
        <h3>Players:</h3>
        <ul>
          {room.players.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
        <h3>Bots: {room.bots}</h3>
        
        {(room.players.length + room.bots < room.maxPlayers) && (
           <button onClick={addBot} className="create-button">Add Bot</button>
        )}
        <p>Waiting for the game to start...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Welcome to Sleepy Card Game!</h1>
      <div className="create-room-form">
        <h2>Create a Room</h2>
        
        <div className="form-group">
          <label htmlFor="room-size">Room Size (Total Players): </label>
          <select id="room-size" value={maxPlayers} onChange={handleMaxPlayersChange}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bot-count">Number of Bots: </label>
          <select id="bot-count" value={numBots} onChange={handleNumBotsChange}>
            {Array.from({ length: maxPlayers }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        
        <button onClick={handleCreateRoom} className="create-button">
          Create Room
        </button>
      </div>
    </div>
  );
}

export default App;