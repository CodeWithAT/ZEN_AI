import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import { 
  getClients, createClient, deleteClient, updateClientStage,
  getEmployees, onboardEmployee,
  getLeaveRequests, createLeaveRequest, updateLeaveRequestStatus
} from './controllers/systemController';

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:3000',   // CRA fallback
  'http://localhost:8080',   // Same port (browser direct access)
  process.env.FRONTEND_URL,  // Production URL from env
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// CRM & HRMS Routes
app.get('/api/clients', getClients);
app.post('/api/clients', createClient);
app.delete('/api/clients/:id', deleteClient);
app.put('/api/clients/:id/stage', updateClientStage);

app.get('/api/employees', getEmployees);
app.post('/api/employees/onboard', onboardEmployee);

app.get('/api/leave', getLeaveRequests);
app.post('/api/leave', createLeaveRequest);
app.put('/api/leave/:id/status', updateLeaveRequestStatus);

// Health Check for Render
app.get('/', (req, res) => {
  res.send('🚀 Master API Engine is running!');
});

// Render (production) uses PORT env var; local dev defaults to 5000
const PORT = process.env.PORT || 5000;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
