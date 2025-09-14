import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import notesRoutes from './src/routes/notes.routes.js';
import tenantsRoutes from './src/routes/tenants.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

// Connect DB
connectDB();

// Local run (not on Vercel)
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

// Export for Vercel
export default app;
export const handler = serverless(app);
