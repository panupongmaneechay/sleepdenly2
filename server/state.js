// server/state.js

// ไฟล์นี้จะเก็บ state ที่ใช้ร่วมกันในเซิร์ฟเวอร์เพื่อป้องกันปัญหา Circular Dependency
const rooms = {};
const pendingActions = {};

module.exports = {
    rooms,
    pendingActions
};