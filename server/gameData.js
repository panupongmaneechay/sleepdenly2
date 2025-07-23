// server/gameData.js

const characterCards = [
    { name: 'Brian', age: 13, sleepGoal: 9 },
    { name: 'Lee', age: 71, sleepGoal: 7 },
    { name: 'Jeejee', age: 17, sleepGoal: 9 },
    { name: 'Violet', age: 50, sleepGoal: 7 },
    { name: 'Joe', age: 55, sleepGoal: 7 },
    { name: 'Nena', age: 1, sleepGoal: 14 },
    { name: 'Gel', age: 4, sleepGoal: 12 },
    { name: 'Boy', age: 8, sleepGoal: 10 },
    { name: 'Rich', age: 3, sleepGoal: 13 },
    { name: 'Jerico', age: 36, sleepGoal: 7 },
];

const actionCards = [
    // Common Cards (พบบ่อย)
    { name: 'Warm Milk', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common' },
    { name: 'Bright Room', description: 'Light disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },

    // Uncommon Cards (ไม่พบบ่อย)
    { name: 'Sleeping Pills', description: '+2 hours of sleep', type: 'add', value: 2, rarity: 'uncommon' },
    { name: 'Stay up late', description: 'Busy night. -2 hours', type: 'subtract', value: 2, rarity: 'uncommon' },
    
    // Rare Cards (หายาก)
    { name: 'Lullaby', description: '+3 hours of sleep', type: 'add', value: 3, rarity: 'rare' },
    { name: 'Depressed', description: 'A heavy mind. -3 hours', type: 'subtract', value: 3, rarity: 'rare' },
];

const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
}

// ฟังก์ชันใหม่: สร้างกองไพ่ตาม Rarity
const createDeckFromRarity = () => {
    const deck = [];
    actionCards.forEach(card => {
        let copies = 0;
        switch (card.rarity) {
            case 'common':
                copies = 50; // การ์ดธรรมดา มี 50 ใบในกอง
                break;
            case 'uncommon':
                copies = 30; // การ์ดที่ไม่พบบ่อย มี 30 ใบ
                break;
            case 'rare':
                copies = 10; // การ์ดหายาก มีแค่ใบเดียว
                break;
        }
        for (let i = 0; i < copies; i++) {
            deck.push(card);
        }
    });
    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };