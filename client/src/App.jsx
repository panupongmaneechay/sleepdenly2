// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import JoinGame from './components/JoinGame';
import LanguageSwitcher from './components/LanguageSwitcher';

const socket = io("http://localhost:3001");

function App() {
  const [view, setView] = useState('home');
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [numBots, setNumBots] = useState(0);
  const [language, setLanguage] = useState('en'); // State สำหรับภาษา

  useEffect(() => {
    socket.on('room_created', (roomData) => {
      console.log('Room created successfully:', roomData);
      setRoom(roomData);
      setView('waiting');
    });

    socket.on('room_joined', (roomData) => {
        console.log('Joined room successfully:', roomData);
        setRoom(roomData);
        setView('waiting');
    });

    socket.on('room_updated', (roomData) => {
      console.log('Room has been updated:', roomData);
      setRoom(roomData);
    });

    socket.on('game_started', (initialGameState) => {
      console.log('Game Started!', initialGameState);
      setGameState(initialGameState);
      setRoom(null);
      setView('game');
    });

    socket.on('update_game_state', (newGameState) => {
      setGameState(currentState => {
        if (newGameState.turnVersion > (currentState?.turnVersion ?? -1)) {
          return newGameState;
        }
        return currentState;
      });
    });

    socket.on('game_over', (data) => {
        setGameOver(data.winner);
    });

    socket.on('error_message', (message) => {
        alert(message);
        setView('home');
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
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

  const handleJoinRoom = (roomId) => {
    socket.emit('join_room', { roomId });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const renderContent = () => {
    if (gameOver) {
      return (
          <>
              <h1>Game Over!</h1>
              <h2>Winner is: {gameOver}</h2>
              <button className="create-button" onClick={() => window.location.reload()}>Play Again</button>
          </>
      );
    }

    switch (view) {
      case 'home':
        return <Home onStartGame={() => setView('create')} onJoinGame={() => setView('join')} />;
      case 'join':
        return <JoinGame onJoin={handleJoinRoom} onBack={() => setView('home')} />;
      case 'create':
        return (
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
               <button onClick={() => setView('home')} className="back-button" style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>Back</button>
            </div>
        );
      case 'waiting':
        if (!room) return null;
        const addBot = () => {
            if (room) {
              socket.emit('add_bot', { roomId: room.id });
            }
          }
        return (
          <>
            <h1>Room ID: {room.id}</h1>
            <h2>Waiting for players... ({room.players.length + room.bots}/{room.maxPlayers})</h2>
            <h3>Players:</h3>
            <ul>
              {room.players.map(p => <li key={p.id}>{p.name} ({(p.id === socket.id) ? 'You' : ''})</li>)}
            </ul>
            <h3>Bots: {room.bots}</h3>
            {(room.players[0].id === socket.id && room.players.length + room.bots < room.maxPlayers) && (
               <button onClick={addBot} className="create-button">Add Bot</button>
            )}
            <p>Waiting for the game to start...</p>
          </>
        );
      case 'game':
        if (!gameState) return null;
        return (
          <DndProvider backend={HTML5Backend}>
            <Game 
                gameState={gameState} 
                myId={socket.id} 
                socket={socket} 
                language={language} 
            />
          </DndProvider>
        );
      default:
        return <Home onStartGame={() => setView('create')} onJoinGame={() => setView('join')} />;
    }
  };
  
  return (
    <div className={view === 'game' ? 'App app-game-background' : 'App'}>
      <LanguageSwitcher currentLang={language} onLangChange={handleLanguageChange} />
      {renderContent()}
    </div>
  );
}

export default App;
