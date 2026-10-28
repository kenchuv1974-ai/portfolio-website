import { useState } from 'react';
import { Film, Plus, Trash2 } from 'lucide-react';
import type { Episode, Palette, PortfolioData, Season } from '../../../types/portfolio';

interface SeasonsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const defaultPalette: Palette = {
  from: '#120822',
  via: '#3d1a6e',
  to: '#07060c',
  accent: '#b98bff',
};

export default function SeasonsTab({ data, onChange, onShowConfirm }: SeasonsTabProps) {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const [editingEpisode, setEditingEpisode] = useState<{ ep: Episode; isNew: boolean; index?: number } | null>(null);

  const seasons = data.seasons;
  const currentSeason = seasons[activeSeasonIdx] || seasons[0];

  const updateSeasonField = (field: keyof Season, val: unknown) => {
    onChange((prev) => {
      const next = [...prev.seasons];
      next[activeSeasonIdx] = { ...next[activeSeasonIdx], [field]: val };
      return { ...prev, seasons: next };
    });
  };

  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode || !currentSeason) return;

    onChange((prev) => {
      const nextSeasons = [...prev.seasons];
      const targetSeason = { ...nextSeasons[activeSeasonIdx] };
      let nextEpisodes = [...targetSeason.episodes];

      if (editingEpisode.isNew) {
        nextEpisodes.push(editingEpisode.ep);
      } else if (editingEpisode.index !== undefined) {
        nextEpisodes[editingEpisode.index] = editingEpisode.ep;
      }

      targetSeason.episodes = nextEpisodes;
      nextSeasons[activeSeasonIdx] = targetSeason;
      return { ...prev, seasons: nextSeasons };
    });

    setEditingEpisode(null);
  };

  const handleDeleteEpisode = (index: number, title: string) => {
    onShowConfirm('Delete Episode', `Remove episode "${title}"?`, () => {
      onChange((prev) => {
        const nextSeasons = [...prev.seasons];
        const targetSeason = { ...nextSeasons[activeSeasonIdx] };
        targetSeason.episodes = targetSeason.episodes.filter((_, idx) => idx !== index);
        nextSeasons[activeSeasonIdx] = targetSeason;
        return { ...prev, seasons: nextSeasons };
      });
    });
  };

  const handleAddSeason = () => {
    const nextNum = seasons.length + 1;
    const newSeason: Season = {
      number: nextNum,
      title: `Season ${nextNum}`,
      period: 'Now Streaming',
      synopsis: 'Summary of this milestone arc.',
      episodes: [
        {
          code: `S0${nextNum} E01`,
          title: 'New Episode',
          description: 'Key milestone description.',
          tags: ['Milestone'],
          runtime: 'Current',
          palette: defaultPalette,
        },
      ],
    };

    onChange((prev) => ({
      ...prev,
      seasons: [...prev.seasons, newSeason],
    }));
    setActiveSeasonIdx(seasons.length);
  };

  const handleDeleteSeason = (sIndex: number, title: string) => {
    onShowConfirm('Delete Season', `Remove "${title}" and all its episodes?`, () => {
      onChange((prev) => {
        const next = prev.seasons.filter((_, i) => i !== sIndex);
        return { ...prev, seasons: next };
      });
      setActiveSeasonIdx(Math.max(0, sIndex - 1));
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Seasons Selector Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {seasons.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSeasonIdx(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer shrink-0 border ${
                activeSeasonIdx === idx
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Season {s.number} ({s.episodes.length} Eps)
            </button>
          ))}
        </div>

        <button
          onClick={handleAddSeason}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Season</span>
        </button>
      </div>

      {currentSeason && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6">
          
          {/* Season Details */}
          <div className="space-y-4 pb-4 border-b border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Season Number
                </label>
                <input
                  type="number"
                  value={currentSeason.number}
                  onChange={(e) => updateSeasonField('number', parseInt(e.target.value, 10))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Season Title
                </label>
                <input
                  type="text"
                  value={currentSeason.title}
                  onChange={(e) => updateSeasonField('title', e.target.value)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Time Period
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentSeason.period}
                    onChange={(e) => updateSeasonField('period', e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                  {seasons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSeason(activeSeasonIdx, currentSeason.title)}
                      className="p-2 rounded-xl bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/40 transition cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Season Arc Synopsis
              </label>
              <textarea
                rows={2}
                value={currentSeason.synopsis}
                onChange={(e) => updateSeasonField('synopsis', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Episodes list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-red-400" />
                <span>Episodes in Season {currentSeason.number}</span>
              </h4>

              <button
                type="button"
                onClick={() =>
                  setEditingEpisode({
                    isNew: true,
                    ep: {
                      code: `S0${currentSeason.number} E0${currentSeason.episodes.length + 1}`,
                      title: 'Episode Title',
                      description: 'Episode summary description.',
                      tags: ['Tag'],
                      runtime: '2026',
                      palette: defaultPalette,
                    },
                  })
                }
                className="text-xs text-red-400 hover:text-red-300 font-mono uppercase flex items-center gap-1 cursor-pointer"
              >
                + Add Episode
              </button>
            </div>

            <div className="space-y-3">
              {currentSeason.episodes.map((ep, epIdx) => (
                <div
                  key={epIdx}
                  className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="px-2 py-1 rounded bg-zinc-900 text-red-400 font-mono text-xs font-bold shrink-0 border border-zinc-800">
                      {ep.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{ep.title}</span>
                        <span className="text-xs text-zinc-500 font-mono">• {ep.runtime}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{ep.description}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {ep.tags.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setEditingEpisode({ isNew: false, ep: { ...ep, tags: [...ep.tags] }, index: epIdx })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEpisode(epIdx, ep.title)}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Episode Edit Modal */}
      {editingEpisode && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {editingEpisode.isNew ? 'Add Episode' : 'Edit Episode'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEpisode(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Episode Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEpisode.ep.code}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        ep: { ...editingEpisode.ep, code: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Runtime / Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEpisode.ep.runtime}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        ep: { ...editingEpisode.ep, runtime: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Episode Title
                </label>
                <input
                  type="text"
                  required
                  value={editingEpisode.ep.title}
                  onChange={(e) =>
                    setEditingEpisode({
                      ...editingEpisode,
                      ep: { ...editingEpisode.ep, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Synopsis Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingEpisode.ep.description}
                  onChange={(e) =>
                    setEditingEpisode({
                      ...editingEpisode,
                      ep: { ...editingEpisode.ep, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={editingEpisode.ep.tags.join(', ')}
                  onChange={(e) =>
                    setEditingEpisode({
                      ...editingEpisode,
                      ep: {
                        ...editingEpisode.ep,
                        tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEpisode(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
