// client/src/components/Home.jsx

import React from 'react';
import '../styles/Home.css';

const Home = ({ onStartGame, onJoinGame }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">Sleepy Game</h1>
      <div className="home-menu">
        <button onClick={onStartGame} className="menu-button">
          Start Game
        </button>
        <button onClick={onJoinGame} className="menu-button">
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Home;
