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
    //ADD
    { name: 'no_daytime_naps', description: '+5 hour of sleep', type: 'add', value: 5, rarity: 'common' },
    { name: 'avoid_heavymeals', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common' },
    { name: 'work_life_balance', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common' },
    { 
      name: 'drink_alcohol', 
      description: '+2 hour of sleep (for 18 years old)', 
      type: 'add', 
      value: 2,
      rarity: 'common',
      condition: { age: 18 }
    },
    //SUBTRACT
    { name: 'depression', description: 'disturbs sleep. -5 hour', type: 'subtract', value: 5, rarity: 'common' },
    
    //SPECIAL
    { name: 'thief', description: 'Steal all cards from another player.', type: 'special_steal', rarity: 'rare' },
    { name: 'lucky', description: 'Instantly puts a character to sleep.', type: 'instant_sleep', rarity: 'rare' }, 
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
                copies = 20;
                break;
            case 'uncommon':
                copies = 10;
                break;
            case 'rare':
                copies = 50;
                break;
        }
        for (let i = 0; i < copies; i++) {
            deck.push({ ...card, id: `${card.name}_${i}` });
        }
    });
    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };
