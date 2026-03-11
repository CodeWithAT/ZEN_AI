import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email }, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email }, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};