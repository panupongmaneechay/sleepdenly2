// server/gameData.js

const characterCards = [
    { name: 'Oraphan', age: 0, sleepGoal: 12 },
    { name: 'Don', age: 1, sleepGoal: 12 },
    { name: 'Miguel', age: 1, sleepGoal: 11 },
    { name: 'Anthony', age: 3, sleepGoal: 10 },
    { name: 'Hana', age: 4, sleepGoal: 10 },
    { name: 'Richie', age: 4, sleepGoal: 12 },
    { name: 'Bay', age: 6, sleepGoal: 9 },
    { name: 'Martin', age: 8, sleepGoal: 9 },
    { name: 'Miwa', age: 10, sleepGoal: 9 },
    { name: 'RidChan', age: 11, sleepGoal: 9 },
    { name: 'Austin', age: 14, sleepGoal: 10 },
    { name: 'Hero', age: 15, sleepGoal: 8 }
    ];

const actionCards = [
    // Common Cards
    { name: 'Warm Milk', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common' },
    { name: 'Bright Room', description: 'Light disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },

    // Uncommon Cards
    { name: 'Sleeping Pills', description: '+2 hours of sleep', type: 'add', value: 2, rarity: 'uncommon' },
    { name: 'Stay up late', description: 'Busy night. -2 hours', type: 'subtract', value: 2, rarity: 'uncommon' },
    
    // Rare Cards
    { name: 'Lullaby', description: '+3 hours of sleep', type: 'add', value: 3, rarity: 'rare' },
    { name: 'Depressed', description: 'A heavy mind. -3 hours', type: 'subtract', value: 3, rarity: 'rare' },
    { name: 'Lucky', description: 'Instantly puts a character to sleep.', type: 'instant_sleep', rarity: 'rare' }, // **<-- การ์ดใหม่**
];

const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
}

const createDeckFromRarity = () => {
    const deck = [];
    actionCards.forEach(card => {
        let copies = 0;
        switch (card.rarity) {
            case 'common':
                copies = 50;
                break;
            case 'uncommon':
                copies = 30;
                break;
            case 'rare':
                copies = 10;
                break;
        }
        for (let i = 0; i < copies; i++) {
            deck.push(card);
        }
    });
    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };