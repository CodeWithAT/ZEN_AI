import { Router } from 'express';
import multer from 'multer';
import * as candidateController from '../controllers/candidateController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Debugging: This will print in Render logs to tell us which one is broken
console.log("Candidate Handlers Check:", {
    search: candidateController.searchCandidates,
    match: candidateController.matchCandidates,
    status: candidateController.updateCandidateStatus,
    get: candidateController.getCandidates,
    upload: candidateController.uploadResume
});

router.get('/search', candidateController.searchCandidates);
router.get('/match', candidateController.matchCandidates);
router.put('/:id/status', candidateController.updateCandidateStatus);
router.get('/', candidateController.getCandidates);
router.post('/upload-resume', upload.single('resume'), candidateController.uploadResume);

export default router;
