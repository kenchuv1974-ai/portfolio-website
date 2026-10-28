import React, { useState } from 'react';
import { Edit3, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { Certification, PortfolioData } from '../../../types/portfolio';

interface CertificationsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function CertificationsTab({ data, onChange, onShowConfirm }: CertificationsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const certs = data.certifications;

  const filteredCerts = certs
    .map((c, idx) => ({ ...c, originalIndex: idx }))
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (isCreating) {
      onChange((prev) => ({
        ...prev,
        certifications: [...prev.certifications, editingCert],
      }));
    } else if (editIndex !== null) {
      onChange((prev) => {
        const updated = [...prev.certifications];
        updated[editIndex] = editingCert;
        return { ...prev, certifications: updated };
      });
    }

    setEditingCert(null);
    setEditIndex(null);
    setIsCreating(false);
  };

  const handleDelete = (index: number, name: string) => {
    onShowConfirm('Delete Certification', `Remove certification "${name}"?`, () => {
      onChange((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
      }));
    });
  };

  const startCreate = () => {
    setEditingCert({
      issuer: 'AWS',
      name: 'New Certification Title',
      link: 'https://www.credly.com/...',
    });
    setEditIndex(null);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filter certifications by title or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-700/80 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredCerts.map((c) => (
          <div
            key={c.originalIndex}
            className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 flex flex-col justify-between hover:border-zinc-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/30">
                  {c.issuer}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">#{c.originalIndex + 1}</span>
              </div>
              <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 mb-2 leading-snug">
                {c.name}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-800/80">
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition"
              >
                <ExternalLink className="w-3 h-3 text-red-400" />
                <span>Verify</span>
              </a>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCert({ ...c });
                    setEditIndex(c.originalIndex);
                    setIsCreating(false);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.originalIndex, c.name)}
                  className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {isCreating ? 'Add Certification' : 'Edit Certification'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Issuing Organization (e.g. AWS, NPTEL, Oracle, Cisco)
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.issuer}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.name}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Credential / Verification URL
                </label>
                <input
                  type="url"
                  required
                  value={editingCert.link}
                  onChange={(e) => setEditingCert({ ...editingCert, link: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
