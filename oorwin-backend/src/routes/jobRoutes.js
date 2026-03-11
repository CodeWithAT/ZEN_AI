"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(jobController_1.getJobs)
    .post(authMiddleware_1.protect, jobController_1.createJob);
router.post('/generate-description', authMiddleware_1.protect, jobController_1.generateJobDescriptionWithAI);
exports.default = router;
//# sourceMappingURL=jobRoutes.js.map