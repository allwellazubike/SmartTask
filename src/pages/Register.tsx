import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-cream tracking-tight mb-2">
            Smart<span className="font-semibold text-orange-500">Task</span>
          </h1>
          <p className="text-slate-500">Create your workspace.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-cream rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-cream rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-cream rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center mt-4"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-orange-500 hover:text-orange-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
