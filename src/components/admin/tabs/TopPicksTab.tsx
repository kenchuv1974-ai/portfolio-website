import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, Flame, Plus, Trash2 } from 'lucide-react';
import type { Palette, PortfolioData, TopPick } from '../../../types/portfolio';

interface TopPicksTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const defaultPalette: Palette = {
  from: '#24060b',
  via: '#6e0d1d',
  to: '#09070a',
  accent: '#ff3d5a',
};

export default function TopPicksTab({ data, onChange, onShowConfirm }: TopPicksTabProps) {
  const [editingPick, setEditingPick] = useState<{ pick: TopPick; index: number; isNew: boolean } | null>(null);

  const picks = data.topPicks;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPick) return;

    onChange((prev) => {
      const next = [...prev.topPicks];
      if (editingPick.isNew) {
        next.push(editingPick.pick);
      } else {
        next[editingPick.index] = editingPick.pick;
      }
      return { ...prev, topPicks: next };
    });

    setEditingPick(null);
  };

  const handleDelete = (index: number, title: string) => {
    onShowConfirm('Delete Top Pick', `Remove "${title}" from Top Picks?`, () => {
      onChange((prev) => ({
        ...prev,
        topPicks: prev.topPicks.filter((_, i) => i !== index),
      }));
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= picks.length) return;

    const list = [...picks];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    onChange((prev) => ({ ...prev, topPicks: list }));
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Top Picks Row ({picks.length})</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ranked Top 10 carousel showcase with large ranking numerals (1, 2, 3...).
          </p>
        </div>

        <button
          onClick={() =>
            setEditingPick({
              isNew: true,
              index: picks.length,
              pick: {
                label: 'Highlight Label',
                title: 'Feature Title',
                detail: 'Detail description text',
                palette: defaultPalette,
              },
            })
          }
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Top Pick</span>
        </button>
      </div>

      <div className="space-y-3">
        {picks.map((pick, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black font-['Bebas_Neue',sans-serif] text-red-500 w-8 text-center shrink-0">
                #{idx + 1}
              </span>

              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                  {pick.label}
                </span>
                <h4 className="text-base font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide mt-1">
                  {pick.title}
                </h4>
                <p className="text-xs text-zinc-400">{pick.detail}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === picks.length - 1}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setEditingPick({ isNew: false, index: idx, pick: { ...pick, palette: { ...pick.palette } } })}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx, pick.title)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingPick && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {editingPick.isNew ? 'Add Top Pick' : 'Edit Top Pick'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPick(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Card Category Label
                </label>
                <input
                  type="text"
                  required
                  value={editingPick.pick.label}
                  onChange={(e) =>
                    setEditingPick({
                      ...editingPick,
                      pick: { ...editingPick.pick, label: e.target.value },
                    })
                  }
                  placeholder="e.g. Primary language"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Highlight Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPick.pick.title}
                  onChange={(e) =>
                    setEditingPick({
                      ...editingPick,
                      pick: { ...editingPick.pick, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-['Bebas_Neue',sans-serif] tracking-wide text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Detail Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingPick.pick.detail}
                  onChange={(e) =>
                    setEditingPick({
                      ...editingPick,
                      pick: { ...editingPick.pick, detail: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPick(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Pick
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
