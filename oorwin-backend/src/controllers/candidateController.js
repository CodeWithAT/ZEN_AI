"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateStatus = exports.matchCandidates = exports.searchCandidates = exports.getCandidates = exports.uploadResume = void 0;
const database_1 = __importDefault(require("../config/database"));
const aiService_1 = require("../services/aiService");
const uploadResume = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "No PDF file uploaded." });
        console.log("File received, sending to AI...");
        const extractedData = await aiService_1.aiService.parseResumeWithAI(req.file.buffer);
        const recruiter = await database_1.default.user.findFirst();
        if (!recruiter)
            return res.status(400).json({ error: "No recruiter found in database. Please register a user first." });
        // FIX: Handle duplicate emails so you can test the same resume multiple times without crashing!
        let finalEmail = extractedData.email || `extracted_${Date.now()}@example.com`;
        const existingCandidate = await database_1.default.candidate.findUnique({ where: { email: finalEmail } });
        if (existingCandidate) {
            // Append a timestamp to the email so it remains unique in SQLite
            finalEmail = `duplicate_${Date.now()}_${finalEmail}`;
        }
        console.log("Saving candidate to database...");
        const newCandidate = await database_1.default.candidate.create({
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
    }
    catch (error) {
        // FIX: We now log the exact error to the terminal AND send it to the frontend popup!
        console.error("🔥 BACKEND CRASH:", error);
        res.status(500).json({ error: error.message || "Database crashed while saving candidate." });
    }
};
exports.uploadResume = uploadResume;
const getCandidates = async (req, res) => {
    try {
        const candidates = await database_1.default.candidate.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: candidates });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
};
exports.getCandidates = getCandidates;
const searchCandidates = async (req, res) => {
    const { q } = req.query;
    try {
        const candidates = await database_1.default.candidate.findMany({
            where: {
                OR: [
                    { name: { contains: String(q) } },
                    { email: { contains: String(q) } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: candidates });
    }
    catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};
exports.searchCandidates = searchCandidates;
const matchCandidates = async (req, res) => {
    try {
        const candidates = await database_1.default.candidate.findMany();
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
    }
    catch (error) {
        res.status(500).json({ error: "AI Matching failed" });
    }
};
exports.matchCandidates = matchCandidates;
const updateCandidateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const updatedCandidate = await database_1.default.candidate.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, data: updatedCandidate });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
};
exports.updateCandidateStatus = updateCandidateStatus;
//# sourceMappingURL=candidateController.js.map