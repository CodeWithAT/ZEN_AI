import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import { getClients, createClient, getEmployees, onboardEmployee } from './controllers/systemController';

const app = express();

// Middleware
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

// Health Check for Render
app.get('/', (req, res) => {
  res.send('🚀 Master API Engine is running!');
});

// Render requires listening on 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
