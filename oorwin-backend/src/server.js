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
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/candidates', candidateRoutes_1.default);
// CRM & HRMS Routes
app.get('/api/clients', systemController_1.getClients);
app.post('/api/clients', systemController_1.createClient);
app.delete('/api/clients/:id', systemController_1.deleteClient);
app.get('/api/employees', systemController_1.getEmployees);
app.post('/api/employees/onboard', systemController_1.onboardEmployee);
// Health Check for Render
app.get('/', (req, res) => {
    res.send('🚀 Master API Engine is running!');
});
// Render requires listening on 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});
//# sourceMappingURL=server.js.map