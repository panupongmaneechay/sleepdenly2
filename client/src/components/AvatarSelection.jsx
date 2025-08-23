// client/src/components/AvatarSelection.jsx

import React from 'react';
import '../styles/AvatarSelection.css';

const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, as: 'url' });

const AvatarSelection = ({ onSelectAvatar, onBack, myAvatar }) => {
    const avatars = Object.values(avatarImages);

    return (
        <div className="avatar-selection-container">
            <h2>Select Your Avatar</h2>
            <div className="avatar-grid">
                {avatars.map((avatar, index) => (
                    <img 
                        key={index}
                        src={avatar} 
                        alt={`Avatar ${index + 1}`} 
                        className={`avatar-image ${myAvatar === avatar ? 'selected' : ''}`}
                        onClick={() => onSelectAvatar(avatar)}
                    />
                ))}
            </div>
            <button onClick={onBack} className="back-button">Back</button>
        </div>
    );
};

export default AvatarSelection;