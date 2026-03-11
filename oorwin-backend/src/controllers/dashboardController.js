"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHiringFunnel = exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get the logged-in recruiter's ID
        // Run all database queries in parallel for maximum speed
        const [totalJobs, activeApplicants, interviews, successfulHires] = await Promise.all([
            // 1. Total Active Jobs posted by this user
            database_1.default.job.count({
                where: { createdById: userId, status: 'ACTIVE' }
            }),
            // 2. Active Applicants (Not Hired, Not Rejected)
            database_1.default.application.count({
                where: {
                    job: { createdById: userId },
                    status: { notIn: ['HIRED', 'REJECTED'] }
                }
            }),
            // 3. Upcoming Interviews
            database_1.default.interview.count({
                where: {
                    status: 'SCHEDULED',
                    interviewers: { some: { userId: userId } }
                }
            }),
            // 4. Successful Hires
            database_1.default.application.count({
                where: {
                    job: { createdById: userId },
                    status: 'HIRED'
                }
            })
        ]);
        res.status(200).json({
            success: true,
            data: { totalJobs, activeApplicants, interviews, successfulHires }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getHiringFunnel = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Group applications by status to build the funnel chart
        const funnelData = await database_1.default.application.groupBy({
            by: ['status'],
            where: { job: { createdById: userId } },
            _count: { status: true }
        });
        // Format the response into a clean object (e.g., { APPLIED: 50, INTERVIEW: 12 })
        const formattedFunnel = funnelData.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});
        res.status(200).json({ success: true, data: formattedFunnel });
    }
    catch (error) {
        next(error);
    }
};
exports.getHiringFunnel = getHiringFunnel;
//# sourceMappingURL=dashboardController.js.map