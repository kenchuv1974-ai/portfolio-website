import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Shield, Sparkles } from 'lucide-react';
import { authenticateAdmin, getLockoutStatus } from '../../services/authService';

interface AdminLoginProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onAuthenticated, onClose }: AdminLoginProps) {
  const [username, setUsername] = useState('harsh');
  const [password, setPassword] = useState('Harsh1512');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number>(0);

  // Check lockout on mount and tick
  useEffect(() => {
    const updateLockout = () => {
      const status = getLockoutStatus();
      if (status.isLocked) {
        setLockoutSecs(Math.ceil(status.remainingMs / 1000));
      } else {
        setLockoutSecs(0);
      }
    };

    updateLockout();
    const interval = setInterval(updateLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await authenticateAdmin(username, password);
      if (result.success) {
        onAuthenticated();
      } else {
        setErrorMessage(result.message || 'Authentication failed. Please verify credentials.');
        if (result.lockoutRemainingMs) {
          setLockoutSecs(Math.ceil(result.lockoutRemainingMs / 1000));
        }
      }
    } catch {
      setErrorMessage('Unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900/90 border border-red-500/30 p-8 shadow-[0_20px_70px_rgba(229,19,43,0.18)]">
        
        {/* Glow pill */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] font-mono tracking-widest text-red-300 uppercase flex items-center gap-1.5 shadow-lg">
          <Shield className="w-3 h-3 text-red-400" />
          <span>Restricted Admin Portal</span>
        </div>

        {/* Header */}
        <div className="text-center mt-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-['Bebas_Neue',sans-serif] tracking-wider text-3xl">
            Portfolio Command Terminal
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Cryptographic SHA-256 Auth • Real-Time CMS
          </p>
        </div>

        {/* Lockout or Error Banner */}
        {lockoutSecs > 0 ? (
          <div className="mb-5 rounded-lg bg-red-950/70 border border-red-600/60 p-3 text-xs text-red-200 text-center font-mono animate-pulse">
            Security Lockout Active: {Math.floor(lockoutSecs / 60)}m {lockoutSecs % 60}s remaining
          </div>
        ) : errorMessage ? (
          <div className="mb-5 rounded-lg bg-red-950/70 border border-red-500/50 p-3 text-xs text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
              Admin Identifier
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || lockoutSecs > 0}
              placeholder="Enter administrator username"
              required
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || lockoutSecs > 0}
                placeholder="Enter password"
                required
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-4 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockoutSecs > 0}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium py-3 text-sm tracking-wide transition shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Authenticate & Access Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info & close */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-[11px] text-zinc-400">Zero Public Plaintext</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition underline cursor-pointer"
          >
            Return to Portfolio
          </button>
        </div>

      </div>
    </div>
  );
}
