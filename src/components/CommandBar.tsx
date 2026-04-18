import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowUp } from 'lucide-react';
import api from '../api/axios';

interface CommandBarProps {
  onTaskCreated: () => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onTaskCreated }) => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    try {
      setLoading(true);
      await api.post('/tasks/parse', { command });
      setCommand('');
      onTaskCreated();
    } catch (error) {
      console.error('Failed to parse and create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center bg-[#0d121c]/95 backdrop-blur-3xl border border-slate-800/80 rounded-[30px] p-1.5 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5)] transition-all focus-within:border-orange-500/40"
    >
      <div className="pl-4 pr-1 text-orange-500 shrink-0">
        <Sparkles size={18} strokeWidth={2} />
      </div>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Type a task here..."
        className="flex-1 bg-transparent border-none outline-none text-cream placeholder-slate-500 py-3 px-2 focus:ring-0 font-light text-[15px]"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!command.trim() || loading}
        className="bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-600 text-white p-2.5 rounded-full transition-all shrink-0 ml-1 shadow-md active:scale-95 flex items-center justify-center mr-0.5"
        aria-label="Send Task"
      >
        {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <ArrowUp size={18} strokeWidth={3} />}
      </button>
    </form>
  );
};

export default CommandBar;
