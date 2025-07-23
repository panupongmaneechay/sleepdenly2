// client/src/components/DraggableActionCard.jsx

import React from 'react';
import { useDrag } from 'react-dnd';

// เรากำหนด 'type' ของสิ่งของที่ลากได้ เพื่อให้ Drop Target รู้ว่ารับอะไรได้บ้าง
export const ItemTypes = {
  CARD: 'card',
};

const DraggableActionCard = ({ card }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card }, // ข้อมูลที่จะส่งไปพร้อมกับการลาก คือข้อมูลของการ์ดใบนี้
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag} // บอกให้ react-dnd รู้ว่า div นี้คือส่วนที่ลากได้
      className="action-card"
      style={{
        opacity: isDragging ? 0.5 : 1, // ทำให้การ์ดโปร่งใสตอนกำลังลาก
        cursor: 'grab',
      }}
    >
      <strong>{card.name}</strong>
      <p>{card.description}</p>
    </div>
  );
};

export default DraggableActionCard;