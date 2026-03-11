import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { aiService } from '../services/aiService';

interface AuthRequest extends Request { user?: any; }

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { company: true }
    });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Requires companyId to be passed, or inferred from User in a real app
    const job = await prisma.job.create({
      data: {
        ...req.body,
        createdById: req.user.id
      }
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const generateJobDescriptionWithAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, keywords } = req.body;
    if (!title || !keywords) return res.status(400).json({ success: false, error: 'Title and keywords required' });

    const generatedText = await aiService.generateJobDescription(title, keywords);
    
    res.status(200).json({ success: true, data: generatedText });
  } catch (error) {
    next(error);
  }
};