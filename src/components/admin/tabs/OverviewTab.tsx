import {
  Award,
  CheckCircle2,
  Download,
  FileCode,
  FolderGit2,
  Globe,
  GraduationCap,
  Layers,
  Palette,
  RotateCcw,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import { exportSourceCodeFile } from '../../../services/storageService';
import type { PortfolioData } from '../../../types/portfolio';

interface OverviewTabProps {
  data: PortfolioData;
  onNavigateTab: (tabId: string) => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetClick: () => void;
  hasUnsaved: boolean;
}

export default function OverviewTab({
  data,
  onNavigateTab,
  onExport,
  onImportClick,
  onResetClick,
  hasUnsaved,
}: OverviewTabProps) {
  const totalEpisodes = data.seasons.reduce((acc, s) => acc + s.episodes.length, 0);
  const totalSkills = data.skillCategories.reduce((acc, c) => acc + c.skills.length, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-500/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Series CMS Active</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide text-3xl">
              Welcome back, Administrator
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Managing content for <span className="text-white font-semibold">{data.profile.displayName}</span> ({data.profile.role}). All edits remain in safe draft mode until published to the live site.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-mono border flex items-center gap-1.5 ${
                hasUnsaved
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                  : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{hasUnsaved ? 'Unpublished Changes' : 'Synced With Live'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('projects')}
          className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 hover:border-red-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Originals</span>
            <FolderGit2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-bold text-white font-['Bebas_Neue',sans-serif]">
            {data.projects.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Full-stack projects</div>
        </div>

        <div
          onClick={() => onNavigateTab('certifications')}
          className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 hover:border-red-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Certifications</span>
            <Award className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-bold text-white font-['Bebas_Neue',sans-serif]">
            {data.certifications.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Verified credentials</div>
        </div>

        <div
          onClick={() => onNavigateTab('skills')}
          className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 hover:border-red-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Skills</span>
            <Layers className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-bold text-white font-['Bebas_Neue',sans-serif]">
            {totalSkills}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Across {data.skillCategories.length} categories</div>
        </div>

        <div
          onClick={() => onNavigateTab('seasons')}
          className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 hover:border-red-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Journey</span>
            <GraduationCap className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-3xl font-bold text-white font-['Bebas_Neue',sans-serif]">
            {data.seasons.length} Seasons
          </div>
          <div className="text-xs text-zinc-500 mt-1">{totalEpisodes} Total episodes</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
          Quick Content Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('profile')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 text-left transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Hero & Profile</div>
              <div className="text-xs text-zinc-500">Name & headlines</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('theme')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-red-500/30 hover:bg-zinc-800/50 text-left transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">UI/UX & Colors</div>
              <div className="text-xs text-zinc-500">Theme, colors & cursor</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('projects')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 text-left transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Originals</div>
              <div className="text-xs text-zinc-500">Add & edit projects</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('achievements')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 text-left transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Achievements</div>
              <div className="text-xs text-zinc-500">Awards & ranks</div>
            </div>
          </button>
        </div>
      </div>

      {/* Safety & Backup Controls */}
      <div className="rounded-xl bg-zinc-900/30 border border-zinc-800/80 p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
          Data Management & Backup
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-md shadow-blue-950/40"
            title="Deploy changes live to all computers via GitHub API"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Deploy Worldwide (GitHub Sync)</span>
          </button>

          <button
            onClick={onExport}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => exportSourceCodeFile(data)}
            className="px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-300 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            title="Download the actual portfolio.ts source code file"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Source Code (portfolio.ts)</span>
          </button>

          <button
            onClick={onImportClick}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup (JSON)</span>
          </button>

          <button
            onClick={onResetClick}
            className="px-4 py-2 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-300 text-xs font-medium flex items-center gap-2 transition cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>
      </div>

    </div>
  );
}
