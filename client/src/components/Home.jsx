// client/src/components/Home.jsx

import React from 'react';
import '../styles/Home.css';
import '../styles/AvatarSelection.css';

const translations = {
  en: {
    title: 'Sleep Denly',
    start: 'Start Game',
    join: 'Join Game',
    howToPlay: 'How to Play',
    changeAvatar: 'Change Avatar'
  },
  th: {
    title: 'Sleep Denly',
    start: 'เริ่มเกมส์',
    join: 'เข้าร่วมเกมส์',
    howToPlay: 'วิธีเล่น',
    changeAvatar: 'เปลี่ยนอวตาร'
  },
  jp: {
    title: 'Sleep Denly',
    start: 'ゲーム開始',
    join: 'ゲームに参加',
    howToPlay: '遊び方',
    changeAvatar: 'アバターを変更'
  }
};

const Home = ({ onStartGame, onJoinGame, onShowHowToPlay, onShowAvatarSelection, language, myAvatar }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="home-container">
      {/* [แก้ไข] ย้ายส่วนแสดง Avatar มาอยู่นอกเมนู และไม่มี onClick แล้ว */}
      <div className="avatar-preview-container">
        <img src={myAvatar} alt="My Avatar" className="avatar-preview-img" />
      </div>
      
      <h1 className="home-title">{t.title}</h1>
      <div className="home-menu">
        <button onClick={onStartGame} className="menu-button">
          {t.start}
        </button>
        <button onClick={onJoinGame} className="menu-button">
          {t.join}
        </button>
        <button onClick={onShowAvatarSelection} className="menu-button">
          {t.changeAvatar}
        </button>
        <button onClick={onShowHowToPlay} className="menu-button">
          {t.howToPlay}
        </button>
      </div>
    </div>
  );
};

export default Home;