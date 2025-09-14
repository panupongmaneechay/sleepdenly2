# Dockerfile (วางไว้ที่ Root Project)

# --- Stage 1: Build the React Frontend ---
FROM node:22-alpine AS client-builder

# ตั้งค่า working directory สำหรับ client
WORKDIR /app/client

# คัดลอก package files และติดตั้ง dependencies ของ client
COPY client/package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดของ client
COPY client/ ./

# รันคำสั่ง build เพื่อสร้างไฟล์ static
RUN npm run build

# --- Stage 2: Build and Run the Node.js Server ---
FROM node:22-alpine

# ตั้งค่า working directory สำหรับ server
WORKDIR /app

# คัดลอก package files และติดตั้ง dependencies ของ server
COPY server/package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดของ server
COPY server/ ./

# [สำคัญ] คัดลอกไฟล์ build ของ client จาก stage แรก มาไว้ในโฟลเดอร์ public
# เพื่อให้ Express สามารถ serve ไฟล์เหล่านี้ได้
COPY --from=client-builder /app/client/dist ./public

# เปิด Port ที่ Server ใช้งาน
EXPOSE 3001

# คำสั่งสำหรับรัน Server
CMD ["node", "index.js"]