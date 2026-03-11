"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const candidateRoutes_1 = __importDefault(require("./routes/candidateRoutes"));
const systemController_1 = require("./controllers/systemController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/candidates', candidateRoutes_1.default);
// CRM & HRMS Routes
app.get('/api/clients', systemController_1.getClients);
app.post('/api/clients', systemController_1.createClient);
app.get('/api/employees', systemController_1.getEmployees);
app.post('/api/employees/onboard', systemController_1.onboardEmployee);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Master API Engine running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map