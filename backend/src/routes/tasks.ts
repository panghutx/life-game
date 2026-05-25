// src/routes/tasks.ts
import { Router, Response } from 'express';
import { supabase } from '../config';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { addXp } from '../services/xp';
import { checkAndUnlockAchievements } from '../services/achievements';

const router = Router();
router.use(authMiddleware);

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function updateUserStreak(userId: string) {
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  if (!user) return;

  const today = formatDate(new Date());
  const yesterday = formatDate(addDays(new Date(), -1));

  let newStreak = user.current_streak;

  if (user.last_active_date === today) {
    // Already active today, no change
    return;
  } else if (user.last_active_date === yesterday) {
    // Active yesterday, increment streak
    newStreak = user.current_streak + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  const longestStreak = Math.max(user.longest_streak, newStreak);

  await supabase.from('users').update({
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_active_date: today
  }).eq('id', userId);
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, description, xp_reward, due_date, repeat_rule } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: req.userId,
      title,
      description,
      xp_reward: xp_reward || 10,
      due_date,
      repeat_rule: repeat_rule || 'none'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await supabase.from('tasks').delete().eq('id', id).eq('user_id', req.userId);
  res.json({ success: true });
});

router.post('/:id/complete', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Get task
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.completed) return res.status(400).json({ error: 'Task already completed' });

  // Update task as completed
  await supabase.from('tasks').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id);

  // Handle repeat rule - create next occurrence
  if (task.repeat_rule === 'daily') {
    const nextDueDate = formatDate(addDays(new Date(task.due_date || new Date()), 1));
    await supabase.from('tasks').insert({
      user_id: req.userId,
      title: task.title,
      description: task.description,
      xp_reward: task.xp_reward,
      due_date: nextDueDate,
      repeat_rule: 'daily'
    });
  } else if (task.repeat_rule === 'weekly') {
    const nextDueDate = formatDate(addDays(new Date(task.due_date || new Date()), 7));
    await supabase.from('tasks').insert({
      user_id: req.userId,
      title: task.title,
      description: task.description,
      xp_reward: task.xp_reward,
      due_date: nextDueDate,
      repeat_rule: 'weekly'
    });
  }

  // Add XP to user
  const { data: user } = await supabase.from('users').select('*').eq('id', req.userId).single();
  const { newTotalXp, newLevel } = addXp(user.total_xp, user.level, task.xp_reward);

  await supabase.from('users').update({ total_xp: newTotalXp, level: newLevel }).eq('id', req.userId);

  // Update user streak
  await updateUserStreak(req.userId!);

  // Check achievements
  const newAchievements = await checkAndUnlockAchievements(req.userId!);

  res.json({
    xp_earned: task.xp_reward,
    new_total_xp: newTotalXp,
    new_level: newLevel,
    leveled_up: newLevel > user.level,
    new_achievements: newAchievements
  });
});

export default router;
