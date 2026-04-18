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
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl font-light text-cream tracking-tight">
            Smart<span className="font-semibold text-orange-500">Task</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={logout}
          className="text-slate-400 hover:text-cream transition-colors p-2 rounded-full hover:bg-slate-800"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main>
        <CommandBar onTaskCreated={handleTaskCreated} />
        <FocusMode refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
};

export default Dashboard;
