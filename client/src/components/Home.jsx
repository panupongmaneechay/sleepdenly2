// client/src/components/Home.jsx

import React from 'react';
import '../styles/Home.css';

const translations = {
  en: {
    title: 'Sleep Denly',
    start: 'Start Game',
    join: 'Join Game',
    howToPlay: 'How to Play'
  },
  th: {
    title: 'Sleep Denly',
    start: 'เริ่มเกมส์',
    join: 'เข้าร่วมเกมส์',
    howToPlay: 'วิธีเล่น'
  },
  jp: {
    title: 'Sleep Denly',
    start: 'ゲーム開始',
    join: 'ゲームに参加',
    howToPlay: '遊び方'
  }
};

const Home = ({ onStartGame, onJoinGame, onShowHowToPlay, language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="home-container">
      <h1 className="home-title">{t.title}</h1>
      <div className="home-menu">
        <button onClick={onStartGame} className="menu-button">
          {t.start}
        </button>
        <button onClick={onJoinGame} className="menu-button">
          {t.join}
        </button>
        <button onClick={onShowHowToPlay} className="menu-button">
          {t.howToPlay}
        </button>
      </div>
    </div>
  );
};

export default Home;