"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const candidateController_1 = require("../controllers/candidateController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/search', candidateController_1.searchCandidates);
router.get('/match', candidateController_1.matchCandidates);
router.put('/:id/status', candidateController_1.updateCandidateStatus); // MUST HAVE THIS FOR STATUS UPDATES
router.get('/', candidateController_1.getCandidates);
router.post('/upload-resume', upload.single('resume'), candidateController_1.uploadResume);
exports.default = router;
//# sourceMappingURL=candidateRoutes.js.map