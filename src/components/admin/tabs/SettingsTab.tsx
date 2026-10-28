import { useRef } from 'react';
import { Download, RotateCcw, Settings, Upload } from 'lucide-react';
import { exportBackup, importBackup } from '../../../services/storageService';
import type { PortfolioData, SiteSettings } from '../../../types/portfolio';

interface SettingsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error') => void;
}

export default function SettingsTab({
  data,
  onChange,
  onShowConfirm,
  onShowToast,
}: SettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          Metadata, social sharing previews, copyright text, and full backup management.
        </p>
      </div>

      {/* SEO & Meta */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
        <h4 className="text-xs font-mono uppercase text-zinc-400">
          SEO & Browser Headers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Browser Title Tag
            </label>
            <input
              type="text"
              value={s.siteTitle}
              onChange={(e) => updateSetting('siteTitle', e.target.value)}
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
