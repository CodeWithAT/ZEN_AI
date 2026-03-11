"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const database_1 = __importDefault(require("../config/database"));
const socket_1 = require("../config/socket");
exports.notificationService = {
    createAndSend: async (userId, type, title, message, link) => {
        try {
            // 1. Save to Database
            const notification = await database_1.default.notification.create({
                data: { userId, type, title, message, link: link || null }
            });
            // 2. Check if user is currently online
            const socketId = (0, socket_1.getUserSocketId)(userId);
            if (socketId) {
                // 3. Push real-time event to their specific browser tab
                const io = (0, socket_1.getIo)();
                io.to(socketId).emit('new_notification', notification);
            }
            return notification;
        }
        catch (error) {
            console.error("Failed to send notification:", error);
        }
    }
};
//# sourceMappingURL=notificationService.js.map