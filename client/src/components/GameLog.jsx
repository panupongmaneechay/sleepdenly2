// client/src/components/GameLog.jsx

import React, { useRef, useEffect } from 'react';
import '../styles/GameLog.css';

const GameLog = ({ logs }) => {
  const logContainerRef = useRef(null);

  // ทำให้ Log Box เลื่อนลงมาล่าสุดเสมอเมื่อมีข้อความใหม่
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="game-log-container">
      <h4>Information Logs</h4>
      <ul ref={logContainerRef} className="log-list">
        {/* แสดงผลโดยเรียงจากเก่าไปใหม่ (ข้อความล่าสุดอยู่ล่างสุด) */}
        {logs.slice().reverse().map((log, index) => (
          <li key={index}>{log.replace(/---/g, '')}</li> // เอา --- ออกเพื่อความสวยงาม
        ))}
      </ul>
    </div>
  );
};

export default GameLog;
