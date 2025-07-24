// client/src/components/LanguageSwitcher.jsx

import React from 'react';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = ({ currentLang, onLangChange }) => {
  const languages = ['EN', 'TH', 'JP'];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang}
          className={`lang-button ${currentLang === lang.toLowerCase() ? 'active' : ''}`}
          onClick={() => onLangChange(lang.toLowerCase())}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;