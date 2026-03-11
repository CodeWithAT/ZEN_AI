import { Router } from 'express';
import authRoutes from './authRoutes';
import candidateRoutes from './candidateRoutes';
import jobRoutes from './jobRoutes';
import applicationRoutes from './applicationRoutes';
import dashboardRoutes from './dashboardRoutes';
import interviewRoutes from './interviewRoutes'; // NEW

const router = Router();

router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/interviews', interviewRoutes); // NEW

export default router;