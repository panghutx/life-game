// src/routes/user.ts
import { Router, Response } from 'express';
import { supabase } from '../config';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/me', async (req: AuthRequest, res: Response) => {
  const { data } = await supabase
    .from('users')
    .select('id, username, level, total_xp, current_streak, longest_streak, created_at')
    .eq('id', req.userId)
    .single();
  res.json(data);
});

router.patch('/me', async (req: AuthRequest, res: Response) => {
  const updates = req.body;
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.userId)
    .select('id, username, level, total_xp, current_streak, longest_streak, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
