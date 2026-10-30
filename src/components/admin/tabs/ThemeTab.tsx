import React from 'react';
import {
  Check,
  Eye,
  MousePointer,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  Square,
  SunMedium,
  Tv,
} from 'lucide-react';
import { THEME_PRESETS, defaultThemeSettings, applyThemeToDocument } from '../../../services/themeService';
import type { PortfolioData, ThemePreset, ThemeSettings } from '../../../types/portfolio';

interface ThemeTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ThemeTab({ data, onChange, onShowToast }: ThemeTabProps) {
  const currentTheme: ThemeSettings = data.themeSettings || defaultThemeSettings;

  const updateTheme = (updater: (prev: ThemeSettings) => ThemeSettings) => {
    onChange((prev) => {
      const existing = prev.themeSettings || defaultThemeSettings;
      const updated = updater(existing);
      // Immediately apply to DOM for instant zero-latency feedback
      applyThemeToDocument(updated);
      return {
        ...prev,
        themeSettings: updated,
      };
    });
  };

  const handleApplyPreset = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    updateTheme(() => ({ ...preset.settings }));
    onShowToast('Theme Applied', `Switched palette to ${preset.name}.`, 'success');
  };

  const handleColorChange = (key: keyof ThemeSettings, val: string) => {
    updateTheme((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleResetToDefault = () => {
    updateTheme(() => ({ ...defaultThemeSettings }));
    onShowToast('Reset Complete', 'Restored default Cinematic Crimson palette.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Tab Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                UI / UX & Color Studio
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize website themes, brand accent colors, corner rounding, and cursor styling in real time.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>Reset to Factory Palette</span>
        </button>
      </div>

      {/* 1. Curated Theme Presets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>Curated Theme Presets (1-Click Switch)</span>
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">
            Click any card to preview immediately
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
            const p = THEME_PRESETS[key];
            const isActive = currentTheme.preset === key && currentTheme.primaryColor === p.settings.primaryColor;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyPreset(key)}
                className={`group relative text-left p-4 rounded-2xl border transition duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-zinc-800/90 border-red-500/60 ring-2 ring-red-500/30 shadow-lg'
                    : 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-800/50'
                }`}
              >
                {/* Active Indicator Pip */}
                {isActive && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[10px] font-mono text-red-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-red-400" />
                    <span>Active</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition">
                    {p.name}
                  </h4>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
                  {p.tag}
                </p>

                {/* Color Swatch Strip */}
                <div className="flex items-center gap-1.5 mb-3 p-1.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                  <div
                    className="h-5 flex-1 rounded-md shadow-inner transition-transform group-hover:scale-105"
                    style={{ backgroundColor: p.settings.primaryColor }}
                    title={`Accent: ${p.settings.primaryColor}`}
                  />
                  <div
                    className="h-5 flex-1 rounded-md shadow-inner"
                    style={{ backgroundColor: p.settings.primaryColorHover }}
                    title={`Highlight: ${p.settings.primaryColorHover}`}
                  />
                  <div
                    className="h-5 flex-1 rounded-md shadow-inner border border-zinc-700/60"
                    style={{ backgroundColor: p.settings.backgroundColor }}
                    title={`Canvas: ${p.settings.backgroundColor}`}
                  />
                  <div
                    className="h-5 flex-1 rounded-md shadow-inner border border-zinc-700/60"
                    style={{ backgroundColor: p.settings.cardBackground }}
                    title={`Card Surface: ${p.settings.cardBackground}`}
                  />
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Tuning Studio & Live Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Color Pickers (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-400" />
              <span>Color Tuning Studio</span>
            </h3>

            {/* A. Brand & Accents */}
            <div className="space-y-3">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                1. Brand Accents & Interactive Highlights
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <ColorInputCard
                  label="Primary Accent (Brand Fill)"
                  sublabel="Buttons, active underlines, logo highlight"
                  value={currentTheme.primaryColor}
                  onChange={(val) => handleColorChange('primaryColor', val)}
                />
                <ColorInputCard
                  label="Accent Highlight / Glow"
                  sublabel="Hover borders, status pills, cursor glow"
                  value={currentTheme.primaryColorHover}
                  onChange={(val) => handleColorChange('primaryColorHover', val)}
                />
              </div>
            </div>

            {/* B. Backgrounds and Inks */}
            <div className="space-y-3 pt-3 border-t border-zinc-800/80">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                2. Canvas Background & Card Inks
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <ColorInputCard
                  label="Canvas Background"
                  sublabel="Deep website canvas"
                  value={currentTheme.backgroundColor}
                  onChange={(val) => handleColorChange('backgroundColor', val)}
                />
                <ColorInputCard
                  label="Card Surface Ink"
                  sublabel="Cards, modals, navbar"
                  value={currentTheme.cardBackground}
                  onChange={(val) => handleColorChange('cardBackground', val)}
                />
                <ColorInputCard
                  label="Card Border Outline"
                  sublabel="Subtle outline rim"
                  value={currentTheme.cardBorderColor}
                  onChange={(val) => handleColorChange('cardBorderColor', val)}
                />
              </div>
            </div>

            {/* C. Typography Tones */}
            <div className="space-y-3 pt-3 border-t border-zinc-800/80">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                3. Typography & Contrast
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <ColorInputCard
                  label="Primary Text (Headings)"
                  sublabel="Titles, bold headlines, prominent text"
                  value={currentTheme.textColor}
                  onChange={(val) => handleColorChange('textColor', val)}
                />
                <ColorInputCard
                  label="Muted Text (Subtitles)"
                  sublabel="Descriptions, dates, metadata"
                  value={currentTheme.textMutedColor}
                  onChange={(val) => handleColorChange('textMutedColor', val)}
                />
              </div>
            </div>
          </div>

          {/* 3. Visual UI / UX Styling Options */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-400" />
              <span>UI Polish, Corner Radius & Cursor Experience</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Corner Radius */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Card Corner Radius</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sharp', 'rounded', 'soft'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleColorChange('borderRadius', r)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition cursor-pointer ${
                        currentTheme.borderRadius === r
                          ? 'bg-zinc-800 border-red-500/60 text-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {r === 'sharp' ? 'Sharp 4px' : r === 'rounded' ? 'Clean 10px' : 'Soft 18px'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cursor Experience */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Cursor Experience</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cinematic', 'minimal', 'system'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleColorChange('cursorStyle', c)}
                      className={`px-2 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition cursor-pointer ${
                        currentTheme.cursorStyle === c
                          ? 'bg-zinc-800 border-red-500/60 text-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {c === 'cinematic' ? 'Reticle' : c === 'minimal' ? 'Dot' : 'Native'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glow Intensity */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Atmospheric Lighting</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['subtle', 'balanced', 'high'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleColorChange('glowIntensity', g)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition cursor-pointer ${
                        currentTheme.glowIntensity === g
                          ? 'bg-zinc-800 border-red-500/60 text-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Film Grain Toggle */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  35mm Film Grain Overlay
                </label>
                <button
                  type="button"
                  onClick={() => handleColorChange('enableFilmGrain', (!currentTheme.enableFilmGrain) as unknown as string)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono border transition flex items-center justify-between cursor-pointer ${
                    currentTheme.enableFilmGrain
                      ? 'bg-zinc-800/90 border-red-500/50 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span>{currentTheme.enableFilmGrain ? 'Active (Cinematic Grain)' : 'Clean Digital (No Grain)'}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      currentTheme.enableFilmGrain ? 'bg-red-500' : 'bg-zinc-700'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Miniature Component Mockup (1 Col) */}
        <div className="space-y-4">
          <div className="sticky top-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span>Live Component Mockup</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                Live Preview
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              This card renders the chosen theme tokens in real time. Hover and inspect the live styling below:
            </p>

            {/* Mockup Canvas */}
            <div
              className="p-5 rounded-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden space-y-4"
              style={{
                backgroundColor: currentTheme.backgroundColor,
                borderColor: currentTheme.cardBorderColor,
              }}
            >
              {/* Subtle top light streak */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${currentTheme.primaryColorHover}, transparent)`,
                }}
              />

              {/* Mockup Card */}
              <div
                className="p-4 rounded-xl border transition duration-300 relative group"
                style={{
                  backgroundColor: currentTheme.cardBackground,
                  borderColor: currentTheme.cardBorderColor,
                  borderRadius: currentTheme.borderRadius === 'sharp' ? '4px' : currentTheme.borderRadius === 'soft' ? '16px' : '10px',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-mono font-bold tracking-widest uppercase"
                    style={{ color: currentTheme.primaryColorHover }}
                  >
                    ★ H-ORIGINAL
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    2026 • AI PLATFORM
                  </span>
                </div>

                <h4
                  className="text-lg font-bold font-['Bebas_Neue',sans-serif] tracking-wider mb-1"
                  style={{ color: currentTheme.textColor }}
                >
                  PolicyGuard AI
                </h4>
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: currentTheme.textMutedColor }}
                >
                  Production-grade autonomous security monitoring & cryptographic verification engine.
                </p>

                {/* Progress bar with theme fill */}
                <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '74%',
                      backgroundColor: currentTheme.primaryColor,
                      boxShadow: `0 0 10px ${currentTheme.primaryColor}`,
                    }}
                  />
                </div>

                {/* Mock CTA Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-white text-center transition cursor-pointer shadow-md"
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      borderRadius: currentTheme.borderRadius === 'sharp' ? '4px' : currentTheme.borderRadius === 'soft' ? '12px' : '8px',
                    }}
                  >
                    ▶ Watch Trailer
                  </button>
                  <button
                    type="button"
                    className="py-2 px-3 text-xs font-medium rounded-lg border text-center transition cursor-pointer"
                    style={{
                      color: currentTheme.textColor,
                      borderColor: currentTheme.cardBorderColor,
                      borderRadius: currentTheme.borderRadius === 'sharp' ? '4px' : currentTheme.borderRadius === 'soft' ? '12px' : '8px',
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Status Note */}
              <div className="text-[10px] font-mono text-zinc-500 text-center">
                Active Theme: <span className="text-zinc-300 font-bold">{currentTheme.preset}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

interface ColorInputCardProps {
  label: string;
  sublabel: string;
  value: string;
  onChange: (val: string) => void;
}

function ColorInputCard({ label, sublabel, value, onChange }: ColorInputCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-3 space-y-2 hover:border-zinc-700 transition">
      <div className="flex items-start justify-between gap-1">
        <div>
          <span className="block text-xs font-semibold text-zinc-200">
            {label}
          </span>
          <span className="block text-[10px] text-zinc-500">
            {sublabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {/* Color picker circle */}
        <label className="relative shrink-0 w-8 h-8 rounded-full border border-white/20 shadow-inner cursor-pointer overflow-hidden block">
          <input
            type="color"
            value={value.startsWith('#') ? value.slice(0, 7) : '#e5132b'}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: value }}
          />
        </label>

        {/* Hex Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#hex"
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-red-500 uppercase"
        />

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          title="Copy hex code"
          className="shrink-0 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white transition cursor-pointer"
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

