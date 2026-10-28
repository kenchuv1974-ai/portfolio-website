import { useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import type { PortfolioData, Skill, SkillCategory } from '../../../types/portfolio';

interface SkillsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function SkillsTab({ data, onChange, onShowConfirm }: SkillsTabProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>(data.skillCategories[0]?.id || '');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillMono, setNewSkillMono] = useState('');
  const [newSkillNote, setNewSkillNote] = useState('');

  const categories = data.skillCategories;
  const currentCat = categories.find((c) => c.id === selectedCatId) || categories[0];

  const updateCurrentCategory = (field: keyof SkillCategory, val: unknown) => {
    if (!currentCat) return;
    onChange((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) =>
        c.id === currentCat.id ? { ...c, [field]: val } : c
      ),
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !currentCat) return;

    const mono = newSkillMono.trim() || newSkillName.trim().substring(0, 2);
    const newSkill: Skill = {
      name: newSkillName.trim(),
      mono: mono.charAt(0).toUpperCase() + mono.slice(1).toLowerCase(),
      note: newSkillNote.trim() || undefined,
    };

    onChange((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) =>
        c.id === currentCat.id ? { ...c, skills: [...c.skills, newSkill] } : c
      ),
    }));

    setNewSkillName('');
    setNewSkillMono('');
    setNewSkillNote('');
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (!currentCat) return;
    onChange((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) =>
        c.id === currentCat.id
          ? { ...c, skills: c.skills.filter((_, idx) => idx !== skillIndex) }
          : c
      ),
    }));
  };

  const handleAddCategory = () => {
    const id = `cat-${Date.now()}`;
    const newCat: SkillCategory = {
      id,
      title: 'New Skill Category',
      subtitle: 'Category description',
      skills: [],
    };
    onChange((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
    setSelectedCatId(id);
  };

  const handleDeleteCategory = (cat: SkillCategory) => {
    onShowConfirm('Delete Skill Category', `Remove category "${cat.title}" and its skills?`, () => {
      onChange((prev) => {
        const nextList = prev.skillCategories.filter((c) => c.id !== cat.id);
        if (selectedCatId === cat.id && nextList.length > 0) {
          setSelectedCatId(nextList[0].id);
        }
        return { ...prev, skillCategories: nextList };
      });
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Category selector pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer shrink-0 border ${
                currentCat?.id === c.id
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {c.title} ({c.skills.length})
            </button>
          ))}
        </div>

        <button
          onClick={handleAddCategory}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {currentCat && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6">
          
          {/* Category meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={currentCat.title}
                onChange={(e) => updateCurrentCategory('title', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Subtitle / Flavor Note
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentCat.subtitle}
                  onChange={(e) => updateCurrentCategory('subtitle', e.target.value)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(currentCat)}
                    title="Delete Category"
                    className="p-2 rounded-xl bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/40 cursor-pointer transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Current skills grid */}
          <div>
            <h4 className="text-xs font-mono uppercase text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Skills in {currentCat.title} ({currentCat.skills.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentCat.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 flex items-center justify-between group hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono text-xs font-bold text-red-400">
                      {skill.mono}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-100">{skill.name}</div>
                      {skill.note && (
                        <div className="text-[10px] font-mono text-amber-400 uppercase">
                          {skill.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition cursor-pointer"
                    title="Remove Skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add skill form */}
          <form
            onSubmit={handleAddSkill}
            className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Skill name (e.g. React, Docker, Python)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="w-full sm:w-28">
              <input
                type="text"
                placeholder="Abbr (e.g. Re)"
                maxLength={4}
                value={newSkillMono}
                onChange={(e) => setNewSkillMono(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-center"
              />
            </div>
            <div className="w-full sm:w-36">
              <input
                type="text"
                placeholder="Note (e.g. Primary)"
                value={newSkillNote}
                onChange={(e) => setNewSkillNote(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
