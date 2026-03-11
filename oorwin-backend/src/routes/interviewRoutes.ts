import { Router } from 'express';
import { scheduleInterview, addFeedback, getMyInterviews } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', scheduleInterview);
router.get('/', getMyInterviews);
router.put('/:id/feedback', addFeedback);

export default router;