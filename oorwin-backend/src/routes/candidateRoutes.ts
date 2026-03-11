import express from 'express';
import multer from 'multer';
import { uploadResume, getCandidates, searchCandidates, matchCandidates, updateCandidateStatus } from '../controllers/candidateController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/search', searchCandidates);
router.get('/match', matchCandidates);
router.put('/:id/status', updateCandidateStatus); // MUST HAVE THIS FOR STATUS UPDATES
router.get('/', getCandidates);
router.post('/upload-resume', upload.single('resume'), uploadResume);

export default router;