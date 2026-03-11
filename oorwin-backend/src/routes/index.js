"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const candidateRoutes_1 = __importDefault(require("./candidateRoutes"));
const jobRoutes_1 = __importDefault(require("./jobRoutes"));
const applicationRoutes_1 = __importDefault(require("./applicationRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const interviewRoutes_1 = __importDefault(require("./interviewRoutes")); // NEW
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/candidates', candidateRoutes_1.default);
router.use('/jobs', jobRoutes_1.default);
router.use('/applications', applicationRoutes_1.default);
router.use('/dashboard', dashboardRoutes_1.default);
router.use('/interviews', interviewRoutes_1.default); // NEW
exports.default = router;
//# sourceMappingURL=index.js.map