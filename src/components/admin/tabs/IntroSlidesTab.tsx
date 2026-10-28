import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, PlaySquare, Plus, Trash2 } from 'lucide-react';
import type { IntroSlide, PortfolioData } from '../../../types/portfolio';

interface IntroSlidesTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function IntroSlidesTab({ data, onChange, onShowConfirm }: IntroSlidesTabProps) {
  const [editingSlide, setEditingSlide] = useState<{ slide: IntroSlide; index: number; isNew: boolean } | null>(null);

  const slides = data.introSlides;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    onChange((prev) => {
      const next = [...prev.introSlides];
      if (editingSlide.isNew) {
        next.push(editingSlide.slide);
      } else {
        next[editingSlide.index] = editingSlide.slide;
      }
      return { ...prev, introSlides: next };
    });

    setEditingSlide(null);
  };

  const handleDelete = (index: number, title: string) => {
    onShowConfirm('Delete Intro Slide', `Remove slide "${title}" from the cinematic highlight reel?`, () => {
      onChange((prev) => ({
        ...prev,
        introSlides: prev.introSlides.filter((_, i) => i !== index),
      }));
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;

    const list = [...slides];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    onChange((prev) => ({ ...prev, introSlides: list }));
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <PlaySquare className="w-4 h-4 text-red-500" />
            <span>Cinematic Highlight Reel Slides ({slides.length})</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Triggered by the billboard "▶ Play Intro" button with audio and full-screen camera zoom.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingSlide({
              isNew: true,
              index: slides.length,
              slide: {
                kicker: 'Highlight',
                title: 'New Highlight Chapter',
                lines: ['First line of highlighted achievement', 'Second line of details'],
                chips: ['Key Tag'],
              },
            })
          }
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Intro Slide</span>
        </button>
      </div>

      <div className="space-y-3">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black font-['Bebas_Neue',sans-serif] text-red-500 w-8 text-center shrink-0">
                0{idx + 1}
              </span>

              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-red-400 border border-zinc-700">
                  {slide.kicker}
                </span>
                <h4 className="text-base font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide mt-1">
                  {slide.title}
                </h4>
                <div className="text-xs text-zinc-400 space-y-0.5 mt-1">
                  {slide.lines.map((ln, lIdx) => (
                    <div key={lIdx}>• {ln}</div>
                  ))}
                </div>
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
                disabled={idx === slides.length - 1}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingSlide({
                    isNew: false,
                    index: idx,
                    slide: { ...slide, lines: [...slide.lines], chips: slide.chips ? [...slide.chips] : [] },
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx, slide.title)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {editingSlide.isNew ? 'Add Slide' : 'Edit Slide'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Kicker Category
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.slide.kicker}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        slide: { ...editingSlide.slide, kicker: e.target.value },
                      })
                    }
                    placeholder="e.g. Education"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Slide Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.slide.title}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        slide: { ...editingSlide.slide, title: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Bullet Lines (One per line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.slide.lines.join('\n')}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: {
                        ...editingSlide.slide,
                        lines: e.target.value.split('\n').filter(Boolean),
                      },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Chips (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(editingSlide.slide.chips || []).join(', ')}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: {
                        ...editingSlide.slide,
                        chips: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-900/30"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
