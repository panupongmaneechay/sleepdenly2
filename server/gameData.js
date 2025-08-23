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
    { name: 'Hero', age: 15, sleepGoal: 8 },
    { name: 'Brian', age: 16, sleepGoal: 8 },
    { name: 'Benz', age: 16, sleepGoal: 10 },
    { name: 'Rosie', age: 17, sleepGoal: 10 },
    { name: 'Yuka', age: 19, sleepGoal: 8 },
    { name: 'Gohan', age: 19, sleepGoal: 8 },
    { name: 'Gigi', age: 22, sleepGoal: 9 },
    { name: 'Luna', age: 24, sleepGoal: 7 },
    { name: 'Chris', age: 34, sleepGoal: 7 },
    { name: 'Jerico', age: 35, sleepGoal: 8 },
    { name: 'Fina', age: 48, sleepGoal: 8 },
    { name: 'Peter', age: 19, sleepGoal: 9 },
    { name: 'Shereen', age: 63, sleepGoal: 7 },
    { name: 'Lee', age: 64, sleepGoal: 7 },
    { name: 'William', age: 72, sleepGoal: 8 },
    { name: 'Violette', age: 74, sleepGoal: 7 },
    { name: 'Wendy', age: 77, sleepGoal: 8 },
    { name: 'Kate', age: 84, sleepGoal: 8 }
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
    { name: 'stressed', description: 'disturbs sleep. -4 hour', type: 'subtract', value: 4, rarity: 'common' },
    { name: 'loud_noise', description: 'disturbs sleep. -3 hour', type: 'subtract', value: 3, rarity: 'common' },
    { name: 'drink_caffeine', description: 'disturbs sleep. -3 hour', type: 'subtract', value: 3, rarity: 'common' },
    { name: 'smoke', description: 'disturbs sleep. -2 hour(for 18 years old)', type: 'subtract', value: 2,rarity: 'common',condition: { age: 18 }},
    { name: 'stomachache', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'play_phone', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'cold', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'light_bedroom', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'heavy_meal', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'sick', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'hot_weather', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'acid_reflux', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'not_exercising', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'stay_up_late', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'snoring', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common' },
    { name: 'socialize_well', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    { name: 'cough', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    { name: 'get_odor_pollution', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    { name: 'nightmare', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    { name: 'drink_water_before_bed', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    { name: 'eat_and_sleep', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common' },
    //SPECIAL
    { name: 'thief', description: 'Steal all cards from another player.', type: 'special_steal', rarity: 'rare' },
    { name: 'swap_card', description: 'Swap your hand with another player.', type: 'special_swap', rarity: 'rare' }, 
    { name: 'prevent', description: 'Prevent an action against you.', type: 'reaction_prevent', rarity: 'uncommon' },
    { name: 'break_down_defenses', description: 'Break a \'prevent\' card.', type: 'reaction_counter', rarity: 'uncommon' },
    { name: 'lucky', description: 'Instantly puts a character to sleep.', type: 'instant_sleep', rarity: 'rare' }, 
];

const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
};

const createDeckFromRarity = () => {
    const deck = [];
    const totalDeckSize = 100; // กำหนดขนาดกองการ์ดโดยประมาณ

    const cardsByRarity = {
        common: actionCards.filter(c => c.rarity === 'common'),
        uncommon: actionCards.filter(c => c.rarity === 'uncommon'),
        rare: actionCards.filter(c => c.rarity === 'rare')
    };

    const cardCounts = {
        common: Math.round(totalDeckSize * 0.85),
        uncommon: Math.round(totalDeckSize * 0.13),
        rare: Math.round(totalDeckSize * 0.07)
    };

    for (const rarity in cardsByRarity) {
        const specificCards = cardsByRarity[rarity];
        if (specificCards.length === 0) continue;

        const totalCopies = cardCounts[rarity];
        
        // เพิ่มการ์ดแต่ละใบใน rarity นั้นๆ เข้าไปในกองการ์ดวนไปเรื่อยๆ จนกว่าจะครบตามจำนวนที่คำนวณไว้
        for (let i = 0; i < totalCopies; i++) {
            const cardTemplate = specificCards[i % specificCards.length];
            deck.push({ ...cardTemplate, id: `${cardTemplate.name}_${i}` });
        }
    }

    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };