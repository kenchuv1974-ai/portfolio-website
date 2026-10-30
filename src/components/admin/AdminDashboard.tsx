import { useState } from 'react';
import {
  Award,
  Briefcase,
  Eye,
  Film,
  Flame,
  FolderGit2,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  PlaySquare,
  Save,
  Send,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { logoutAdmin } from '../../services/authService';
import ConfirmModal from './ConfirmModal';
import AchievementsTab from './tabs/AchievementsTab';
import CertificationsTab from './tabs/CertificationsTab';
import EducationTab from './tabs/EducationTab';
import ExperienceTab from './tabs/ExperienceTab';
import IntroSlidesTab from './tabs/IntroSlidesTab';
import MediaTab from './tabs/MediaTab';
import OverviewTab from './tabs/OverviewTab';
import ProfileTab from './tabs/ProfileTab';
import ProjectsTab from './tabs/ProjectsTab';
import SeasonsTab from './tabs/SeasonsTab';
import SettingsTab from './tabs/SettingsTab';
import SkillsTab from './tabs/SkillsTab';
import ThemeTab from './tabs/ThemeTab';
import TopPicksTab from './tabs/TopPicksTab';
import ViewerProfilesTab from './tabs/ViewerProfilesTab';
import ToastNotification, { type ToastMessage } from './ToastNotification';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile & Hero', icon: User },
  { id: 'theme', label: 'UI / UX & Colors', icon: Palette },
  { id: 'projects', label: 'Originals (Projects)', icon: FolderGit2 },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'skills', label: 'Skills & Tech', icon: Layers },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'seasons', label: 'Journey & Seasons', icon: Film },
  { id: 'picks', label: 'Top Picks (Top 10)', icon: Flame },
  { id: 'slides', label: 'Intro Slides', icon: PlaySquare },
  { id: 'profiles', label: 'Viewer Profiles', icon: Users },
  { id: 'media', label: 'Media Storage', icon: ImageIcon },
  { id: 'settings', label: 'Site Settings & Backup', icon: Settings },
];

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    draftData,
    setDraftData,
    saveDraft,
    publish,
    hasUnsaved,
    closeAdmin,
    isDraftPreview,
    toggleDraftPreview,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveDraft = () => {
    const success = saveDraft();
    if (success) {
      showToast('Draft Saved', 'All changes have been saved to draft storage.', 'success');
    } else {
      showToast('Save Failed', 'Unable to persist draft data to local storage.', 'error');
    }
  };

  const handlePublish = async () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Publish Live to Website Worldwide?',
      message:
        'This will immediately update all public-facing content across all devices worldwide and commit directly to the live repository. Are you ready to deploy live?',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('Publishing...', 'Saving changes and syncing live worldwide...', 'info');
        const res = await publish((status) => {
          showToast('Worldwide Sync', status, 'info');
        });
        if (res.success) {
          if (res.cloudSynced) {
            showToast('Published Worldwide! 🚀', 'Your updates are now live across all devices worldwide!', 'success');
          } else {
            showToast('Published Locally', 'Changes saved to this browser. Add GitHub token in Settings for 1-click live sync across all devices.', 'success');
          }
        } else {
          showToast('Publish Failed', 'Failed to update live website data.', 'error');
        }
      },
    });
  };

  const handleLogout = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Log Out of Admin Terminal?',
      message: 'You will need to enter your admin security key to return to this dashboard.',
      onConfirm: () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        logoutAdmin();
        onLogout();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[998] flex flex-col bg-zinc-950 text-zinc-100 font-sans select-none overflow-hidden">
      
      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header Bar */}
      <header className="h-16 px-4 md:px-6 bg-zinc-900/90 border-b border-zinc-800/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Mobile hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-['Bebas_Neue',sans-serif] tracking-wider text-xl leading-none text-white">
                PORTFOLIO OS // CMS
              </div>
              <div className="text-[10px] font-mono text-zinc-400 tracking-wider">
                ADMIN: HARSHITH V • AUTHENTICATED
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                hasUnsaved ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className={hasUnsaved ? 'text-amber-300' : 'text-emerald-300'}>
              {hasUnsaved ? 'Unsaved Draft' : 'Published Live'}
            </span>
          </div>

          {/* Preview Draft Toggle */}
          <button
            type="button"
            onClick={() => {
              toggleDraftPreview();
              showToast(
                isDraftPreview ? 'Viewing Published' : 'Draft Preview Enabled',
                isDraftPreview
                  ? 'Public site now displays live published data.'
                  : 'Public site now previews your unsaved draft data in real-time!',
                'info'
              );
            }}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase transition cursor-pointer border ${
              isDraftPreview
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isDraftPreview ? 'Draft Preview ON' : 'Preview Draft'}</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold uppercase tracking-wider transition cursor-pointer border border-zinc-700"
          >
            <Save className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Publish Live */}
          <button
            type="button"
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-950"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </button>

          {/* View Public Site */}
          <button
            type="button"
            onClick={closeAdmin}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-800"
            title="Close Admin Panel & Return to Public Site"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 text-red-400 transition cursor-pointer"
            title="Lock & Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main body: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar */}
        <aside
          className={`absolute md:static inset-y-0 left-0 w-64 border-r border-zinc-800/80 bg-zinc-950/95 md:bg-zinc-950/70 backdrop-blur-xl p-3 flex flex-col justify-between shrink-0 z-10 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Content Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950/60'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 px-3 flex items-center justify-between">
            <span>Antigravity CMS v3.0</span>
            <span className="text-emerald-400">● Online</span>
          </div>
        </aside>

        {/* Center Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950/40">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab
                data={draftData}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onExport={() => showToast('Backup', 'Backup exported.', 'info')}
                onImportClick={() => setActiveTab('settings')}
                onResetClick={() => setActiveTab('settings')}
                hasUnsaved={hasUnsaved}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                data={draftData}
                onChange={setDraftData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'theme' && (
              <ThemeTab
                data={draftData}
                onChange={setDraftData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'skills' && (
              <SkillsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'education' && (
              <EducationTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'seasons' && (
              <SeasonsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'picks' && (
              <TopPicksTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'slides' && (
              <IntroSlidesTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
              />
            )}

            {activeTab === 'profiles' && (
              <ViewerProfilesTab
                data={draftData}
                onChange={setDraftData}
              />
            )}

            {activeTab === 'media' && (
              <MediaTab
                data={draftData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                data={draftData}
                onChange={setDraftData}
                onShowConfirm={(title, msg, onConfirm) =>
                  setConfirmConfig({ isOpen: true, title, message: msg, onConfirm })
                }
                onShowToast={showToast}
              />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}
