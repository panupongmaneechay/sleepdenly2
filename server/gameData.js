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
    { name: 'no_daytime_naps', description: '+5 hour of sleep', type: 'add', value: 5, rarity: 'common', key: 'no_daytime_naps' },
    { name: 'avoid_heavymeals', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common', key: 'avoid_heavymeals' },
    { name: 'work_life_balance', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common', key: 'work_life_balance' },
    { name: 'go_to_bed', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common', key: 'go_to_bed' },
    { name: 'free_from_noise', description: '+4 hour of sleep', type: 'add', value: 4, rarity: 'common', key: 'free_from_noise' },
    { name: 'avoid_caffeine', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'avoid_caffeine' },
    { name: 'stop_using_phone', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'stop_using_phone' },
    { name: 'free_from_odor_pollution', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'free_from_odor_pollution' },
    { name: 'exercise', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'exercise' },
    { name: 'lights_off', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'lights_off' },
    { name: 'bedroom_dark', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'bedroom_dark' },
    { name: 'meditate', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common', key: 'meditate' },
    { name: 'cool_room', description: '+3 hour of sleep', type: 'add', value: 3, rarity: 'common', key: 'cool_room' },
    { name: 'drink_chamomile', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common', key: 'drink_chamomile' },
    { name: 'good_income', description: '+2 hour of sleep (for 15 years old)', type: 'add', value: 2,rarity: 'common',condition: { age: 15 }, key: 'good_income'},
    { name: 'drink_alcohol', description: '+2 hour of sleep (for 18 years old)', type: 'add', value: 2,rarity: 'common',condition: { age: 18 }, key: 'drink_alcohol'},
    { name: 'listen_music', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common', key: 'listen_music' },
    { name: 'eye_patch', description: '+2 hour of sleep', type: 'add', value: 2, rarity: 'common', key: 'eye_patch' },
    { name: 'drink_warm_milk', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common', key: 'drink_warm_milk' },
    { name: 'eat_banana', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common', key: 'eat_banana' },
    { name: 'massage_anmian', description: '+1 hour of sleep', type: 'add', value: 1, rarity: 'common', key: 'massage_anmian' },
    //SUBTRACT
    { name: 'depression', description: 'disturbs sleep. -5 hour', type: 'subtract', value: 5, rarity: 'common', key: 'depression' },
    { name: 'sleeping_pills', description: 'disturbs sleep. -4 hour', type: 'subtract', value: 4, rarity: 'common', key: 'sleeping_pills' },
    { name: 'stressed', description: 'disturbs sleep. -4 hour', type: 'subtract', value: 4, rarity: 'common', key: 'stressed' },
    { name: 'loud_noise', description: 'disturbs sleep. -3 hour', type: 'subtract', value: 3, rarity: 'common', key: 'loud_noise' },
    { name: 'drink_caffeine', description: 'disturbs sleep. -3 hour', type: 'subtract', value: 3, rarity: 'common', key: 'drink_caffeine' },
    { name: 'smoke', description: 'disturbs sleep. -2 hour(for 18 years old)', type: 'subtract', value: 2,rarity: 'common',condition: { age: 18 }, key: 'smoke'},
    { name: 'stomachache', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'stomachache' },
    { name: 'play_phone', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'play_phone' },
    { name: 'cold', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'cold' },
    { name: 'light_bedroom', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'light_bedroom' },
    { name: 'heavy_meal', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'heavy_meal' },
    { name: 'sick', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'sick' },
    { name: 'hot_weather', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'hot_weather' },
    { name: 'acid_reflux', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'acid_reflux' },
    { name: 'not_exercising', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'not_exercising' },
    { name: 'stay_up_late', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'stay_up_late' },
    { name: 'snoring', description: 'disturbs sleep. -2 hour', type: 'subtract', value: 2, rarity: 'common', key: 'snoring' },
    { name: 'socialize_well', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'socialize_well' },
    { name: 'cough', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'cough' },
    { name: 'get_odor_pollution', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'get_odor_pollution' },
    { name: 'nightmare', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'nightmare' },
    { name: 'drink_water_before_bed', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'drink_water_before_bed' },
    { name: 'eat_and_sleep', description: 'disturbs sleep. -1 hour', type: 'subtract', value: 1, rarity: 'common', key: 'eat_and_sleep' },
    //SPECIAL
    { name: 'thief', description: 'Steal all cards from another player.', type: 'special_steal', rarity: 'rare', key: 'thief' },
    { name: 'swap_card', description: 'Swap your hand with another player.', type: 'special_swap', rarity: 'rare', key: 'swap_card' }, 
    { name: 'prevent', description: 'Prevent an action against you.', type: 'reaction_prevent', rarity: 'uncommon', key: 'prevent' },
    { name: 'break_down_defenses', description: 'Break a \'prevent\' card.', type: 'reaction_counter', rarity: 'uncommon', key: 'break_down_defenses' },
    { name: 'lucky', description: 'Instantly puts a character to sleep.', type: 'instant_sleep', rarity: 'rare', key: 'lucky' }, 
];

const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
};

// [แก้ไข] ฟังก์ชันสร้าง Deck ใหม่ตามอัตราส่วนที่กำหนด
const createDeckFromRarity = () => {
    const deck = [];
    const totalDeckSize = 100; // สร้าง Deck ขนาด 100 ใบ

    const cardTypes = {
        add: actionCards.filter(c => c.type === 'add'),
        subtract: actionCards.filter(c => c.type === 'subtract'),
        special_steal: actionCards.filter(c => c.type === 'special_steal'),
        special_swap: actionCards.filter(c => c.type === 'special_swap'),
        reaction_prevent: actionCards.filter(c => c.type === 'reaction_prevent'),
        reaction_counter: actionCards.filter(c => c.type === 'reaction_counter'),
        instant_sleep: actionCards.filter(c => c.type === 'instant_sleep')
    };

    // กำหนดจำนวนการ์ดแต่ละประเภทใน Deck 100 ใบ (ปรับตัวเลขให้ใกล้เคียงที่สุด)
    const cardCounts = {
        add: 41,                 // ~80% weight
        subtract: 36,            // ~70% weight
        reaction_prevent: 6,     // ~15% weight
        special_swap: 5,         // ~10% weight
        reaction_counter: 4,     // ~8% weight
        special_steal: 2,        // ~5% weight
        instant_sleep: 3         // ~5% weight
    };
    // Total = 100 cards

    let cardIdCounter = 0;
    for (const type in cardTypes) {
        const cardsOfType = cardTypes[type];
        if (cardsOfType.length === 0) continue;

        const totalCopies = cardCounts[type];
        
        // เพิ่มการ์ดแต่ละใบในประเภทนั้นๆ วนไปเรื่อยๆ จนครบจำนวนที่กำหนด
        for (let i = 0; i < totalCopies; i++) {
            const cardTemplate = cardsOfType[i % cardsOfType.length];
            deck.push({ ...cardTemplate, id: `${cardTemplate.name}_${cardIdCounter++}` });
        }
    }

    return deck;
};

module.exports = { characterCards, actionCards, shuffleDeck, createDeckFromRarity };