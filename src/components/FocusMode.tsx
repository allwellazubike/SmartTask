import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskCard, { Task } from './TaskCard';
import { Target, Loader2 } from 'lucide-react';

interface FocusModeProps {
  refreshTrigger: number;
}

const FocusMode: React.FC<FocusModeProps> = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/focus');
      // Only keep the top 3 items
      setTasks(res.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pl-2">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-[0_0_15px_-3px_rgba(234,88,12,0.5)]">
          <Target className="text-white" size={20} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-light text-cream">Hyper Focus</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500 opacity-50" size={32} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-800 rounded-3xl text-slate-500 font-light bg-slate-900/30">
          You have no active tasks. Enjoy your time!
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FocusMode;
