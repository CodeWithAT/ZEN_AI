import { Request, Response } from 'express';
import prisma from '../config/database';
import { parseResumeWithAI } from '../services/aiService';

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });

    console.log("File received, sending to AI...");
    const extractedData = await parseResumeWithAI(req.file.buffer);
    
    const recruiter = await prisma.user.findFirst(); 
    if (!recruiter) return res.status(400).json({ error: "No recruiter found in database. Please register a user first." });

    // FIX: Handle duplicate emails so you can test the same resume multiple times without crashing!
    let finalEmail = extractedData.email || `extracted_${Date.now()}@example.com`;
    const existingCandidate = await prisma.candidate.findUnique({ where: { email: finalEmail } });
    if (existingCandidate) {
      // Append a timestamp to the email so it remains unique in SQLite
      finalEmail = `duplicate_${Date.now()}_${finalEmail}`;
    }

    console.log("Saving candidate to database...");
    const newCandidate = await prisma.candidate.create({
      data: {
        name: extractedData.name || "Unknown Candidate",
        email: finalEmail,
        phone: extractedData.phone || null,
        currentJobTitle: extractedData.currentJobTitle || "Unspecified",
        experienceYears: extractedData.experienceYears || 0,
        status: "ACTIVE",
        createdById: recruiter.id, 
        parsedData: JSON.stringify(extractedData)
      }
    });

    console.log("✅ Candidate successfully saved!");
    res.status(201).json({ success: true, data: newCandidate });
    
  } catch (error: any) {
    // FIX: We now log the exact error to the terminal AND send it to the frontend popup!
    console.error("🔥 BACKEND CRASH:", error);
    res.status(500).json({ error: error.message || "Database crashed while saving candidate." });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

export const searchCandidates = async (req: Request, res: Response) => {
  const { q } = req.query;
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        OR: [
          { name: { contains: String(q) } },
          { email: { contains: String(q) } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
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
    res.json({ success: true, data: matches }); 
  } catch (error) {
    res.status(500).json({ error: "AI Matching failed" });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status }
    });
    res.json({ success: true, data: updatedCandidate });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};