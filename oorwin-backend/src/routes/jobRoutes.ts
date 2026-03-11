import { Router } from 'express';
import { getJobs, createJob, generateJobDescriptionWithAI } from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.post('/generate-description', protect, generateJobDescriptionWithAI);

export default router;