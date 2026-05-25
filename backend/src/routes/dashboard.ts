// src/routes/dashboard.ts
import { Router, Response } from 'express';
import { supabase } from '../config';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { xpForLevel, xpToNextLevel } from '../services/xp';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.userId)
    .single();

  if (!user) return res.status(404).json({ error: 'User not found' });

  // Get today's tasks (due today or not completed)
  const today = new Date().toISOString().split('T')[0];
  const { data: todayTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.userId)
    .or(`due_date.eq.${today},completed.eq.false`)
    .limit(10);

  // Get habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', req.userId);

  // Get recent achievements
  const { data: recentAchievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', req.userId)
    .order('unlocked_at', { ascending: false })
    .limit(3);

  const xpForCurrentLevel = xpForLevel(user.level);
  const xpForNext = xpToNextLevel(user.level);
  const xpProgress = user.total_xp - xpForCurrentLevel;
  const xpNeeded = xpForNext - xpForCurrentLevel;

  res.json({
    user: {
      id: user.id,
      username: user.username,
      level: user.level,
      total_xp: user.total_xp,
      current_streak: user.current_streak,
      longest_streak: user.longest_streak
    },
    xp_progress: xpProgress,
    xp_needed: xpNeeded,
    xp_percentage: Math.round((xpProgress / xpNeeded) * 100),
    today_tasks: todayTasks || [],
    habits: habits || [],
    recent_achievements: recentAchievements || []
  });
});

export default router;
