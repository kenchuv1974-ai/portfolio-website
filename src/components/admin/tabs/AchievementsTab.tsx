import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { Achievement, PortfolioData } from '../../../types/portfolio';

interface AchievementsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function AchievementsTab({ data, onChange, onShowConfirm }: AchievementsTabProps) {
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const achievements = data.achievements;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      onChange((prev) => ({
        ...prev,
        achievements: [...prev.achievements, editingItem],
      }));
    } else {
      onChange((prev) => ({
        ...prev,
        achievements: prev.achievements.map((a) => (a.id === editingItem.id ? editingItem : a)),
      }));
    }

    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    onShowConfirm('Delete Achievement', `Remove "${title}" from achievements?`, () => {
      onChange((prev) => ({
        ...prev,
        achievements: prev.achievements.filter((a) => a.id !== id),
      }));
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= achievements.length) return;

    const list = [...achievements];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    onChange((prev) => ({ ...prev, achievements: list }));
  };

  const startCreate = () => {
    const item: Achievement = {
      id: `achieve-${Date.now()}`,
      title: 'New Award Title',
      org: 'Awarding Organization',
      detail: 'Description of the competitive achievement or rank.',
      laurel: 'Distinction',
    };
    setEditingItem(item);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
            Moments & Honors ({achievements.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Rendered as award posters with laurels and verification links.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {item.laurel}
                </span>
                <span className="text-xs font-mono text-zinc-500">#{idx + 1}</span>
              </div>

              <h4 className="text-lg font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {item.title}
              </h4>
              <div className="text-xs font-mono text-red-400 mb-2">{item.org}</div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">{item.detail}</p>
              
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition"
                >
                  <ExternalLink className="w-3 h-3 text-red-400" />
                  <span>Verify Credential</span>
                </a>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-zinc-800/80">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === achievements.length - 1}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({ ...item });
                    setIsCreating(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-zinc-400" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {isCreating ? 'Add Achievement' : 'Edit Achievement'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Achievement Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Organization / Platform
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.org}
                    onChange={(e) => setEditingItem({ ...editingItem, org: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Laurel Badge Text
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.laurel}
                    onChange={(e) => setEditingItem({ ...editingItem, laurel: e.target.value })}
                    placeholder="e.g. Semi-Finalist"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Detail Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.detail}
                  onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Verification / Proof Link (URL)
                </label>
                <input
                  type="url"
                  value={editingItem.link || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
