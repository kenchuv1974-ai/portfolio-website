import { useState } from 'react';
import { ArrowDown, ArrowUp, Users } from 'lucide-react';
import type { PortfolioData, SectionId, ViewerProfile } from '../../../types/portfolio';

interface ViewerProfilesTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

const SECTION_LABELS: Record<SectionId, string> = {
  about: 'About (The Pilot)',
  journey: 'Journey (Seasons & Episodes)',
  originals: 'Originals (Projects & Modals)',
  picks: 'Top Picks (Ranked Top 10)',
  skills: 'Skills (Interactive Genres)',
  moments: 'Moments (Achievements & Certs)',
  story: 'Resume (Interactive Sheet & PDF)',
};

export default function ViewerProfilesTab({ data, onChange }: ViewerProfilesTabProps) {
  const [activeProfileId, setActiveProfileId] = useState<string>(data.viewerProfiles[0]?.id || 'sushmita');

  const profiles = data.viewerProfiles;
  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const updateProfileField = (field: keyof ViewerProfile, val: unknown) => {
    onChange((prev) => ({
      ...prev,
      viewerProfiles: prev.viewerProfiles.map((p) =>
        p.id === currentProfile.id ? { ...p, [field]: val } : p
      ),
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentProfile.order.length) return;

    const list = [...currentProfile.order];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    updateProfileField('order', list);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Users className="w-4 h-4 text-red-500" />
          <span>"Who's Watching?" Viewer Profiles</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Controls the visitor experience. Different viewer profiles dynamically rearrange portfolio sections to match the audience (Recruiters, Developers, Creatives).
        </p>
      </div>

      {/* Profile Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProfileId(p.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer shrink-0 border flex items-center gap-2 ${
              currentProfile.id === p.id
                ? 'bg-zinc-800 text-white border-red-500 shadow-md'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Active profile editor */}
      {currentProfile && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-zinc-800">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Profile Display Name
              </label>
              <input
                type="text"
                value={currentProfile.name}
                onChange={(e) => updateProfileField('name', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Role / Target Blurb
              </label>
              <input
                type="text"
                value={currentProfile.blurb}
                onChange={(e) => updateProfileField('blurb', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Profile Avatar Color
              </label>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5">
                <input
                  type="color"
                  value={currentProfile.color}
                  onChange={(e) => updateProfileField('color', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-zinc-300">{currentProfile.color}</span>
              </div>
            </div>
          </div>

          {/* Section Order Reordering */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase text-zinc-400">
                Section Display Order for {currentProfile.name}
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">
                Use arrows to adjust hierarchy
              </span>
            </div>

            <div className="space-y-2">
              {currentProfile.order.map((secId, idx) => (
                <div
                  key={secId}
                  className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 flex items-center justify-between hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono text-xs text-red-500 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-zinc-200">
                      {SECTION_LABELS[secId] || secId}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      #{secId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === currentProfile.order.length - 1}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
