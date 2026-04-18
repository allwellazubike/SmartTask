import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CommandBar from '../components/CommandBar';
import FocusMode from '../components/FocusMode';
import { LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#05080f] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[20%] w-[800px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <header className="flex justify-between items-center mb-20 border-b border-slate-800/50 pb-8">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-cream">
              Smart<span className="text-orange-500 font-semibold">Task</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-light">Welcome back, {user?.name}</p>
          </div>
          <button 
            onClick={logout}
            className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cream transition-all px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/50"
          >
            Sign Out
            <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </header>

        <main className="space-y-16">
          <CommandBar onTaskCreated={handleTaskCreated} />
          <FocusMode refreshTrigger={refreshTrigger} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
