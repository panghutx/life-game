// src/services/achievements.ts
import { supabase } from '../config';

export const ACHIEVEMENT_DEFINITIONS = {
  first_task: { key: 'first_task', name: '初出茅庐', description: '完成第一个任务', icon: '🎯' },
  task_10: { key: 'task_10', name: '小有成就', description: '累计完成 10 个任务', icon: '🏆' },
  task_100: { key: 'task_100', name: '百炼成钢', description: '累计完成 100 个任务', icon: '💎' },
  habit_7: { key: 'habit_7', name: '连续 7 天', description: '任意习惯连续打卡 7 天', icon: '🔥' },
  habit_30: { key: 'habit_30', name: '坚持不懈', description: '任意习惯连续打卡 30 天', icon: '⚡' },
  streak_7: { key: 'streak_7', name: '一周活跃', description: '连续 7 天有任意活动', icon: '📅' },
  level_5: { key: 'level_5', name: '五级玩家', description: '达到 5 级', icon: '⭐' },
  level_10: { key: 'level_10', name: '十级玩家', description: '达到 10 级', icon: '🌟' },
};

export type AchievementKey = keyof typeof ACHIEVEMENT_DEFINITIONS;

export async function checkAndUnlockAchievements(userId: string): Promise<AchievementKey[]> {
  const newlyUnlocked: AchievementKey[] = [];

  // Get user stats
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  const { data: completedTasks } = await supabase.from('tasks').select('id').eq('user_id', userId).eq('completed', true);
  const { data: habits } = await supabase.from('habits').select('*').eq('user_id', userId);
  const { data: existingAchievements } = await supabase.from('achievements').select('achievement_key').eq('user_id', userId);

  const existingKeys = new Set(existingAchievements?.map(a => a.achievement_key) || []);
  const completedTaskCount = completedTasks?.length || 0;
  const maxHabitStreak = Math.max(0, ...(habits?.map(h => h.current_streak) || [0]));

  const toCheck: Array<{ key: AchievementKey; condition: boolean }> = [
    { key: 'first_task', condition: completedTaskCount >= 1 },
    { key: 'task_10', condition: completedTaskCount >= 10 },
    { key: 'task_100', condition: completedTaskCount >= 100 },
    { key: 'habit_7', condition: maxHabitStreak >= 7 },
    { key: 'habit_30', condition: maxHabitStreak >= 30 },
    { key: 'streak_7', condition: (user?.current_streak || 0) >= 7 },
    { key: 'level_5', condition: (user?.level || 0) >= 5 },
    { key: 'level_10', condition: (user?.level || 0) >= 10 },
  ];

  for (const check of toCheck) {
    if (check.condition && !existingKeys.has(check.key)) {
      await supabase.from('achievements').insert({ user_id: userId, achievement_key: check.key });
      newlyUnlocked.push(check.key);
    }
  }

  return newlyUnlocked;
}
