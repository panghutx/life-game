// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, DashboardData } from '../api/dashboard';
import LevelBadge from '../components/LevelBadge';
import Header from '../components/Header';

const ACHIEVEMENT_MAP: Record<string, { name: string; icon: string }> = {
  first_task: { name: '初出茅庐', icon: '🎯' },
  task_10: { name: '小有成就', icon: '🏆' },
  task_100: { name: '百炼成钢', icon: '💎' },
  habit_7: { name: '连续 7 天', icon: '🔥' },
  habit_30: { name: '坚持不懈', icon: '⚡' },
  streak_7: { name: '一周活跃', icon: '📅' },
  level_5: { name: '五级玩家', icon: '⭐' },
  level_10: { name: '十级玩家', icon: '🌟' },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dashboardApi.get().then(res => setData(res.data));
  }, []);

  if (!data) return <div className="loading">加载中...</div>;

  return (
    <div className="dashboard">
      <Header />

      <div className="welcome-header">
        <h1>欢迎回来, {data.user.username}</h1>
      </div>

      <LevelBadge
        level={data.user.level}
        xpProgress={data.xp_progress}
        xpNeeded={data.xp_needed}
        xpPercentage={data.xp_percentage}
      />

      <div className="streak-info">
        <span>🔥 连续活跃: <strong>{data.user.current_streak} 天</strong></span>
        <span>🏆 最高记录: <strong>{data.user.longest_streak} 天</strong></span>
      </div>

      <section className="quick-actions">
        <Link to="/tasks" className="action-btn"><span>📋</span>任务</Link>
        <Link to="/habits" className="action-btn"><span>✅</span>习惯</Link>
        <Link to="/achievements" className="action-btn"><span>🏅</span>成就</Link>
      </section>

      <section>
        <h2>今日任务</h2>
        {data.today_tasks.length === 0 ? (
          <p className="empty">暂无任务</p>
        ) : (
          <ul className="task-list">
            {data.today_tasks.slice(0, 5).map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <span>{task.title}</span>
                <span className="xp-badge">+{task.xp_reward} XP</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>习惯打卡</h2>
        {data.habits.length === 0 ? (
          <p className="empty">暂无习惯</p>
        ) : (
          <ul className="habit-list">
            {data.habits.map(habit => (
              <li key={habit.id}>
                <span>{habit.name}</span>
                <span className="xp-badge">🔥 {habit.current_streak} 天</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {data.recent_achievements.length > 0 && (
        <section>
          <h2>最近成就</h2>
          <div className="achievement-list">
            {data.recent_achievements.map(a => {
              const info = ACHIEVEMENT_MAP[a.achievement_key];
              return info ? (
                <span key={a.achievement_key} className="achievement-badge">
                  {info.icon} {info.name}
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}
    </div>
  );
}