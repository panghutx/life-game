// src/components/TaskCard.tsx
import { Task } from '../api/tasks';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-info">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className="xp-badge">+{task.xp_reward} XP</span>
          {task.due_date && <span className="due-date">📅 {task.due_date}</span>}
          {task.repeat_rule !== 'none' && (
            <span className="xp-badge" style={{ background: 'var(--accent-secondary)', color: '#000' }}>
              {task.repeat_rule === 'daily' ? '🔄 每天' : '📆 每周'}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        {!task.completed && (
          <button onClick={() => onComplete(task.id)} className="complete-btn">完成</button>
        )}
        <button onClick={() => onDelete(task.id)} className="delete-btn">删除</button>
      </div>
    </div>
  );
}
