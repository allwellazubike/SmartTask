import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, CheckCircle, Circle, Play } from 'lucide-react';
import api from '../api/axios';

interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  category?: string;
  priorityScore: number;
  breakdown?: Subtask[];
}

interface TaskCardProps {
  task: Task;
  onRefresh: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onRefresh }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  
  const hasBreakdown = task.breakdown && task.breakdown.length > 0;

  const handleComplete = async () => {
    // In a full app we'd have a route to complete it. Let's just mock logic here or ignore if route doesn't exist
    // await api.patch(`/tasks/${task.id}`, { is_completed: true });
    // onRefresh();
  };

  const handleBreakdown = async () => {
    if (hasBreakdown) {
      setIsExpanding(!isExpanding);
      return;
    }

    try {
      setLoadingBreakdown(true);
      await api.post(`/tasks/${task.id}/breakdown`);
      await onRefresh();
      setIsExpanding(true);
    } catch (error) {
      console.error('Breakdown failed', error);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4 shadow-sm transition-all hover:border-slate-600">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <button onClick={handleComplete} className="text-slate-400 hover:text-orange-500 mt-1 transition-colors">
            <Circle size={24} />
          </button>
          
          <div>
            <h3 className="text-lg font-medium text-cream">{task.title}</h3>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              {task.category && (
                <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-xs">
                  {task.category}
                </span>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="text-xs font-semibold text-orange-500/80">
                P-Score: {task.priorityScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBreakdown}
          disabled={loadingBreakdown}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
            ${hasBreakdown || isExpanding ? 'bg-slate-700 border-slate-600 text-cream' : 'bg-orange-600/10 border-orange-500/30 text-orange-500 hover:bg-orange-600 hover:text-white'}
          `}
        >
          {loadingBreakdown ? (
            <span className="animate-pulse">Analyzing...</span>
          ) : hasBreakdown ? (
            <>Breakdown {isExpanding ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</>
          ) : (
             <>
              <Play size={10} className="fill-current"/> Breakdown
             </>
          )}
        </button>
      </div>

      {(isExpanding && hasBreakdown) && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 pl-10">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Sub-Tasks</h4>
          <ul className="space-y-3">
            {task.breakdown?.map((subtask, idx) => (
              <li key={idx} className="flex gap-3 items-center text-sm text-slate-300">
                {subtask.completed ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-500" />
                )}
                <span className={subtask.completed ? "line-through text-slate-500" : ""}>{subtask.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
