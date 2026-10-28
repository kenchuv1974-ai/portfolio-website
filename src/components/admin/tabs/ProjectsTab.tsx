import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, FolderGit2, Plus, Trash2 } from 'lucide-react';
import type { Palette, PortfolioData, Project } from '../../../types/portfolio';

interface ProjectsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const MOTIFS: Project['motif'][] = ['shield', 'flow', 'tenants'];

export default function ProjectsTab({ data, onChange, onShowConfirm }: ProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const projects = data.projects;

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (isCreating) {
      onChange((prev) => ({
        ...prev,
        projects: [...prev.projects, editingProject],
      }));
    } else {
      onChange((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === editingProject.id ? editingProject : p)),
      }));
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    onShowConfirm(
      'Delete Project Original',
      `Are you sure you want to delete "${title}"? This will remove it from the public portfolio upon publishing.`,
      () => {
        onChange((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== id),
        }));
      }
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onChange((prev) => ({
      ...prev,
      projects: list,
    }));
  };

  const startCreate = () => {
    const newProj: Project = {
      id: `project-${Date.now()}`,
      title: 'New Original Title',
      year: new Date().getFullYear().toString(),
      genre: 'Full-Stack • Architecture',
      logline: 'Brief summary description of what this project achieves.',
      stack: ['React', 'Node.js', 'PostgreSQL'],
      build: [
        'Built full-stack application with responsive interface and database integration.',
      ],
      features: ['Real-time processing', 'Modern UI design'],
      metrics: [
        { value: '100%', label: 'test coverage' },
        { value: '<50ms', label: 'latency' },
      ],
      palette: {
        from: '#1a0d02',
        via: '#6b3c06',
        to: '#0a0806',
        accent: '#ffb547',
      },
      motif: 'shield',
    };
    setEditingProject(newProj);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search projects by title, genre, or tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-700/80 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project Original</span>
        </button>
      </div>

      {/* Project list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-zinc-700 transition"
          >
            <div className="flex items-start gap-4 flex-1">
              {/* Palette swatch */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 text-white shadow-md font-mono text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg, ${p.palette.from}, ${p.palette.via})`,
                  borderColor: p.palette.accent,
                }}
              >
                {p.year}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wider text-xl">
                    {p.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {p.genre}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">motif: {p.motif}</span>
                </div>

                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 max-w-2xl leading-relaxed">
                  {p.logline}
                </p>

                {/* Tech chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                  {p.stack.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950/80 text-zinc-400 border border-zinc-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                title="Move Up"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === projects.length - 1}
                title="Move Down"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProject({ ...p });
                  setIsCreating(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.title)}
                className="p-2 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 transition cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-zinc-950 border border-zinc-800 p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-red-400 tracking-wider">
                  {isCreating ? 'Create New Original' : 'Modify Original Project'}
                </span>
                <h3 className="text-2xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                  {editingProject.title || 'Untitled Project'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-zinc-500 hover:text-white text-lg p-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Release Year
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Genre / Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.genre}
                    onChange={(e) => setEditingProject({ ...editingProject, genre: e.target.value })}
                    placeholder="e.g. AI • NLP • LLM"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Visual Motif Badge
                  </label>
                  <select
                    value={editingProject.motif}
                    onChange={(e) => setEditingProject({ ...editingProject, motif: e.target.value as Project['motif'] })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs cursor-pointer"
                  >
                    {MOTIFS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Logline / Synopsis
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.logline}
                  onChange={(e) => setEditingProject({ ...editingProject, logline: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={editingProject.stack.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Build Narrative (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.build.join('\n')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      build: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.features.join('\n')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      features: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs font-mono"
                />
              </div>

              {/* Metrics */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Key Outcomes & Metrics (Value + Label)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({
                        ...editingProject,
                        metrics: [...editingProject.metrics, { value: '99%', label: 'metric label' }],
                      })
                    }
                    className="text-xs text-red-400 hover:text-red-300 font-mono uppercase flex items-center gap-1 cursor-pointer"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editingProject.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="text"
                        placeholder="Value (e.g. 92%)"
                        value={m.value}
                        onChange={(e) => {
                          const updated = [...editingProject.metrics];
                          updated[mIdx].value = e.target.value;
                          setEditingProject({ ...editingProject, metrics: updated });
                        }}
                        className="w-24 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={m.label}
                        onChange={(e) => {
                          const updated = [...editingProject.metrics];
                          updated[mIdx].label = e.target.value;
                          setEditingProject({ ...editingProject, metrics: updated });
                        }}
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingProject.metrics.filter((_, idx) => idx !== mIdx);
                          setEditingProject({ ...editingProject, metrics: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400 px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>GitHub Repository URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={editingProject.github || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveDemo || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemo: e.target.value })}
                    placeholder="https://demo..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Palette */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Color Palette (Hex Codes)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['from', 'via', 'to', 'accent'] as (keyof Palette)[]).map((key) => (
                    <div key={key} className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="color"
                        value={editingProject.palette[key]}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            palette: { ...editingProject.palette, [key]: e.target.value },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <div className="text-xs font-mono text-zinc-300">
                        <span className="text-[10px] uppercase text-zinc-500 block">{key}</span>
                        {editingProject.palette[key]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Project Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
