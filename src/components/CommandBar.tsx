import React, { useState } from 'react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import api from '../api/axios';

interface CommandBarProps {
  onTaskCreated: () => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onTaskCreated }) => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="relative group max-w-3xl mx-auto mb-16">
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-orange-600/30 to-orange-400/30 rounded-2xl blur-md transition duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center bg-[#0a0e17] border border-slate-800 rounded-2xl overflow-hidden p-2 transition-all shadow-2xl"
      >
        <div className="pl-5 pr-3 text-orange-500">
          <Sparkles size={20} strokeWidth={1.5} />
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g. 'Submit SE assignment to portal by 4pm Friday'"
          className="flex-1 bg-transparent border-none outline-none text-cream placeholder-slate-600 py-4 px-2 focus:ring-0 font-light text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!command.trim() || loading}
          className="bg-cream hover:bg-white disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 p-3.5 rounded-xl transition-all flex items-center justify-center shrink-0 ml-2 mx-1 shadow-md"
        >
          {loading ? <Loader2 size={20} className="animate-spin text-slate-600" /> : <Plus size={20} strokeWidth={2.5} />}
        </button>
      </form>
    </div>
  );
};

export default CommandBar;
