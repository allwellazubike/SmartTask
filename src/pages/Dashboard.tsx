import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CommandBar from '../components/CommandBar';
import FocusMode from '../components/FocusMode';
import { LogOut, Home } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#06080d] relative overflow-hidden flex flex-col">
      {/* Dynamic ambient background tuned for mobile */}
      <div className="absolute top-[-5%] left-[-10%] w-[250px] h-[250px] bg-orange-600/10 rounded-full blur-[90px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col pb-24">
        
        {/* Header - Mobile Snappy */}
        <header className="flex justify-between items-center px-5 pt-8 pb-4">
          <div className="flex gap-3 items-center">
             <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[12px] shadow-[0_0_15px_-3px_rgba(234,88,12,0.4)] flex items-center justify-center">
              <Home size={18} className="text-white" strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-xl font-display font-medium text-cream tracking-tight leading-none">
                SmartTask
              </h1>
              <p className="text-[12px] text-slate-400 font-light mt-1 w-32 truncate">Hi, {user?.name}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0d121c] border border-slate-800 text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-colors shadow-sm"
            aria-label="Logout"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 mt-6">
          <FocusMode refreshTrigger={refreshTrigger} />
        </main>

        {/* Floating Command Bar at bottom for easy thumb access on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#06080d] via-[#06080d]/90 to-transparent z-50">
          <div className="max-w-lg mx-auto">
            <CommandBar onTaskCreated={handleTaskCreated} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
