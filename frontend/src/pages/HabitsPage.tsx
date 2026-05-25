// src/pages/HabitsPage.tsx
import { useEffect, useState } from 'react';
import { habitsApi, Habit } from '../api/habits';
import HabitCard from '../components/HabitCard';
import Header from '../components/Header';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', xp_reward: 5 });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    habitsApi.getAll().then(res => setHabits(res.data));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await habitsApi.create(newHabit);
    setNewHabit({ name: '', xp_reward: 5 });
    setShowForm(false);
    loadHabits();
  };

  const handleCheckin = async (id: string) => {
    try {
      const res = await habitsApi.checkin(id);
      alert(`打卡成功! +${res.data.xp_earned} XP! 连续 ${res.data.new_streak} 天`);
      loadHabits();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    await habitsApi.delete(id);
    loadHabits();
  };

  return (
    <div className="habits-page">
      <Header />

      <div className="page-header">
        <h1>习惯</h1>
        <button onClick={() => setShowForm(true)} className="header-btn">+ 新习惯</button>
      </div>

      {habits.length === 0 ? (
        <p className="empty">暂无习惯，创建一个吧！</p>
      ) : (
        <div className="habit-grid">
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} onCheckin={handleCheckin} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>新建习惯</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="习惯名称"
                value={newHabit.name}
                onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="XP 奖励"
                value={newHabit.xp_reward}
                onChange={e => setNewHabit({ ...newHabit, xp_reward: Number(e.target.value) })}
                min={1}
              />
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
