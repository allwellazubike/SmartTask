import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
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
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors rounded-xl overflow-hidden p-2">
        <div className="pl-3 pr-2 text-slate-500">
          <Sparkles size={20} />
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="e.g. 'Submit SE assignment to portal by 4pm Friday'"
          className="flex-1 bg-transparent border-none outline-none text-cream placeholder-slate-500 py-3 px-2 focus:ring-0"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!command.trim() || loading}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center shrink-0 ml-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default CommandBar;
