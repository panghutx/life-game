// src/pages/TasksPage.tsx
import { useEffect, useState } from 'react';
import { tasksApi, Task } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import Header from '../components/Header';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', xp_reward: 10, due_date: '', repeat_rule: 'none' });
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    tasksApi.getAll().then(res => setTasks(res.data));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await tasksApi.create(newTask);
    setNewTask({ title: '', description: '', xp_reward: 10, due_date: '', repeat_rule: 'none' });
    setShowForm(false);
    loadTasks();
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await tasksApi.complete(id);
      alert(`+${res.data.xp_earned} XP! ${res.data.leveled_up ? `升级到 LV ${res.data.new_level}!` : ''}`);
      loadTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    await tasksApi.delete(id);
    loadTasks();
  };

  const filteredTasks = tasks.filter(t => tab === 'active' ? !t.completed : t.completed);

  return (
    <div className="tasks-page">
      <Header />

      <div className="page-header">
        <h1>任务</h1>
        <button onClick={() => setShowForm(true)} className="header-btn">+ 新任务</button>
      </div>

      <div className="tabs">
        <button className={tab === 'active' ? 'active' : ''} onClick={() => setTab('active')}>待完成</button>
        <button className={tab === 'completed' ? 'active' : ''} onClick={() => setTab('completed')}>已完成</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">暂无任务</p>
      ) : (
        <div className="task-grid">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>新建任务</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="任务名称"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="描述（可选）"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="XP 奖励"
                value={newTask.xp_reward}
                onChange={e => setNewTask({ ...newTask, xp_reward: Number(e.target.value) })}
                min={1}
              />
              <input
                type="date"
                value={newTask.due_date}
                onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
              />
              <select
                value={newTask.repeat_rule}
                onChange={e => setNewTask({ ...newTask, repeat_rule: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--foreground)',
                  fontSize: '16px'
                }}
              >
                <option value="none">不重复</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>取消</button>
                <button type="submit">创建</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
