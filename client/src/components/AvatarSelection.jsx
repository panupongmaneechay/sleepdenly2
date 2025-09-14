// // client/src/components/AvatarSelection.jsx

// import React from 'react';
// import '../styles/AvatarSelection.css';

// const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, as: 'url' });

// const AvatarSelection = ({ onSelectAvatar, onBack, myAvatar }) => {
//     const avatars = Object.values(avatarImages);

//     return (
//         <div className="avatar-selection-container">
//             <h2>Select Your Avatar</h2>
//             <div className="avatar-grid">
//                 {avatars.map((avatar, index) => (
//                     <img 
//                         key={index}
//                         src={avatar} 
//                         alt={`Avatar ${index + 1}`} 
//                         className={`avatar-image ${myAvatar === avatar ? 'selected' : ''}`}
//                         onClick={() => onSelectAvatar(avatar)}
//                     />
//                 ))}
//             </div>
//             <button onClick={onBack} className="back-button">Back</button>
//         </div>
//     );
// };

// export default AvatarSelection;

// client/src/components/AvatarSelection.jsx

import React from 'react';
import '../styles/AvatarSelection.css';

// [แก้ไข] สร้าง Array ของ path รูปภาพโดยตรง
// (หากคุณมีรูป Avatar ไม่ถึง 15 รูป หรือชื่อไฟล์ต่างจากนี้ ให้แก้ไขตัวเลขและชื่อไฟล์ให้ถูกต้อง)
const totalAvatars = 15;
const avatarPaths = Array.from({ length: totalAvatars }, (_, i) => {
    const number = (i + 1).toString().padStart(2, '0');
    // สมมติว่าไฟล์ของคุณชื่อ Avatar_01.png, Avatar_02.png, ...
    return `/avatars/Avatar_${number}.png`;
});


const AvatarSelection = ({ onSelectAvatar, onBack, myAvatar }) => {
    const avatars = avatarPaths;

    return (
        <div className="avatar-selection-container">
            <h2>Select Your Avatar</h2>
            <div className="avatar-grid">
                {avatars.map((avatarPath, index) => (
                    <img 
                        key={index}
                        src={avatarPath} 
                        alt={`Avatar ${index + 1}`} 
                        className={`avatar-image ${myAvatar === avatarPath ? 'selected' : ''}`}
                        onClick={() => onSelectAvatar(avatarPath)}
                    />
                ))}
            </div>
            <button onClick={onBack} className="back-button">Back</button>
        </div>
    );
};

export default AvatarSelection;