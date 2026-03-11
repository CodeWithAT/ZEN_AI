"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all application routes
router.use(authMiddleware_1.protect);
router.post('/', applicationController_1.createApplication);
router.put('/:id/status', applicationController_1.updateApplicationStatus);
router.get('/pipeline/:jobId', applicationController_1.getPipeline);
exports.default = router;
//# sourceMappingURL=applicationRoutes.js.map