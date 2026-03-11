import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getDashboardStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; // Get the logged-in recruiter's ID

    // Run all database queries in parallel for maximum speed
    const [totalJobs, activeApplicants, interviews, successfulHires] = await Promise.all([
      // 1. Total Active Jobs posted by this user
      prisma.job.count({
        where: { createdById: userId, status: 'ACTIVE' }
      }),
      // 2. Active Applicants (Not Hired, Not Rejected)
      prisma.application.count({
        where: { 
          job: { createdById: userId },
          status: { notIn: ['HIRED', 'REJECTED'] }
        }
      }),
      // 3. Upcoming Interviews
      prisma.interview.count({
        where: { 
          status: 'SCHEDULED',
          interviewers: { some: { userId: userId } }
        }
      }),
      // 4. Successful Hires
      prisma.application.count({
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
  } catch (error) {
    next(error);
  }
};

export const getHiringFunnel = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    // Group applications by status to build the funnel chart
    const funnelData = await prisma.application.groupBy({
      by: ['status'],
      where: { job: { createdById: userId } },
      _count: { status: true }
    });

    // Format the response into a clean object (e.g., { APPLIED: 50, INTERVIEW: 12 })
    const formattedFunnel = funnelData.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: formattedFunnel });
  } catch (error) {
    next(error);
  }
};