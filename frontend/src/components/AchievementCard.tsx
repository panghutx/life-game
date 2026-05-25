// src/components/AchievementCard.tsx
import { Achievement } from '../api/achievements';

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
      <span className="achievement-icon">{achievement.icon}</span>
      <h3>{achievement.name}</h3>
      <p>{achievement.description}</p>
      {achievement.unlocked && achievement.unlocked_at && (
        <span className="unlock-date">
          解锁于 {new Date(achievement.unlocked_at).toLocaleDateString('zh-CN')}
        </span>
      )}
    </div>
  );
}