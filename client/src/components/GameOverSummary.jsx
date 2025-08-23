// client/src/components/GameOverSummary.jsx

import React from 'react';
import '../styles/GameOverSummary.css';

// โหลดรูปภาพทั้งหมดเข้ามา
const characterImages = {
  en: import.meta.glob('/src/assets/character_en/*.png', { eager: true }),
  th: import.meta.glob('/src/assets/character_th/*.png', { eager: true }),
  jp: import.meta.glob('/src/assets/character_jp/*.png', { eager: true }),
};
const avatarImages = import.meta.glob('/src/assets/avatar/*.png', { eager: true, as: 'url' });


// [แก้ไข] Object สำหรับการแปลข้อความ
const translations = {
  en: {
    congratulations: "Congratulations, ",
    summaryTitle: "Here's your sleep summary:",
    finalSleep: "Final Sleep:",
    hours: "hours",
    goodFactors: "Good Sleep Factors", // [แก้ไข]
    badFactors: "Bad Sleep Factors", // [แก้ไข]
    behavior: "Behavior", // [เพิ่ม]
    noOfHours: "No. of Hours", // [เพิ่ม]
    luckyHours: "Lucky Hours", // [เพิ่ม]
    none: "None",
    overallScore: "Overall Sleep Score:",
    playAgain: "Play Again",
    cardNames: {
        "no_daytime_naps": "No daytime naps",
        "avoid_heavymeals": "Avoid heavy meals before bedtime",
        "work_life_balance": "Work & life balance",
        "go_to_bed": "Go to bed on time",
        "free_from_noise": "Free from noise",
        "avoid_caffeine": "Avoid caffeine",
        "stop_using_phone": "Stop using phone before going to bed",
        "free_from_odor_pollution": "Free from odor pollution",
        "exercise": "Exercise",
        "lights_off": "Sleep with the lights off",
        "bedroom_dark": "The bedroom is completely dark",
        "meditate": "Meditate",
        "cool_room": "Cool room colors",
        "drink_chamomile": "Drink chamomile",
        "good_income": "Good income",
        "drink_alcohol": "Drink alcohol (short term)",
        "listen_music": "Listen to music to reduce stress",
        "eye_patch": "Use eye patch",
        "drink_warm_milk": "Drink warm milk before going to bed",
        "eat_banana": "Eat a banana before going to bed",
        "massage_anmian": "Massage AnMian acupoint",
        "depression": "Depression",
        "sleeping_pills": "Consuming sleeping pills",
        "stressed": "Stressed",
        "loud_noise": "Loud noise",
        "drink_caffeine": "Drink caffeine before going to bed",
        "smoke": "Smoke",
        "stomachache": "Stomach ache",
        "play_phone": "Play phone before going to bed",
        "cold": "Cold hands & feet",
        "light_bedroom": "Light on in a bedroom",
        "heavy_meal": "Eat a heavy meal before going to bed",
        "sick": "Sick",
        "hot_weather": "Hot weather",
        "acid_reflux": "Acid reflux",
        "not_exercising": "Not exercising",
        "stay_up_late": "Stay up late",
        "snoring": "Snoring",
        "socialize_well": "Socialize well",
        "cough": "Cough",
        "get_odor_pollution": "Get odor pollution",
        "nightmare": "Nightmare",
        "drink_water_before_bed": "Drink water before going to bed",
        "eat_and_sleep": "Eat and sleep",
        "lucky": "Lucky!"
    }
  },
  th: {
    congratulations: "ยินดีด้วย, ",
    summaryTitle: "นี่คือสรุปการนอนของคุณ:",
    finalSleep: "เวลานอนสุดท้าย:",
    hours: "ชั่วโมง",
    goodFactors: "ปัจจัยการนอนที่ดี",
    badFactors: "ปัจจัยการนอนที่ไม่ดี",
    behavior: "พฤติกรรม",
    noOfHours: "จำนวน (ชม.)",
    luckyHours: "Lucky Hours",
    none: "ไม่มี",
    overallScore: "คะแนนการนอนโดยรวม:",
    playAgain: "เล่นอีกครั้ง",
    cardNames: {
        "no_daytime_naps": "ไม่หลับกลางวัน",
        "avoid_heavymeals": "หลีกเลี่ยงมื้อหนักก่อนนอน",
        "work_life_balance": "งานกับชีวิตสมดุล",
        "go_to_bed": "นอนตรงเวลา",
        "free_from_noise": "ปราศจากเสียงรบกวน",
        "avoid_caffeine": "หลีกเลี่ยงคาเฟอีน",
        "stop_using_phone": "งดเล่นโทรศัพท์ก่อนนอน",
        "free_from_odor_pollution": "ปราศจากมลพิษทางกลิ่น",
        "exercise": "ออกกำลังกาย",
        "lights_off": "นอนปิดไฟ",
        "bedroom_dark": "ห้องนอนมืดสนิท",
        "meditate": "นั่งสมาธิ",
        "cool_room": "สีห้องเย็นตา",
        "drink_chamomile": "ดื่มคาโมมายล์",
        "good_income": "รายได้ดี",
        "drink_alcohol": "ดื่มแอลกอฮอล์ (ระยะสั้น)",
        "listen_music": "ฟังดนตรีลดความเครียด",
        "eye_patch": "ผ้าปิดตา",
        "drink_warm_milk": "ดื่มนมก่อนนอน",
        "eat_banana": "กินกล้วยก่อนนอน",
        "massage_anmian": "นวดจุดแอนเมียน",
        "depression": "ภาวะซึมเศร้า",
        "sleeping_pills": "กินยานอนหลับ",
        "stressed": "เครียด",
        "loud_noise": "เสียงดังรบกวน",
        "drink_caffeine": "ดื่มคาเฟอีนก่อนนอน",
        "smoke": "สูบบุหรี่",
        "stomachache": "ปวดท้อง",
        "play_phone": "เล่นโทรศัพท์ก่อนนอน",
        "cold": "อากาศหนาว",
        "light_bedroom": "ห้องนอนมีแสงสว่าง",
        "heavy_meal": "กินมื้อหนักก่อนนอน",
        "sick": "ป่วย",
        "hot_weather": "อากาศร้อน",
        "acid_reflux": "กรดไหลย้อน",
        "not_exercising": "ไม่ออกกำลังกาย",
        "stay_up_late": "นอนดึก",
        "snoring": "นอนกรน",
        "socialize_well": "เข้าสังคมดี",
        "cough": "ไอ",
        "get_odor_pollution": "มีมลพิษทางกลิ่น",
        "nightmare": "ฝันร้าย",
        "drink_water_before_bed": "ดื่มน้ำก่อนนอน",
        "eat_and_sleep": "กินแล้วนอน",
        "lucky": "โชคดี!"
    }
  },
  jp: {
    congratulations: "おめでとうございます, ",
    summaryTitle: "睡眠のまとめです:",
    finalSleep: "最終睡眠時間:",
    hours: "時間",
    goodFactors: "良い睡眠要因",
    badFactors: "悪い睡眠要因",
    behavior: "行動",
    noOfHours: "時間数",
    luckyHours: "ラッキーアワー",
    none: "なし",
    overallScore: "合計睡眠スコア:",
    playAgain: "もう一度プレイ",
    cardNames: {
        "no_daytime_naps": "昼寝は禁止",
        "avoid_heavymeals": "就寝前に重い食事を避ける",
        "work_life_balance": "仕事と生活のバランス",
        "go_to_bed": "時間通りに寝る",
        "free_from_noise": "ノイズなし",
        "avoid_caffeine": "カフェインを避ける",
        "stop_using_phone": "寝る前に携帯電話の使用をやめましょう",
        "free_from_odor_pollution": "悪臭汚染なし",
        "exercise": "エクササイズ",
        "lights_off": "電気を消して寝る",
        "bedroom_dark": "寝室は真っ暗だ",
        "meditate": "瞑想する",
        "cool_room": "クールな部屋の色",
        "drink_chamomile": "カモミールを飲む",
        "good_income": "良い収入",
        "drink_alcohol": "アルコールを飲む (短期)",
        "listen_music": "音楽を聴いてストレスを軽減する",
        "eye_patch": "アイパッチ",
        "drink_warm_milk": "寝る前に暖かい牛乳を飲む",
        "eat_banana": "寝る前にバナナを食べる",
        "massage_anmian": "マッサージアンミアンポイント",
        "depression": "うつ",
        "sleeping_pills": "睡眠薬の服用",
        "stressed": "ストレス",
        "loud_noise": "大きな音",
        "drink_caffeine": "寝る前にカフェインを飲む",
        "smoke": "タバコ",
        "stomachache": "腹痛",
        "play_phone": "寝る前に携帯で遊ぶ",
        "cold": "手足が冷たい",
        "light_bedroom": "寝室が明るい",
        "heavy_meal": "寝る前にしっかりとした食事をとる",
        "sick": "病気",
        "hot_weather": "暑い天気",
        "acid_reflux": "胃酸の逆流",
        "not_exercising": "運動をしない",
        "stay_up_late": "夜更かしする",
        "snoring": "いびき",
        "socialize_well": "社交を上手にに行う",
        "cough": "咳",
        "get_odor_pollution": "悪臭公害がある",
        "nightmare": "悪夢",
        "drink_water_before_bed": "寝る前に水を飲む",
        "eat_and_sleep": "食べて寝る",
        "lucky": "ラッキー！"
    }
  }
};


const getCharacterImage = (characterName, language) => {
    const images = characterImages[language] || characterImages['en'];
    const imagePath = Object.keys(images).find(path => path.includes(`/${characterName}.png`));
    return imagePath ? images[imagePath].default : '';
};

const getAvatarImage = (avatarPath) => {
    return avatarImages[avatarPath];
};

// [แก้ไข] สร้าง component ใหม่สำหรับตารางสรุป
const SummaryTables = ({ character, history, language }) => {
  const t = translations[language] || translations.en;
  
  const positiveCards = history.filter(
    action => action.targetCharacterName === character.name && action.card.type === 'add'
  );
  const negativeCards = history.filter(
    action => action.targetCharacterName === character.name && action.card.type === 'subtract'
  );
  const luckyCard = history.find(
    action => action.targetCharacterName === character.name && action.card.type === 'instant_sleep'
  );

  return (
    <div className="character-summary-tables">
        <div className="character-summary-header">
            <img src={getCharacterImage(character.name, language)} alt={character.name} className="character-image-small" />
            <h3>{character.name}</h3>
        </div>
        <div className="summary-tables-row">
            <div className="summary-table-container">
                <div className="table-header good">
                    <h3>{t.goodFactors}</h3>
                </div>
                <table className="summary-table">
                    <thead>
                    <tr>
                        <th>{t.behavior}</th>
                        <th>{t.noOfHours}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {luckyCard && (
                        <tr>
                            <td>{t.cardNames[luckyCard.card.name]}</td>
                            <td>{t.luckyHours}</td>
                        </tr>
                    )}
                    {positiveCards.length > 0 ? (
                        positiveCards.map((factor, index) => (
                            <tr key={index}>
                                <td>{t.cardNames[factor.card.name] || factor.card.name}</td>
                                <td>+{factor.card.value}</td>
                            </tr>
                        ))
                    ) : (
                        !luckyCard && <tr><td colSpan="2">{t.none}</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="summary-table-container">
                <div className="table-header bad">
                    <h3>{t.badFactors}</h3>
                </div>
                <table className="summary-table">
                    <thead>
                    <tr>
                        <th>{t.behavior}</th>
                        <th>{t.noOfHours}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {negativeCards.length > 0 ? (
                        negativeCards.map((factor, index) => (
                            <tr key={index}>
                                <td>{t.cardNames[factor.card.name] || factor.card.name}</td>
                                <td>-{factor.card.value}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">{t.none}</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};


const GameOverSummary = ({ summaryData, language }) => {
    const { winner, playHistory } = summaryData;
    const t = translations[language] || translations.en;
    
    // [แก้ไข] กรองและจัดกลุ่มข้อมูลสำหรับตาราง
    const winnerHistory = playHistory.filter(action => action.targetPlayerId === winner.id);
    const totalSleepGoal = winner.characters.reduce((sum, char) => sum + char.sleepGoal, 0);
    const totalCurrentSleep = winner.characters.reduce((sum, char) => sum + char.currentSleep, 0);

    return (
        <div className="summary-backdrop">
            <div className="summary-container">
                <h1>{t.congratulations}{winner.name}!</h1>
                <p className="summary-subtitle">{t.summaryTitle}</p>
                
                {/* [แก้ไข] แสดง Avatar ของผู้ชนะ */}
                <div className="winner-header-overall">
                    <img src={getAvatarImage(winner.avatar)} alt="Winner's Avatar" className="winner-avatar" />
                    <div className="winner-details-overall">
                        <h3>{winner.name}</h3>
                        <p>{t.finalSleep} {totalCurrentSleep} / {totalSleepGoal} {t.hours}</p>
                    </div>
                </div>

                <div className="all-characters-summary-container">
                    {winner.characters.map(char => (
                        <SummaryTables 
                            key={char.name}
                            character={char} 
                            history={winnerHistory} 
                            language={language}
                        />
                    ))}
                </div>

                <div className="total-summary">
                    <h3>{t.overallScore} {totalCurrentSleep} / {totalSleepGoal} {t.hours}</h3>
                </div>

                <button className="play-again-button" onClick={() => window.location.reload()}>
                    {t.playAgain}
                </button>
            </div>
        </div>
    );
};

export default GameOverSummary;