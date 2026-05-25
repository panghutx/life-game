// src/components/HabitCard.tsx
import { Habit } from '../api/habits';

interface HabitCardProps {
  habit: Habit;
  onCheckin: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onCheckin, onDelete }: HabitCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = habit.last_check_in === today;

  return (
    <div className={`habit-card ${checkedInToday ? 'checked-in' : ''}`}>
      <div className="habit-info">
        <h3>{habit.name}</h3>
        <div className="streak-display">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{habit.current_streak}</span>
          <span className="streak-label">天</span>
        </div>
        <span className="xp-badge">+{habit.xp_reward} XP/次</span>
      </div>
      <div className="habit-actions">
        {!checkedInToday && (
          <button onClick={() => onCheckin(habit.id)} className="checkin-btn">打卡</button>
        )}
        {checkedInToday && <span className="checked-label">✓ 已打卡</span>}
        <button onClick={() => onDelete(habit.id)} className="delete-btn">删除</button>
      </div>
    </div>
  );
}
