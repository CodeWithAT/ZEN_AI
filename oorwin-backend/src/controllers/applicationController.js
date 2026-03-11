"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPipeline = exports.updateApplicationStatus = exports.createApplication = void 0;
const database_1 = __importDefault(require("../config/database"));
// 1. Apply for a Job
const createApplication = async (req, res, next) => {
    try {
        const { candidateId, jobId, notes } = req.body;
        const application = await database_1.default.application.create({
            data: {
                candidateId,
                jobId,
                notes,
                status: 'APPLIED', // Default status from Prisma Schema
            },
            include: { candidate: true, job: true }
        });
        res.status(201).json({ success: true, data: application });
    }
    catch (error) {
        // Handle Prisma unique constraint error if they already applied
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, error: 'Candidate has already applied for this job' });
        }
        next(error);
    }
};
exports.createApplication = createApplication;
// 2. Update Application Status (Drag & Drop)
const updateApplicationStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status, rejectionReason } = req.body;
        const updatedApplication = await database_1.default.application.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null
            },
            include: { candidate: true }
        });
        // TODO: Here you would trigger notificationService to email the candidate about their status change!
        res.status(200).json({ success: true, data: updatedApplication });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
// 3. Get Pipeline for Kanban Board
const getPipeline = async (req, res, next) => {
    try {
        const jobId = req.params.jobId;
        // Fetch all applications for this job
        const applications = await database_1.default.application.findMany({
            where: { jobId },
            include: {
                candidate: {
                    select: { id: true, name: true, email: true, currentJobTitle: true, experienceYears: true }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });
        // Group them by status for the frontend Kanban columns
        const pipeline = {
            APPLIED: applications.filter(a => a.status === 'APPLIED'),
            SCREENING: applications.filter(a => a.status === 'SCREENING'),
            INTERVIEW: applications.filter(a => a.status === 'INTERVIEW'),
            TECHNICAL_TEST: applications.filter(a => a.status === 'TECHNICAL_TEST'),
            OFFER: applications.filter(a => a.status === 'OFFER'),
            HIRED: applications.filter(a => a.status === 'HIRED'),
            REJECTED: applications.filter(a => a.status === 'REJECTED'),
        };
        res.status(200).json({ success: true, data: pipeline });
    }
    catch (error) {
        next(error);
    }
};
exports.getPipeline = getPipeline;
//# sourceMappingURL=applicationController.js.map