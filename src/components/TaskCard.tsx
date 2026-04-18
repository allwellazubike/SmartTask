import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Play, CalendarDays } from 'lucide-react';
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
      onRefresh();
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
    <div className={`bg-[#0d121c] border border-slate-800/80 rounded-[20px] p-4 sm:p-5 transition-all duration-300 hover:border-slate-700/80 shadow-sm ${isCompleting ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
      
      {/* Top Row: Completion circle & Text Content */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3.5 flex-1 min-w-0">
          
          <button 
            onClick={handleComplete} 
            disabled={isCompleting}
            className="text-slate-600 hover:text-orange-500 mt-0.5 transition-all group shrink-0"
            aria-label="Complete Task"
          >
            <div className="relative">
              <Circle size={24} strokeWidth={1.5} className="group-hover:opacity-0 transition-opacity" />
              <CheckCircle size={24} strokeWidth={1.5} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
            </div>
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-medium text-cream tracking-tight leading-snug break-words">
              {task.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 font-light">
              {task.category && (
                <span className="bg-[#1a2133] border border-slate-700/50 text-slate-300 px-2.5 py-0.5 rounded-full font-medium shrink-0">
                  {task.category}
                </span>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1 opacity-80 shrink-0">
                  <CalendarDays size={13} />
                  <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              
              {/* Updated P-Rate Badge */}
              <div className="font-medium text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-md shrink-0 flex items-baseline gap-1.5 border border-orange-500/20">
                <span className="text-[9px] font-bold tracking-widest uppercase text-orange-500/80">P-Rate</span>
                <span>{task.priorityScore.toFixed(1)}</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Action Row: Break down button */}
      <div className="mt-4 flex justify-end pl-10 border-t border-slate-800/50 pt-3">
        <button 
          onClick={handleBreakdown}
          disabled={loadingBreakdown}
          className={`flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all w-full sm:w-auto
            ${hasBreakdown || isExpanding 
              ? 'bg-[#151c2b] text-slate-300 hover:text-cream' 
              : 'text-orange-400 bg-orange-500/5 hover:bg-orange-500/20 active:scale-95'
            }
          `}
        >
          {loadingBreakdown ? (
            <span className="animate-pulse">Synthesizing steps...</span>
          ) : hasBreakdown ? (
            <>Milestones {isExpanding ? <ChevronUp size={14} strokeWidth={2.5}/> : <ChevronDown size={14} strokeWidth={2.5}/>}</>
          ) : (
             <>
              <Play size={10} className="fill-current"/> Auto Break Down
             </>
          )}
        </button>
      </div>

      {/* AI Breakdown List */}
      {(isExpanding && hasBreakdown && task.breakdown) && (
        <div className="mt-4 pt-4 border-t border-slate-800/50 pl-2 pr-1 relative">
          <div className="absolute left-[20px] top-4 bottom-0 w-px bg-slate-800"></div>
          
          <ul className="space-y-4">
            {task.breakdown.map((subtask, idx) => (
              <li key={idx} className="flex gap-3.5 items-start text-[14px] font-light text-slate-400 group cursor-pointer hover:text-cream transition-colors">
                <div className="mt-0.5 relative z-10 bg-[#0d121c] rounded-full shrink-0">
                  {subtask.completed ? (
                    <CheckCircle size={16} className="text-orange-500" />
                  ) : (
                    <Circle size={16} className="text-slate-600 group-hover:text-orange-500" />
                  )}
                </div>
                <span className={`${subtask.completed ? "line-through text-slate-600" : ""} leading-snug pt-px`}>{subtask.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;