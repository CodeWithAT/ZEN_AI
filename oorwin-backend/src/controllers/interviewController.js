"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyInterviews = exports.addFeedback = exports.scheduleInterview = void 0;
const database_1 = __importDefault(require("../config/database"));
const notificationService_1 = require("../services/notificationService");
// 1. Schedule a new interview
const scheduleInterview = async (req, res, next) => {
    try {
        const { applicationId, scheduledAt, duration, interviewType, location, interviewerIds } = req.body;
        // Run this in a transaction so either everything succeeds or everything fails
        const result = await database_1.default.$transaction(async (tx) => {
            // Create the interview and connect the interviewers via the junction table
            const interview = await tx.interview.create({
                data: {
                    applicationId,
                    scheduledAt: new Date(scheduledAt),
                    duration: Number(duration),
                    interviewType,
                    location,
                    interviewers: {
                        create: interviewerIds.map((id) => ({
                            user: { connect: { id } }
                        }))
                    }
                },
                include: { application: { include: { candidate: true } } }
            });
            // Automatically move the application to the 'INTERVIEW' stage
            await tx.application.update({
                where: { id: applicationId },
                data: { status: 'INTERVIEW' }
            });
            return interview;
        });
        // Fire off real-time notifications to all assigned interviewers!
        const candidateName = result.application.candidate.name;
        for (const interviewerId of interviewerIds) {
            await notificationService_1.notificationService.createAndSend(interviewerId, 'INTERVIEW_SCHEDULED', 'New Interview Scheduled', `You are scheduled to interview ${candidateName} for a ${interviewType} round.`, `/interviews/${result.id}`);
        }
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.scheduleInterview = scheduleInterview;
// 2. Add Interview Feedback
const addFeedback = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { feedback, rating, status } = req.body; // status: 'COMPLETED', etc.
        const interview = await database_1.default.interview.update({
            where: { id },
            data: { feedback, rating: Number(rating), status }
        });
        res.status(200).json({ success: true, data: interview });
    }
    catch (error) {
        next(error);
    }
};
exports.addFeedback = addFeedback;
// 3. Get all interviews for the logged-in user
const getMyInterviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const interviews = await database_1.default.interview.findMany({
            where: {
                interviewers: { some: { userId } }
            },
            include: {
                application: { include: { candidate: true, job: true } }
            },
            orderBy: { scheduledAt: 'asc' }
        });
        res.status(200).json({ success: true, data: interviews });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyInterviews = getMyInterviews;
//# sourceMappingURL=interviewController.js.map