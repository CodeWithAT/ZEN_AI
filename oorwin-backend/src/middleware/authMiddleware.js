"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
        // @ts-ignore
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Not authorized, token failed" });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map