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
    changeAvatar: 'Change Avatar',
    creators: 'Creators',
    creatorNames: [
        "Manatee Jitanan",
        "Kitsana Waiyamai",
        "Panupong Maneechay",
        "Pornchan Lojanasupareuk",
        "Thananun Thanarachataphoom"
    ]
  },
  th: {
    title: 'Sleep Denly',
    start: 'เริ่มเกมส์',
    join: 'เข้าร่วมเกมส์',
    howToPlay: 'วิธีเล่น',
    changeAvatar: 'เปลี่ยนอวตาร',
    creators: 'ผู้พัฒนา',
    creatorNames: [
        "Manatee Jitanan",
        "Kitsana Waiyamai",
        "Panupong Maneechay",
        "Pornchan Lojanasupareuk",
        "Thananun Thanarachataphoom"
    ]
  },
  jp: {
    title: 'Sleep Denly',
    start: 'ゲーム開始',
    join: 'ゲームに参加',
    howToPlay: '遊び方',
    changeAvatar: 'アバターを変更',
    creators: '開発者',
    creatorNames: [
        "Manatee Jitanan",
        "Kitsana Waiyamai",
        "Panupong Maneechay",
        "Pornchan Lojanasupareuk",
        "Thananun Thanarachataphoom"
    ]
  }
};

const Home = ({ onStartGame, onJoinGame, onShowHowToPlay, onShowAvatarSelection, language, myAvatar }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="home-container">
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
      {/* [แก้ไข] ส่วนแสดงชื่อผู้พัฒนาเป็นกรอบสี่เหลี่ยม */}
      <div className="creators-box">
        <h4 className="creators-title">{t.creators}</h4>
        <ul>
            {t.creatorNames.map((name, index) => (
                <li key={index}>{name}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;