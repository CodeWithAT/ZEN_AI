"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interviewController_1 = require("../controllers/interviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.post('/', interviewController_1.scheduleInterview);
router.get('/', interviewController_1.getMyInterviews);
router.put('/:id/feedback', interviewController_1.addFeedback);
exports.default = router;
//# sourceMappingURL=interviewRoutes.js.map