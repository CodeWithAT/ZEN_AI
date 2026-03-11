import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { notificationService } from '../services/notificationService';

// 1. Schedule a new interview
export const scheduleInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId, scheduledAt, duration, interviewType, location, interviewerIds } = req.body;

    // Run this in a transaction so either everything succeeds or everything fails
    const result = await prisma.$transaction(async (tx) => {
      // Create the interview and connect the interviewers via the junction table
      const interview = await tx.interview.create({
        data: {
          applicationId,
          scheduledAt: new Date(scheduledAt),
          duration: Number(duration),
          interviewType,
          location,
          interviewers: {
            create: interviewerIds.map((id: string) => ({
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
      await notificationService.createAndSend(
        interviewerId,
        'INTERVIEW_SCHEDULED',
        'New Interview Scheduled',
        `You are scheduled to interview ${candidateName} for a ${interviewType} round.`,
        `/interviews/${result.id}`
      );
    }

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 2. Add Interview Feedback
export const addFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { feedback, rating, status } = req.body; // status: 'COMPLETED', etc.

    const interview = await prisma.interview.update({
      where: { id },
      data: { feedback, rating: Number(rating), status }
    });

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

// 3. Get all interviews for the logged-in user
export const getMyInterviews = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const interviews = await prisma.interview.findMany({
      where: {
        interviewers: { some: { userId } }
      },
      include: {
        application: { include: { candidate: true, job: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    });

    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
};