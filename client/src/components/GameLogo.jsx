// client/src/components/GameLogo.jsx

import React from 'react';
import '../styles/GameLogo.css';

const GameLogo = ({ language }) => {
    // เลือกไฟล์โลโก้ตามภาษาที่ถูกส่งมา
    const logoSrc = language === 'th' ? '/logo_thai.jpeg' : '/logo_eng.jpeg';

    return (
        <div className="game-logo-container">
            <img src={logoSrc} alt="Sleep Denly Game Logo" className="game-logo" />
        </div>
    );
};

export default GameLogo;
