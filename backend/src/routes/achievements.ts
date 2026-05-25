// src/routes/achievements.ts
import { Router, Response } from 'express';
import { supabase } from '../config';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ACHIEVEMENT_DEFINITIONS } from '../services/achievements';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { data: unlocked } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', req.userId);

  const unlockedKeys = new Set(unlocked?.map(a => a.achievement_key) || []);

  const all = Object.values(ACHIEVEMENT_DEFINITIONS).map(def => ({
    ...def,
    unlocked: unlockedKeys.has(def.key),
    unlocked_at: unlocked?.find(a => a.achievement_key === def.key)?.unlocked_at || null
  }));

  res.json(all);
});

export default router;
