import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

// Keep track of connected users (UserId -> SocketId)
const connectedUsers = new Map<string, string>();

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // In production, restrict this to your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // When a user logs in on the frontend, they emit 'register' with their User ID
    socket.on('register', (userId: string) => {
      connectedUsers.set(userId, socket.id);
      console.log(`👤 User ${userId} registered to socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      // Find and remove the user from the map
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export a helper to emit events from anywhere in our controllers
export const getIo = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};

export const getUserSocketId = (userId: string) => {
  return connectedUsers.get(userId);
};