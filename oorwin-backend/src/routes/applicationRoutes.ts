import { Router } from 'express';
import { createApplication, updateApplicationStatus, getPipeline } from '../controllers/applicationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Protect all application routes
router.use(protect);

router.post('/', createApplication);
router.put('/:id/status', updateApplicationStatus);
router.get('/pipeline/:jobId', getPipeline);

export default router;