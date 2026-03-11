"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocketId = exports.getIo = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
// Keep track of connected users (UserId -> SocketId)
const connectedUsers = new Map();
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // In production, restrict this to your frontend URL
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        // When a user logs in on the frontend, they emit 'register' with their User ID
        socket.on('register', (userId) => {
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
exports.initSocket = initSocket;
// Export a helper to emit events from anywhere in our controllers
const getIo = () => {
    if (!io)
        throw new Error("Socket.io is not initialized!");
    return io;
};
exports.getIo = getIo;
const getUserSocketId = (userId) => {
    return connectedUsers.get(userId);
};
exports.getUserSocketId = getUserSocketId;
//# sourceMappingURL=socket.js.map