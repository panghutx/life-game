// src/components/LevelBadge.tsx
interface LevelBadgeProps {
  level: number;
  xpProgress: number;
  xpNeeded: number;
  xpPercentage: number;
}

export default function LevelBadge({ level, xpProgress, xpNeeded, xpPercentage }: LevelBadgeProps) {
  return (
    <div className="level-badge">
      <div className="level-info">
        <span className="level-number">LV {level}</span>
        <span className="xp-text">{xpProgress} / {xpNeeded} XP</span>
      </div>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${xpPercentage}%` }} />
      </div>
    </div>
  );
}