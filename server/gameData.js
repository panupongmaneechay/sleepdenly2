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
    { name: 'go_to_bed', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common' },
    { name: 'free_from_noise', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common' },
    { name: 'avoid_caffeine', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'stop_using_phone', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'free_from_odor_pollution', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'exercise', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'lights_off', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'bedroom_dark', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'meditate', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common' },
    { name: 'cool_room', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common' },
    { name: 'drink_chamomile', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common' },
    { name: 'good_income', description: '+2 hour of sleep (for 15 years old)', type: 'add', value: 2,rarity: 'common',condition: { age: 15 }},
    { name: 'drink_alcohol', description: '+2 hour of sleep (for 18 years old)', type: 'add', value: 2,rarity: 'common',condition: { age: 18 }},
    { name: 'listen_music', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common' },
    { name: 'eye_patch', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common' },
    { name: 'drink_warm_milk', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common' },
    { name: 'eat_banana', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common' },
    { name: 'massage_anmian', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common' },
    //SUBTRACT
    { name: 'depression', description: 'disturbs sleep. -5 hour', type: 'subtract', value: 5, rarity: 'common' },
    { name: 'sleeping_pills', description: 'disturbs sleep. -4 hour', type: 'subtract', value: 4, rarity: 'common' },
    //SPECIAL
    { name: 'thief', description: 'Steal all cards from another player.', type: 'special_steal', rarity: 'rare' },
    { name: 'swap_card', description: 'Swap your hand with another player.', type: 'special_swap', rarity: 'rare' }, 
    { name: 'prevent', description: 'Prevent an action against you.', type: 'reaction_prevent', rarity: 'rare' },
    { name: 'break_down_defenses', description: 'Break a \'prevent\' card.', type: 'reaction_counter', rarity: 'rare' },
    { name: 'Lucky', description: 'Instantly puts a character to sleep.', type: 'instant_sleep', rarity: 'rare' }, 
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
                copies = 15;
                break;
        }
        for (let i = 0; i < copies; i++) {
            deck.push({ ...card, id: `${card.name}_${i}` });
        }
    });
    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };
