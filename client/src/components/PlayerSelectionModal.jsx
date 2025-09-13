// client/src/components/PlayerSelectionModal.jsx

import React from 'react';
import '../styles/PlayerSelectionModal.css';

const PlayerSelectionModal = ({ players, onSelectPlayer, onCancel, title, cancelText }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title || "Select a Player"}</h2>
        <div className="player-list">
          {players.map(player => (
            <button 
              key={player.id} 
              className="player-select-button"
              onClick={() => onSelectPlayer(player.id)}
            >
              {player.name}
            </button>
          ))}
        </div>
        {/* [แก้ไข] เปลี่ยนข้อความ Hardcode เป็น prop */}
        <button className="cancel-button" onClick={onCancel}>{cancelText || 'Cancel'}</button>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;