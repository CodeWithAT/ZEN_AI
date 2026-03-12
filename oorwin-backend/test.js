require('ts-node/register');
try {
  const auth = require('./src/routes/authRoutes').default;
  console.log('Auth OK');
} catch (e) { console.error('Auth error:', e); }

try {
  const cand = require('./src/routes/candidateRoutes').default;
  console.log('Cand OK');
} catch (e) { console.error('Cand error:', e); }

try {
  const server = require('./src/server');
  console.log('Server OK');
} catch (e) { console.error('Server error:', e); }
