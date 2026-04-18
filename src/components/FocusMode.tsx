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
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-orange-500" size={20} strokeWidth={2.5} />
        <h2 className="text-lg font-medium tracking-tight text-cream">Hyper Focus</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500 opacity-50" size={28} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800/80 rounded-[20px] text-slate-500 font-light text-[15px] bg-[#0d121c]/30 mx-2">
          You have no active tasks.<br/>Enjoy your time!
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FocusMode;
