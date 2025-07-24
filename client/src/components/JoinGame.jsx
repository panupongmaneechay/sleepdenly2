// client/src/components/JoinGame.jsx

import React, { useState } from 'react';

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
      <style jsx>{`
        .join-game-form {
          display: inline-block;
          padding: 2rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .room-id-input {
          padding: 10px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
          width: 250px;
          margin-bottom: 1rem;
        }
        .back-button {
            margin-top: 1rem;
            margin-left: 10px;
            background-color: #6c757d;
        }
        .back-button:hover {
            background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default JoinGame;