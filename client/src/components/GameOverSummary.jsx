// client/src/components/GameOverSummary.jsx

import React from 'react';
import '../styles/GameOverSummary.css';

// โหลดรูปภาพทั้งหมดเข้ามา
const characterImages = {
  en: import.meta.glob('../assets/character_en/*.png', { eager: true }),
  th: import.meta.glob('../assets/character_th/*.png', { eager: true }),
  jp: import.meta.glob('../assets/character_jp/*.png', { eager: true }),
};

const getCharacterImage = (characterName, language) => {
    const images = characterImages[language] || characterImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${characterName}.png`));
    return imagePath ? images[imagePath].default : '';
};

const SummaryCard = ({ character, history, language }) => {
    const positiveCards = history.filter(
        action => action.targetCharacterName === character.name && action.card.type === 'add'
    );
    const negativeCards = history.filter(
        action => action.targetCharacterName === character.name && action.card.type === 'subtract'
    );

    return (
        <div className="summary-card">
            <div className="summary-character-image">
                 <img src={getCharacterImage(character.name, language)} alt={character.name} />
            </div>
            <h4>{character.name}</h4>
            <p className="final-score">Final Sleep: {character.currentSleep} / {character.sleepGoal} hours</p>
            
            <div className="card-lists">
                <div className="positive-list">
                    <h5>Good Sleep Factors:</h5>
                    <ul>
                        {positiveCards.length > 0 ? (
                            positiveCards.map((action, i) => <li key={i}>+{action.card.value} hr ({action.card.name})</li>)
                        ) : (
                            <li>None</li>
                        )}
                    </ul>
                </div>
                <div className="negative-list">
                    <h5>Bad Sleep Factors:</h5>
                    <ul>
                        {negativeCards.length > 0 ? (
                            negativeCards.map((action, i) => <li key={i}>-{action.card.value} hr ({action.card.name})</li>)
                        ) : (
                            <li>None</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};


const GameOverSummary = ({ summaryData, language }) => {
    const { winner, playHistory } = summaryData;

    // กรองเฉพาะ Action ที่มีเป้าหมายเป็นผู้ชนะ
    const winnerHistory = playHistory.filter(action => action.targetPlayerId === winner.id);
    
    // คำนวณเวลานอนทั้งหมด
    const totalSleepGoal = winner.characters.reduce((sum, char) => sum + char.sleepGoal, 0);
    const totalCurrentSleep = winner.characters.reduce((sum, char) => sum + char.currentSleep, 0);

    return (
        <div className="summary-backdrop">
            <div className="summary-container">
                <h1>Congratulations, {winner.name}!</h1>
                <p className="summary-subtitle">Here's your sleep summary:</p>
                
                <div className="summary-cards-container">
                    {winner.characters.map(char => (
                        <SummaryCard key={char.name} character={char} history={winnerHistory} language={language} />
                    ))}
                </div>

                <div className="total-summary">
                    <h3>Overall Sleep Score: {totalCurrentSleep} / {totalSleepGoal} hours</h3>
                </div>

                <button className="play-again-button" onClick={() => window.location.reload()}>
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverSummary;
