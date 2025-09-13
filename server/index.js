// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { initializeSocketHandlers } = require('./socketHandlers');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  // cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
  // cors: { origin: "http://10.30.16.104:5173", methods: ["GET", "POST"] }
  cors: { origin: "http://10.144.45.210:5173", methods: ["GET", "POST"] }
});

// เรียกใช้ฟังก์ชันเพื่อเริ่มต้น event handlers ทั้งหมด
initializeSocketHandlers(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});