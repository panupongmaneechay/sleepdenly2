// server/index.js

// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const cors = require('cors');
// const { initializeSocketHandlers } = require('./socketHandlers');

// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://13.228.225.19:5173", methods: ["GET", "POST"] }
//   // cors: { origin: "http://10.30.16.104:5173", methods: ["GET", "POST"] }
//   // cors: { origin: "http://10.144.45.219:5173", methods: ["GET", "POST"] }
// });

// // เรียกใช้ฟังก์ชันเพื่อเริ่มต้น event handlers ทั้งหมด
// initializeSocketHandlers(io);

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
// });

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path'); // [เพิ่ม] import 'path'
const { initializeSocketHandlers } = require('./socketHandlers');

const app = express();
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"]
};
app.use(cors(corsOptions));

// [เพิ่ม] ให้ Express เสิร์ฟไฟล์ static จากโฟลเดอร์ 'public'
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

// เรียกใช้ฟังก์ชันเพื่อเริ่มต้น event handlers ทั้งหมด
initializeSocketHandlers(io);

// [เพิ่ม] Catch-all route เพื่อส่ง index.html สำหรับทุก request ที่ไม่ตรงกับ API
// จำเป็นสำหรับ React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});