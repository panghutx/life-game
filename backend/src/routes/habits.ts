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
    return;
  } else if (user.last_active_date === yesterday) {
    newStreak = user.current_streak + 1;
  } else {
    newStreak = 1;
  }

  const longestStreak = Math.max(user.longest_streak, newStreak);

  await supabase.from('users').update({
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_active_date: today
  }).eq('id', userId);
}

function isConsecutiveDay(lastDate: string | null, today: string): boolean {
  if (!lastDate) return true;
  const last = new Date(lastDate);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const { data } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { name, xp_reward } = req.body;
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: req.userId,
      name,
      xp_reward: xp_reward || 5
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
    .from('habits')
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
  await supabase.from('habits').delete().eq('id', id).eq('user_id', req.userId);
  res.json({ success: true });
});

router.post('/:id/checkin', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const today = formatDate(new Date());

  // Get habit
  const { data: habit } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  // Check if already checked in today
  const { data: existingLog } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', id)
    .eq('check_in_date', today)
    .single();

  if (existingLog) {
    return res.status(400).json({ error: 'Already checked in today' });
  }

  // Determine streak
  const consecutive = isConsecutiveDay(habit.last_check_in, today);
  const newStreak = consecutive ? habit.current_streak + 1 : 1;
  const longestStreak = Math.max(habit.longest_streak, newStreak);

  // Insert log
  await supabase.from('habit_logs').insert({ habit_id: id, check_in_date: today });

  // Update habit
  await supabase.from('habits').update({
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_check_in: today
  }).eq('id', id);

  // Add XP
  const { data: user } = await supabase.from('users').select('*').eq('id', req.userId).single();
  const { newTotalXp, newLevel } = addXp(user.total_xp, user.level, habit.xp_reward);

  await supabase.from('users').update({ total_xp: newTotalXp, level: newLevel }).eq('id', req.userId);

  // Update user streak
  await updateUserStreak(req.userId!);

  // Check achievements
  const newAchievements = await checkAndUnlockAchievements(req.userId!);

  res.json({
    xp_earned: habit.xp_reward,
    new_total_xp: newTotalXp,
    new_level: newLevel,
    new_streak: newStreak,
    longest_streak: longestStreak,
    leveled_up: newLevel > user.level,
    new_achievements: newAchievements
  });
});

export default router;
