import { useRef, useState } from 'react';
import {
  Code2,
  Download,
  FileCode,
  KeyRound,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import {
  exportBackup,
  exportSourceCodeFile,
  importBackup,
  saveToSourceCode,
} from '../../../services/storageService';
import {
  updateAdminCredentials,
  hasCustomCredentials,
  resetAdminCredentialsToDefault,
} from '../../../services/authService';
import type { PortfolioData, SiteSettings } from '../../../types/portfolio';

interface SettingsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export default function SettingsTab({
  data,
  onChange,
  onShowConfirm,
  onShowToast,
}: SettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCustomAuth, setIsCustomAuth] = useState(() => hasCustomCredentials());
  const [savingSource, setSavingSource] = useState(false);

  const updateSetting = (key: keyof SiteSettings, val: string) => {
    onChange((prev) => ({
      ...prev,
      siteSettings: {
        ...prev.siteSettings,
        [key]: val,
      },
    }));
  };

  const handleExport = () => {
    exportBackup(data);
    onShowToast('Backup Exported', 'Full portfolio JSON backup downloaded to your computer.', 'success');
  };

  const handleExportSource = () => {
    exportSourceCodeFile(data);
    onShowToast('Source Code Downloaded', 'Downloaded portfolio.ts file. Place it in src/data/ to commit permanently.', 'success');
  };

  const handleSaveToSource = async () => {
    setSavingSource(true);
    try {
      const res = await saveToSourceCode(data);
      if (res.success) {
        onShowToast('Source Code Saved!', 'Changes permanently written directly into src/data/portfolio.ts on disk!', 'success');
      } else {
        onShowToast('Static Hosting Notice', `${res.message}. Use "Download portfolio.ts" to save into your repo.`, 'info');
      }
    } catch (err: unknown) {
      onShowToast('Sync Notice', (err as Error).message, 'error');
    } finally {
      setSavingSource(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = importBackup(content);
      if (res.success && res.data) {
        onChange(() => res.data!);
        onShowToast('Backup Restored', 'Portfolio content successfully restored from backup JSON file!', 'success');
      } else {
        onShowToast('Import Error', res.error || 'Failed importing JSON.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      onShowToast('Validation Error', 'Administrator username cannot be blank.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      onShowToast('Validation Error', 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Validation Error', 'Passwords do not match.', 'error');
      return;
    }

    const res = await updateAdminCredentials('', newUsername, newPassword);
    if (res.success) {
      onShowToast('Security Updated', 'Administrator username and security key have been updated!', 'success');
      setIsCustomAuth(true);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      onShowToast('Update Failed', res.message, 'error');
    }
  };

  const handleResetCredentials = () => {
    onShowConfirm(
      'Reset Admin Credentials',
      'Revert administrator credentials back to initial system default?',
      () => {
        resetAdminCredentialsToDefault();
        setIsCustomAuth(false);
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        onShowToast('Credentials Reset', 'Admin credentials have been reset to default.', 'success');
      }
    );
  };

  const handleReset = () => {
    onShowConfirm(
      'Reset All Portfolio Defaults',
      'Are you sure you want to revert all portfolio data back to repository defaults? Any unpublished changes will be lost.',
      () => {
        localStorage.clear();
        window.location.reload();
      }
    );
  };

  const s = data.siteSettings;

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-500" />
          <span>Global Website & SEO Configuration</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Metadata, social sharing previews, copyright text, permanent source code synchronization, and backups.
        </p>
      </div>

      {/* SEO & Meta */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
        <h4 className="text-xs font-mono uppercase text-zinc-400">
          SEO & Browser Headers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
              <span>Browser Title Tag (Site Name on Top Tab)</span>
              <span className="text-[10px] text-zinc-500 lowercase">shown in browser tab</span>
            </label>
            <input
              type="text"
              value={s.siteTitle}
              onChange={(e) => updateSetting('siteTitle', e.target.value)}
              placeholder="e.g. Harsh — The Series"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Social Sharing Image (OG Image URL)
            </label>
            <input
              type="text"
              value={s.ogImage}
              onChange={(e) => updateSetting('ogImage', e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
            Meta Description (Search Engines & Previews)
          </label>
          <textarea
            rows={2}
            value={s.siteDescription}
            onChange={(e) => updateSetting('siteDescription', e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={s.copyrightText || ''}
              onChange={(e) => updateSetting('copyrightText', e.target.value)}
              placeholder="A DASARI ORIGINAL // ALL RIGHTS RESERVED"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Final CTA Section Headline
            </label>
            <input
              type="text"
              value={s.footerQuote || ''}
              onChange={(e) => updateSetting('footerQuote', e.target.value)}
              placeholder="TO BE CONTINUED…"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-['Bebas_Neue',sans-serif] tracking-wider text-lg"
            />
          </div>
        </div>
      </div>

      {/* Permanent Source Code Sync (NEW) */}
      <div className="rounded-2xl bg-zinc-900/60 border border-emerald-500/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono uppercase text-zinc-200">
              Permanent Source Code Synchronization (`src/data/portfolio.ts`)
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            Persistent On Disk
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Ensure your changes never revert on refresh. Write all portfolio details, photos, projects, and themes directly into the actual repository source code file (<code className="text-zinc-200 font-mono">src/data/portfolio.ts</code>) or download the updated source file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveToSource}
            disabled={savingSource}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSource ? 'Writing to Disk...' : 'Save Directly to Source Code (portfolio.ts)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportSource}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Download Updated `portfolio.ts`</span>
          </button>
        </div>
      </div>

      {/* Admin Security & Credentials Manager */}
      <div className="rounded-2xl bg-zinc-900/60 border border-red-500/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <h4 className="text-xs font-mono uppercase text-zinc-200">
              Admin Authentication & Security Credentials
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
            {isCustomAuth ? 'Custom Credentials Active' : 'Default Credentials'}
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Update the secret administrator username and password used to access this Command Terminal. Changes are hashed client-side with SHA-256 and salted, preventing any plaintext storage.
        </p>

        <form onSubmit={handleUpdateCredentials} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                New Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. harsh"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                New Master Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Security Credentials</span>
            </button>
            {isCustomAuth && (
              <button
                type="button"
                onClick={handleResetCredentials}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition cursor-pointer"
              >
                Reset Credentials to Factory Default
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Backup and Restore */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
        <h4 className="text-xs font-mono uppercase text-zinc-400">
          JSON Content Backup & Restore
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
          Download a complete snapshot of all portfolio content, including projects, achievements, skills, seasons, and profile settings. You can import this file anytime to restore your configuration across different devices or environments.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Backup (JSON)</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Restore From Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-300 text-xs font-medium flex items-center gap-2 transition cursor-pointer ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Factory Defaults</span>
          </button>
        </div>
      </div>

    </div>
  );
}
