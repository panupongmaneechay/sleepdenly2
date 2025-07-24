# client/Dockerfile

# ใช้ Node.js version 18 เป็น base image
FROM node:18-alpine

# กำหนด working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โปรเจคทั้งหมด
COPY . .

# เปิด port 5173 ของ Vite dev server
EXPOSE 5173

# คำสั่งเริ่มต้นเมื่อ container ทำงาน (จะถูก override โดย docker-compose)
CMD ["npm", "run", "dev"]
