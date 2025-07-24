// client/src/components/JoinGame.jsx

import React, { useState } from 'react';
import '../styles/JoinGame.css'; // <-- เพิ่มบรรทัดนี้

const JoinGame = ({ onJoin, onBack }) => {
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId.trim());
    } else {
      alert('Please enter a Room ID.');
    }
  };

  return (
    <div className="App">
      <div className="join-game-form">
        <h2>Join a Room</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="room-id-input"
          />
        </div>
        <button onClick={handleJoin} className="create-button">
          Join
        </button>
        <button onClick={onBack} className="back-button">
          Back
        </button>
      </div>
      {/* <style jsx>...</style> ถูกลบออกไปแล้ว */}
    </div>
  );
};

export default JoinGame;