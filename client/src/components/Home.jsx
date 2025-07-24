// client/src/components/Home.jsx

import React from 'react';
import '../styles/Home.css'; // <-- เพิ่มบรรทัดนี้

const Home = ({ onStartGame, onJoinGame }) => {
  return (
    <div className="App">
      <h1>Welcome to Sleepy Card Game!</h1>
      <div className="home-menu">
        <button onClick={onStartGame} className="menu-button">
          Start Game
        </button>
        <button onClick={onJoinGame} className="menu-button">
          Join Game
        </button>
      </div>
      {/* <style jsx>...</style> ถูกลบออกไปแล้ว */}
    </div>
  );
};

export default Home;