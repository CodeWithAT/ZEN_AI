import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ensure the secret is a string to prevent JWT signing errors
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation to prevent empty fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in Database
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword 
      },
    });

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Registration failed due to server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Login failed due to server error' });
  }
};
