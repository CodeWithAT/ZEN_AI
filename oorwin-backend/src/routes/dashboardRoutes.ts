import { Router } from 'express';
import { getDashboardStats, getHiringFunnel } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/hiring-funnel', getHiringFunnel);

export default router;