// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import taskRoutes from './routes/tasks';
import habitRoutes from './routes/habits';
import achievementRoutes from './routes/achievements';
import dashboardRoutes from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));
app.get('*', (_, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
