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
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500/20 p-2 rounded-lg">
          <Target className="text-orange-500" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-cream">Focus Mode</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-slate-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl text-slate-500">
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
