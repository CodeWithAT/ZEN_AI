import prisma from '../config/database';
import { getIo, getUserSocketId } from '../config/socket';

export const notificationService = {
  createAndSend: async (userId: string, type: string, title: string, message: string, link?: string) => {
    try {
      // 1. Save to Database
      const notification = await prisma.notification.create({
        data: { userId, type, title, message, link: link || null }
      });

      // 2. Check if user is currently online
      const socketId = getUserSocketId(userId);
      
      if (socketId) {
        // 3. Push real-time event to their specific browser tab
        const io = getIo();
        io.to(socketId).emit('new_notification', notification);
      }

      return notification;
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }
};