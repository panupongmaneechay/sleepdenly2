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
import GameOverSummary from './components/GameOverSummary';
import GameLogo from './components/GameLogo';
import HowToPlay from './components/HowToPlay';
import AvatarSelection from './components/AvatarSelection';

const socket = io("http://localhost:3001");
// const socket = io("http://10.30.16.104:3001"); 

// [เพิ่ม] ชุดข้อความสำหรับแปลภาษาในหน้าสร้างห้อง
const translations = {
  en: {
    createTitle: 'Create a Room',
    roomSize: 'Room Size:',
    numBots: 'Number of Bots:',
    createButton: 'Create Room',
    backButton: 'Back'
  },
  th: {
    createTitle: 'สร้างห้อง',
    roomSize: 'ขนาดห้อง:',
    numBots: 'จำนวนบอท:',
    createButton: 'สร้างห้อง',
    backButton: 'ย้อนกลับ'
  },
  jp: {
    createTitle: 'ルームを作成',
    roomSize: 'ルームサイズ:',
    numBots: 'ボット数:',
    createButton: 'ルーム作成',
    backButton: '戻る'
  }
};

function App() {
  const [view, setView] = useState('home');
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [numBots, setNumBots] = useState(0);
  const [language, setLanguage] = useState('en');
  const [myAvatar, setMyAvatar] = useState('/src/assets/avatar/Avatar_01.png');
  
  useEffect(() => {
    socket.on('room_created', (roomData) => {
      setRoom(roomData);
      setView('waiting');
    });

    socket.on('room_joined', (roomData) => {
        setRoom(roomData);
        setView('waiting');
    });

    socket.on('room_updated', (roomData) => {
      setRoom(roomData);
    });

    socket.on('game_started', (initialGameState) => {
      setGameState(initialGameState);
      setRoom(null);
      setView('game');
    });

    socket.on('update_game_state', (newGameState) => {
      setGameState(currentState => {
        if (!currentState || newGameState.turnVersion > currentState.turnVersion) {
          return newGameState;
        }
        return currentState;
      });
    });

    socket.on('game_over', (data) => {
        setSummaryData(data);
        setView('summary');
    });

    socket.on('error_message', (message) => {
        alert(message);
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

  const handleCreateRoom = () => {
    socket.emit('create_room', { maxPlayers, bots: numBots, avatar: myAvatar });
  };

  const handleJoinRoom = (roomId) => {
    socket.emit('join_room', { roomId, avatar: myAvatar });
  };

  const handleHome = () => {
    setView('home');
  };

  const handleShowHowToPlay = () => {
    setView('howToPlay');
  };
  
  const handleShowAvatarSelection = () => {
    setView('avatar');
  };

  const handleSelectAvatar = (avatarPath) => {
    setMyAvatar(avatarPath);
    setView('home');
  };
  
  const getAppClassName = () => {
    if (view === 'game' || view === 'summary') {
      return 'App app-game-background';
    }
    if (['home', 'create', 'join', 'waiting', 'howToPlay', 'avatar'].includes(view)) {
      return 'App app-home-background';
    }
    return 'App';
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <Home 
          onStartGame={() => setView('create')} 
          onJoinGame={() => setView('join')} 
          onShowHowToPlay={handleShowHowToPlay} 
          onShowAvatarSelection={handleShowAvatarSelection}
          language={language} 
          myAvatar={myAvatar}
        />;
      case 'howToPlay':
        return <HowToPlay language={language} onBack={handleHome} />;
      case 'avatar':
        return <AvatarSelection onSelectAvatar={handleSelectAvatar} onBack={handleHome} myAvatar={myAvatar} />;
      case 'join':
        return <JoinGame onJoin={handleJoinRoom} onBack={handleHome} />;
      case 'create':
        // [แก้ไข] ดึงชุดข้อความที่ถูกต้องตามภาษาที่เลือก
        const t = translations[language] || translations.en;
        return (
            <div className="create-room-form">
              {/* [แก้ไข] เปลี่ยนข้อความ Hardcode เป็นตัวแปร */}
              <h2>{t.createTitle}</h2>
              <div className="form-group">
                <label htmlFor="room-size">{t.roomSize}</label>
                <select id="room-size" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bot-count">{t.numBots}</label>
                <select id="bot-count" value={numBots} onChange={(e) => setNumBots(parseInt(e.target.value))}>
                  {Array.from({ length: maxPlayers }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleCreateRoom} className="create-button">{t.createButton}</button>
              <button onClick={() => setView('home')} className="back-button" style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>{t.backButton}</button>
            </div>
        );
      case 'waiting':
        if (!room) return null;
        return (
          <div className="waiting-room">
            <h1>Room ID: {room.id}</h1>
            <h2>Waiting for players... ({room.players.length + room.bots}/{room.maxPlayers})</h2>
            <h3>Players:</h3>
            <ul>
              {room.players.map(p => <li key={p.id}>{p.name} ({(p.id === socket.id) ? 'You' : ''})</li>)}
            </ul>
            <h3>Bots: {room.bots}</h3>
            {(room.players[0].id === socket.id && room.players.length + room.bots < room.maxPlayers) && (
               <button onClick={() => socket.emit('add_bot', { roomId: room.id })} className="create-button">Add Bot</button>
            )}
          </div>
        );
      case 'game':
        if (!gameState) return null;
        return (
          <DndProvider backend={HTML5Backend}>
            <Game gameState={gameState} myId={socket.id} socket={socket} language={language} />
          </DndProvider>
        );
      case 'summary':
        if (!summaryData) return null;
        return <GameOverSummary summaryData={summaryData} language={language} />;
      default:
        return <Home onStartGame={() => setView('create')} onJoinGame={() => setView('join')} onShowHowToPlay={handleShowHowToPlay} onShowAvatarSelection={handleShowAvatarSelection} language={language} myAvatar={myAvatar} />;
    }
  };
  
  return (
    <div className={getAppClassName()}>
      {['home', 'create', 'join', 'waiting', 'howToPlay', 'avatar'].includes(view) && <GameLogo language={language} />}
      {view !== 'summary' && <LanguageSwitcher currentLang={language} onLangChange={setLanguage} />}
      {renderContent()}
    </div>
  );
}

export default App;