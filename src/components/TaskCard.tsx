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
  const [isCompleting, setIsCompleting] = useState(false);
  
  const hasBreakdown = task.breakdown && task.breakdown.length > 0;

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await api.patch(`/tasks/${task.id}/complete`);
      onRefresh(); // Should pull the refreshed list from /focus which filters completed
    } catch (error) {
      console.error('Failed to complete task', error);
      setIsCompleting(false);
    }
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
    <div className={`bg-[#0a0e17] border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-0.5 ${isCompleting ? 'opacity-50 scale-[0.98]' : 'opacity-100'}`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-5">
          <button 
            onClick={handleComplete} 
            disabled={isCompleting}
            className="text-slate-600 hover:text-green-500 mt-1 transition-all group"
          >
            <Circle size={26} strokeWidth={1.5} className="group-hover:opacity-0 absolute transition-opacity" />
            <CheckCircle size={26} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div>
            <h3 className="text-xl font-medium text-cream tracking-tight leading-snug">{task.title}</h3>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-light">
              {task.category && (
                <span className="bg-[#111827] border border-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                  {task.category}
                </span>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1.5 opacity-80">
                  <Calendar size={14} />
                  <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              <div className="text-xs font-semibold text-orange-500 bg-orange-600/10 px-2 py-1 rounded-md">
                Score: {task.priorityScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBreakdown}
          disabled={loadingBreakdown}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all
            ${hasBreakdown || isExpanding 
              ? 'bg-slate-800 text-cream hover:bg-slate-700' 
              : 'text-orange-500 hover:bg-orange-500/10 active:scale-95'
            }
          `}
        >
          {loadingBreakdown ? (
            <span className="animate-pulse">Synthesizing...</span>
          ) : hasBreakdown ? (
            <>Breakdown {isExpanding ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</>
          ) : (
             <>
              <Play size={12} className="fill-current"/> Split Task
             </>
          )}
        </button>
      </div>

      {(isExpanding && hasBreakdown && task.breakdown) && (
        <div className="mt-6 pt-6 border-t border-slate-800 pl-12 pr-4 relative">
          <div className="absolute left-[29px] top-6 bottom-0 w-px bg-slate-800"></div>
          <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-4">Milestones</h4>
          <ul className="space-y-4">
            {task.breakdown.map((subtask, idx) => (
              <li key={idx} className="flex gap-4 items-start text-sm font-light text-slate-400 group cursor-pointer hover:text-cream transition-colors">
                <div className="mt-0.5 relative z-10 bg-[#0a0e17] rounded-full">
                  {subtask.completed ? (
                    <CheckCircle size={18} className="text-orange-500" />
                  ) : (
                    <Circle size={18} className="text-slate-700 group-hover:text-orange-500" />
                  )}
                </div>
                <span className={`${subtask.completed ? "line-through text-slate-600" : ""} leading-relaxed`}>{subtask.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
