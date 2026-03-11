import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import { getClients, createClient, getEmployees, onboardEmployee } from './controllers/systemController';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// CRM & HRMS Routes
app.get('/api/clients', getClients);
app.post('/api/clients', createClient);
app.get('/api/employees', getEmployees);
app.post('/api/employees/onboard', onboardEmployee);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Master API Engine running on http://localhost:${PORT}`);
});