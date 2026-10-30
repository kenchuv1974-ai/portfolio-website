import type { ThemePreset, ThemeSettings } from '../types/portfolio';

export const THEME_PRESETS: Record<ThemePreset, { name: string; tag: string; description: string; settings: ThemeSettings }> = {
  crimson: {
    name: 'Cinematic Crimson',
    tag: 'Default • Series Original',
    description: 'Iconic streaming aesthetic with deep obsidian inks, crimson accents, and warm film grain.',
    settings: {
      preset: 'crimson',
      primaryColor: '#e5132b',
      primaryColorHover: '#ff3d5a',
      backgroundColor: '#07070a',
      cardBackground: '#0e0e13',
      cardBorderColor: '#16161d',
      textColor: '#f4f1ec',
      textMutedColor: '#a7a6ad',
      borderRadius: 'rounded',
      glowIntensity: 'balanced',
      enableFilmGrain: true,
      cursorStyle: 'cinematic',
    },
  },
  violet: {
    name: 'Cyberpunk Violet',
    tag: 'Electric • Neo-Tokyo',
    description: 'Deep midnight obsidian with vivid ultraviolet glow and neon magenta highlights.',
    settings: {
      preset: 'violet',
      primaryColor: '#9333ea',
      primaryColorHover: '#c084fc',
      backgroundColor: '#08060f',
      cardBackground: '#110e1c',
      cardBorderColor: '#1d172e',
      textColor: '#f5f3ff',
      textMutedColor: '#a8a29e',
      borderRadius: 'rounded',
      glowIntensity: 'high',
      enableFilmGrain: true,
      cursorStyle: 'cinematic',
    },
  },
  emerald: {
    name: 'Tech Emerald',
    tag: 'Matrix • Minimal',
    description: 'Clean dark cyber green inspired by terminal screens, telemetry dashboards, and modern dev tools.',
    settings: {
      preset: 'emerald',
      primaryColor: '#10b981',
      primaryColorHover: '#34d399',
      backgroundColor: '#040d08',
      cardBackground: '#0a160f',
      cardBorderColor: '#12261b',
      textColor: '#ecfdf5',
      textMutedColor: '#9ca3af',
      borderRadius: 'rounded',
      glowIntensity: 'balanced',
      enableFilmGrain: true,
      cursorStyle: 'cinematic',
    },
  },
  cyan: {
    name: 'Electric Sapphire',
    tag: 'Futuristic • Clean',
    description: 'High-contrast oceanic navy with electric cyan-blue beams and crisp frosted glass surfaces.',
    settings: {
      preset: 'cyan',
      primaryColor: '#0284c7',
      primaryColorHover: '#38bdf8',
      backgroundColor: '#050b14',
      cardBackground: '#0b1524',
      cardBorderColor: '#132138',
      textColor: '#f0f9ff',
      textMutedColor: '#94a3b8',
      borderRadius: 'rounded',
      glowIntensity: 'balanced',
      enableFilmGrain: true,
      cursorStyle: 'cinematic',
    },
  },
  amber: {
    name: 'Golden Sunset',
    tag: 'Warm • Prestige',
    description: 'Rich dark espresso tones paired with warm gold and amber for an opulent, cinematic finish.',
    settings: {
      preset: 'amber',
      primaryColor: '#f59e0b',
      primaryColorHover: '#fbbf24',
      backgroundColor: '#0c0905',
      cardBackground: '#16120b',
      cardBorderColor: '#241d13',
      textColor: '#fffbeb',
      textMutedColor: '#a8a29e',
      borderRadius: 'rounded',
      glowIntensity: 'balanced',
      enableFilmGrain: true,
      cursorStyle: 'cinematic',
    },
  },
  slate: {
    name: 'Titanium Monochrome',
    tag: 'Ultra-Minimal • Editorial',
    description: 'Stripped-back luxury: carbon black canvas, titanium silver borders, and pure ice white typography.',
    settings: {
      preset: 'slate',
      primaryColor: '#94a3b8',
      primaryColorHover: '#f1f5f9',
      backgroundColor: '#09090b',
      cardBackground: '#121217',
      cardBorderColor: '#1e1e26',
      textColor: '#f8fafc',
      textMutedColor: '#71717a',
      borderRadius: 'sharp',
      glowIntensity: 'subtle',
      enableFilmGrain: false,
      cursorStyle: 'minimal',
    },
  },
};

export const defaultThemeSettings: ThemeSettings = THEME_PRESETS.crimson.settings;

/**
 * Injects dynamic theme CSS variables directly into :root
 * This instantly propagates across all Tailwind @theme tokens and custom CSS
 */
export function applyThemeToDocument(theme?: ThemeSettings): void {
  if (typeof document === 'undefined') return;

  const t = theme || defaultThemeSettings;
  const root = document.documentElement;

  // 1. Core Accent Colors
  root.style.setProperty('--theme-crimson', t.primaryColor);
  root.style.setProperty('--theme-crimson-2', t.primaryColorHover);

  // 2. Background and Card Inks
  root.style.setProperty('--theme-ink', t.backgroundColor);
  root.style.setProperty('--theme-ink-2', t.cardBackground);
  root.style.setProperty('--theme-ink-3', t.cardBorderColor);

  // 3. Typography
  root.style.setProperty('--theme-bone', t.textColor);
  root.style.setProperty('--theme-mist', t.textMutedColor);

  // 4. Border Radius
  const radiusMap = {
    sharp: '4px',
    rounded: '10px',
    soft: '18px',
  };
  root.style.setProperty('--theme-radius', radiusMap[t.borderRadius] || '10px');

  // 5. Film Grain Opacity
  root.style.setProperty('--theme-grain-opacity', t.enableFilmGrain ? '0.055' : '0');

  // 6. Accent Glow Intensity
  const glowMap = {
    subtle: '0.2',
    balanced: '0.45',
    high: '0.75',
  };
  root.style.setProperty('--theme-glow-alpha', glowMap[t.glowIntensity] || '0.45');

  // 7. Body and Meta theme-color synchronization
  document.body.style.backgroundColor = t.backgroundColor;
  document.body.style.color = t.textColor;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', t.backgroundColor);
  }
}
