"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', {
        expiresIn: '7d',
    });
};
const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await database_1.default.user.findUnique({ where: { email } });
        if (userExists)
            return res.status(400).json({ error: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await database_1.default.user.create({
            data: { email, password: hashedPassword, name }
        });
        res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email }, token: generateToken(user.id) });
    }
    catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid email or password" });
        res.json({ success: true, data: { id: user.id, name: user.name, email: user.email }, token: generateToken(user.id) });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        // @ts-ignore
        const user = await database_1.default.user.findUnique({ where: { id: req.user.userId } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map