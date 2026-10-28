import React, { useEffect, useState, useId } from 'react';
import { Eye, EyeOff, Lock, Shield, Sparkles, AlertTriangle, Key, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { authenticateAdmin, getLockoutStatus } from '../../services/authService';

interface AdminLoginProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onAuthenticated, onClose }: AdminLoginProps) {
  // STRICT SECURITY: Start with completely blank credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [shake, setShake] = useState(false);

  // Dynamic mathematical verification challenge
  const [challenge, setChallenge] = useState(() => generateChallenge());

  const userFieldId = useId();
  const passFieldId = useId();
  const puzzleFieldId = useId();

  function generateChallenge() {
    const a = Math.floor(Math.random() * 9) + 3;
    const b = Math.floor(Math.random() * 8) + 2;
    return { a, b, answer: a + b };
  }

  const refreshChallenge = () => {
    setChallenge(generateChallenge());
    setSecurityAnswer('');
  };

  // Check lockout on mount and tick
  useEffect(() => {
    const updateLockout = () => {
      const status = getLockoutStatus();
      setAttemptsLeft(status.attemptsLeft);
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

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Bot honeypot verification
    if (honeypot) {
      setErrorMessage('Access denied.');
      triggerShake();
      return;
    }

    // Dynamic security challenge verification
    if (parseInt(securityAnswer.trim(), 10) !== challenge.answer) {
      setErrorMessage(`Security challenge incorrect. Solve verification puzzle: ${challenge.a} + ${challenge.b} = ?`);
      triggerShake();
      refreshChallenge();
      return;
    }

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both administrator ID and master security key.');
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const result = await authenticateAdmin(username, password);
      if (result.success) {
        onAuthenticated();
      } else {
        setErrorMessage(result.message || 'Access Denied: Cryptographic signature mismatch.');
        triggerShake();
        refreshChallenge();
        if (result.lockoutRemainingMs) {
          setLockoutSecs(Math.ceil(result.lockoutRemainingMs / 1000));
        } else {
          const status = getLockoutStatus();
          setAttemptsLeft(status.attemptsLeft);
        }
      }
    } catch {
      setErrorMessage('Unexpected cryptographic verification failure.');
      triggerShake();
      refreshChallenge();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-zinc-950/92 backdrop-blur-2xl transition-opacity animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-2xl bg-zinc-900/95 border border-red-500/30 p-7 shadow-[0_25px_80px_rgba(229,19,43,0.22)] transition-transform duration-200 ${
          shake ? 'translate-x-[-8px] animate-pulse' : ''
        }`}
      >
        {/* Glow pill */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-950/90 border border-red-500/50 text-[10px] font-mono tracking-widest text-red-300 uppercase flex items-center gap-1.5 shadow-lg">
          <Shield className="w-3 h-3 text-red-400" />
          <span>Restricted Admin Terminal</span>
        </div>

        {/* Header */}
        <div className="text-center mt-2 mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 mb-2.5 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-['Bebas_Neue',sans-serif] tracking-wider">
            Portfolio Command Terminal
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono flex items-center justify-center gap-2">
            <Cpu className="w-3 h-3 text-red-400" />
            <span>SHA-256 HMAC Authentication • Zero Plaintext</span>
          </p>
        </div>

        {/* Live Security Threat Telemetry Bar */}
        <div className="mb-4 rounded-xl bg-zinc-950/80 border border-zinc-800 p-2.5 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                lockoutSecs > 0
                  ? 'bg-red-500 animate-ping'
                  : attemptsLeft > 3
                  ? 'bg-emerald-400'
                  : attemptsLeft > 1
                  ? 'bg-amber-400'
                  : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className="text-zinc-400">
              {lockoutSecs > 0
                ? 'TERMINAL LOCKED'
                : attemptsLeft === 5
                ? 'SECURITY NORMAL'
                : `ALERT: ${attemptsLeft} TRIES REMAINING`}
            </span>
          </div>
          <div className="flex items-center gap-1 tracking-widest">
            {[1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`text-[9px] ${
                  idx <= attemptsLeft
                    ? attemptsLeft > 2
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                    : 'text-zinc-700'
                }`}
              >
                ●
              </span>
            ))}
          </div>
        </div>

        {/* Lockout or Error Banner */}
        {lockoutSecs > 0 ? (
          <div className="mb-4 rounded-xl bg-red-950/80 border border-red-600/70 p-3 text-xs text-red-200 text-center font-mono flex items-center justify-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              Security Lockout Active: {Math.floor(lockoutSecs / 60)}m {lockoutSecs % 60}s remaining
            </span>
          </div>
        ) : errorMessage ? (
          <div className="mb-4 rounded-xl bg-red-950/70 border border-red-500/50 p-3 text-xs text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
          {/* Honeypot field for anti-bot protection (hidden from humans) */}
          <input
            type="text"
            name="system_trap_field"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden pointer-events-none"
            autoComplete="off"
          />

          {/* Admin Identifier */}
          <div>
            <label
              htmlFor={userFieldId}
              className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1 flex items-center justify-between"
            >
              <span>Admin Identifier</span>
              <span className="text-[10px] text-zinc-500 lowercase font-sans">case-insensitive</span>
            </label>
            <div className="relative">
              <input
                id={userFieldId}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || lockoutSecs > 0}
                placeholder="Enter authorized administrator username"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-500 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-sans"
              />
            </div>
          </div>

          {/* Security Key / Password */}
          <div>
            <label
              htmlFor={passFieldId}
              className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1 flex items-center justify-between"
            >
              <span>Master Security Key</span>
              <span className="text-[10px] text-zinc-500 lowercase font-sans">encrypted</span>
            </label>
            <div className="relative">
              <input
                id={passFieldId}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || lockoutSecs > 0}
                placeholder="Enter master password"
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-500 px-3.5 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-sans tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Hide security key' : 'Show security key'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dynamic Verification Challenge Puzzle */}
          <div className="rounded-xl bg-zinc-950/70 border border-zinc-800/90 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={puzzleFieldId}
                className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 flex items-center gap-1.5"
              >
                <Key className="w-3 h-3 text-red-400" />
                <span>Security Check: {challenge.a} + {challenge.b} = ?</span>
              </label>
              <button
                type="button"
                onClick={refreshChallenge}
                tabIndex={-1}
                title="Regenerate verification check"
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>New</span>
              </button>
            </div>
            <input
              id={puzzleFieldId}
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              disabled={loading || lockoutSecs > 0}
              placeholder="Enter challenge sum"
              required
              autoComplete="off"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 focus:border-red-500 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || lockoutSecs > 0}
            className="w-full mt-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium py-3 text-sm tracking-wide transition shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
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
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-zinc-400">Zero Public Plaintext</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition underline cursor-pointer"
          >
            Cancel (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
