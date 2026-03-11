"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJobDescriptionWithAI = exports.createJob = exports.getJobs = void 0;
const database_1 = __importDefault(require("../config/database"));
const aiService_1 = require("../services/aiService");
const getJobs = async (req, res, next) => {
    try {
        const jobs = await database_1.default.job.findMany({
            orderBy: { createdAt: 'desc' },
            include: { company: true }
        });
        res.status(200).json({ success: true, data: jobs });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobs = getJobs;
const createJob = async (req, res, next) => {
    try {
        // Requires companyId to be passed, or inferred from User in a real app
        const job = await database_1.default.job.create({
            data: {
                ...req.body,
                createdById: req.user.id
            }
        });
        res.status(201).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
const generateJobDescriptionWithAI = async (req, res, next) => {
    try {
        const { title, keywords } = req.body;
        if (!title || !keywords)
            return res.status(400).json({ success: false, error: 'Title and keywords required' });
        const generatedText = await aiService_1.aiService.generateJobDescription(title, keywords);
        res.status(200).json({ success: true, data: generatedText });
    }
    catch (error) {
        next(error);
    }
};
exports.generateJobDescriptionWithAI = generateJobDescriptionWithAI;
//# sourceMappingURL=jobController.js.map