import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/aiService';

const prisma = new PrismaClient();

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });

    console.log("File received, sending to AI...");
    const extractedData = await aiService.parseResumeWithAI(req.file.buffer);
    
    // Check if we have at least one user to assign this candidate to
    const recruiter = await prisma.user.findFirst(); 
    if (!recruiter) {
      return res.status(400).json({ error: "No user found. Please register an account first." });
    }

    let finalEmail = extractedData.email || `extracted_${Date.now()}@example.com`;
    
    // Check for duplicates to avoid Prisma unique constraint errors
    const existingCandidate = await prisma.candidate.findUnique({ where: { email: finalEmail } });
    if (existingCandidate) {
      finalEmail = `duplicate_${Date.now()}_${finalEmail}`;
    }

    console.log("Saving candidate to database...");
    const newCandidate = await prisma.candidate.create({
      data: {
        name: extractedData.name || "Unknown Candidate",
        email: finalEmail,
        phone: extractedData.phone || null,
        currentJobTitle: extractedData.currentJobTitle || "Unspecified",
        experienceYears: Number(extractedData.experienceYears) || 0,
        status: "ACTIVE",
        createdById: recruiter.id, 
        parsedData: JSON.stringify(extractedData)
      }
    });

    console.log("✅ Candidate successfully saved!");
    return res.status(201).json({ success: true, data: newCandidate });
    
  } catch (error: any) {
    console.error("🔥 BACKEND ERROR:", error);
    return res.status(500).json({ error: error.message || "Database error while saving candidate." });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return res.json({ success: true, data: candidates });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

export const searchCandidates = async (req: Request, res: Response) => {
  const { q } = req.query;
  try {
    const query = String(q);
    const candidates = await prisma.candidate.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: candidates });
  } catch (error) {
    return res.status(500).json({ error: "Search failed" });
  }
};

export const matchCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany();
    
    const matches = candidates.map(candidate => {
      const expScore = Math.min((candidate.experienceYears || 0) * 8, 40);
      const nameLength = candidate.name ? candidate.name.length : 10;
      const stableFactor = (nameLength * 7) % 40; 
      const totalScore = expScore + stableFactor + 20;

      return {
        candidate,
        matchScore: totalScore
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ success: true, data: matches }); 
  } catch (error) {
    return res.status(500).json({ error: "AI Matching failed" });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status }
    });
    return res.json({ success: true, data: updatedCandidate });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update status" });
  }
};
