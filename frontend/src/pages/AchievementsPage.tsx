// src/pages/AchievementsPage.tsx
import { useEffect, useState } from 'react';
import { achievementsApi, Achievement } from '../api/achievements';
import AchievementCard from '../components/AchievementCard';
import Header from '../components/Header';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    achievementsApi.getAll().then(res => setAchievements(res.data));
  }, []);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-page">
      <Header />

      <div className="page-header">
        <h1>成就</h1>
        <span className="achievement-count">{unlockedCount} / {achievements.length}</span>
      </div>

      <div className="tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button>
        <button className={filter === 'unlocked' ? 'active' : ''} onClick={() => setFilter('unlocked')}>已解锁</button>
        <button className={filter === 'locked' ? 'active' : ''} onClick={() => setFilter('locked')}>未解锁</button>
      </div>

      <div className="achievement-grid">
        {filtered.map(achievement => (
          <AchievementCard key={achievement.key} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}