import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] flex flex-col relative overflow-hidden selection:bg-orange-500/30">
      {/* Mobile Ambient Glow Engine */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-orange-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-20%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-end px-6 pb-12 z-10 sm:justify-center max-w-md mx-auto w-full pt-20">
        {/* Header Section (Mobile Optimized) */}
        <div className="mb-10 sm:mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-[0_0_30px_-5px_rgba(234,88,12,0.4)] flex items-center justify-center">
            <span className="text-white font-display font-medium text-3xl">
              S
            </span>
          </div>
          <h1 className="text-4xl font-light text-cream tracking-tight mb-3">
            Welcome <br />
            <span className="font-medium bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Back.
            </span>
          </h1>
          <p className="text-slate-400 font-light text-[15px] leading-relaxed">
            Sign in to access your intelligent focus workspace.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-3 backdrop-blur-md">
            <span>{error}</span>
          </div>
        )}

        {/* Mobile Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 text-slate-500 left-4 flex items-center text-xs font-semibold tracking-wider pointer-events-none uppercase">
              ID
            </div>
            <input
              type="email"
              required
              className="w-full bg-[#0d121c]/80 backdrop-blur-xl border border-slate-800/80 text-cream rounded-[20px] pl-14 pr-5 py-4 focus:outline-none focus:border-orange-500/50 focus:bg-[#121926] transition-all font-light text-[16px] placeholder-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 text-slate-500 left-4 flex items-center text-xs font-semibold tracking-wider pointer-events-none uppercase">
              PW
            </div>
            <input
              type="password"
              required
              className="w-full bg-[#0d121c]/80 backdrop-blur-xl border border-slate-800/80 text-cream rounded-[20px] pl-14 pr-5 py-4 focus:outline-none focus:border-orange-500/50 focus:bg-[#121926] transition-all font-light text-[16px] placeholder-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-cream text-slate-900 active:scale-[0.98] hover:bg-white font-medium py-4 rounded-[20px] transition-all flex justify-center items-center gap-3 mt-4 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
          >
            <span className="text-[16px]">
              {loading ? "Authenticating..." : "Sign In"}
            </span>
            {loading ? (
              <Loader2 size={18} className="animate-spin text-slate-600" />
            ) : (
              <ArrowRight size={18} className="text-slate-600" />
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-[15px] mt-8 font-light">
          No account?{" "}
          <Link
            to="/register"
            className="text-cream font-medium hover:text-orange-400 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
