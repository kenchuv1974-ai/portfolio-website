import React, { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import type { Experience, PortfolioData } from '../../../types/portfolio';

interface ExperienceTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function ExperienceTab({ data, onChange, onShowConfirm }: ExperienceTabProps) {
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const expList = data.experience;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      onChange((prev) => ({
        ...prev,
        experience: [...prev.experience, editingItem],
      }));
    } else if (editIndex !== null) {
      onChange((prev) => {
        const next = [...prev.experience];
        next[editIndex] = editingItem;
        return { ...prev, experience: next };
      });
    }

    setEditingItem(null);
    setEditIndex(null);
    setIsCreating(false);
  };

  const handleDelete = (index: number, company: string) => {
    onShowConfirm('Delete Experience Record', `Remove "${company}" from experience records?`, () => {
      onChange((prev) => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index),
      }));
    });
  };

  const startCreate = () => {
    setEditingItem({
      company: 'Organization / Company Name',
      role: 'Role / Job Title',
      place: 'Location',
      period: 'Start – End',
      points: [
        'Implemented full-stack architecture and collaborated on core modules.',
      ],
    });
    setEditIndex(null);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
            Professional Experience & Internships ({expList.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Documented work history, technical roles, and key responsibilities.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {expList.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{item.company}</h4>
                  <span className="text-xs text-zinc-500 font-mono">• {item.place}</span>
                </div>
                <div className="text-sm font-mono text-red-400 font-semibold">{item.role}</div>
              </div>
              <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
                {item.period}
              </span>
            </div>

            <ul className="space-y-1.5 mb-4 pl-4 list-disc text-xs text-zinc-300 leading-relaxed">
              {item.points.map((pt, pIdx) => (
                <li key={pIdx}>{pt}</li>
              ))}
            </ul>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  setEditingItem({ ...item, points: [...item.points] });
                  setEditIndex(idx);
                  setIsCreating(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx, item.company)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
                {isCreating ? 'Add Experience' : 'Edit Experience'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Location / Place
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.place}
                    onChange={(e) => setEditingItem({ ...editingItem, place: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Time Period
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.period}
                    onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                    placeholder="May 2025 – June 2026"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Responsibilities & Impact (One bullet per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.points.join('\n')}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      points: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs font-mono"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
