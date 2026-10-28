import React, { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import type { Education, PortfolioData } from '../../../types/portfolio';

interface EducationTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function EducationTab({ data, onChange, onShowConfirm }: EducationTabProps) {
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const educationList = data.education;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      onChange((prev) => ({
        ...prev,
        education: [...prev.education, editingItem],
      }));
    } else if (editIndex !== null) {
      onChange((prev) => {
        const next = [...prev.education];
        next[editIndex] = editingItem;
        return { ...prev, education: next };
      });
    }

    setEditingItem(null);
    setEditIndex(null);
    setIsCreating(false);
  };

  const handleDelete = (index: number, school: string) => {
    onShowConfirm('Delete Education Record', `Remove "${school}" from your education records?`, () => {
      onChange((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      }));
    });
  };

  const startCreate = () => {
    setEditingItem({
      school: 'Institution / College Name',
      place: 'City, State',
      degree: 'Degree / Course Name',
      period: 'Year – Year',
      score: 'CGPA / Percentage',
    });
    setEditIndex(null);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
            Academic History ({educationList.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Displayed on the Hero floating chips, About section, and Resume sheet.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educationList.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {item.score}
                  </span>
                  {item.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/40 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      Pursuing
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-500">{item.period}</span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{item.school}</h4>
              <div className="text-xs font-mono text-red-400 mb-1">{item.degree}</div>
              {item.department && (
                <div className="text-xs font-mono text-zinc-300 bg-zinc-950/80 border border-zinc-800 px-2 py-1 rounded-md mb-2">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold mr-1">DEPT:</span>
                  {item.department}
                </div>
              )}
              <div className="text-xs text-zinc-500">{item.place}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  setEditingItem({ ...item });
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
                onClick={() => handleDelete(idx, item.school)}
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
                {isCreating ? 'Add Education' : 'Edit Education'}
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
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.school}
                  onChange={(e) => setEditingItem({ ...editingItem, school: e.target.value })}
                  placeholder="e.g. Aditya Engineering College"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.degree}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Technology"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Department / Branch (DEPT)
                  </label>
                  <input
                    type="text"
                    value={editingItem.department || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                    placeholder="e.g. Artificial Intelligence & ML"
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
                    placeholder="e.g. Surampalem"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Score / CGPA / Grade
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.score}
                    onChange={(e) => setEditingItem({ ...editingItem, score: e.target.value })}
                    placeholder="CGPA 9.10"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
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
                  placeholder="October 2023 – Present"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.isCurrent)}
                    onChange={(e) => setEditingItem({ ...editingItem, isCurrent: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">
                      Still Learning / Currently Pursuing this Degree (DEPT)
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      Highlights this department as currently in progress (Pursuing)
                    </div>
                  </div>
                </label>
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
