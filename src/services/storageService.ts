import {
  achievements as defaultAchievements,
  certifications as defaultCertifications,
  education as defaultEducation,
  experience as defaultExperience,
  introSlides as defaultIntroSlides,
  profile as defaultProfile,
  projects as defaultProjects,
  seasons as defaultSeasons,
  skillCategories as defaultSkillCategories,
  skillEvidence as defaultSkillEvidence,
  topPicks as defaultTopPicks,
  viewerProfiles as defaultViewerProfiles,
} from '../data/portfolio';
import { defaultThemeSettings } from './themeService';
import { optimizeImageUpload } from './imageOptimizer';
import { idbSet, idbGet, idbRemove } from './dbStorage';
import { generatePortfolioSourceCode } from './sourceCodeGen';
import type { PortfolioData } from '../types/portfolio';

const STORAGE_PUBLISHED_KEY = 'portfolio_series_published_v5';
const STORAGE_DRAFT_KEY = 'portfolio_series_draft_v5';
const STORAGE_MEDIA_CACHE_KEY = 'portfolio_series_media_v5';

export const initialDefaultData: PortfolioData = {
  profile: {
    fullName: defaultProfile.fullName,
    displayName: defaultProfile.displayName,
    firstName: defaultProfile.firstName,
    seriesTag: defaultProfile.seriesTag,
    originalLabel: defaultProfile.originalLabel,
    role: defaultProfile.role,
    tagline: [...defaultProfile.tagline],
    intro: defaultProfile.intro,
    location: defaultProfile.location,
    email: defaultProfile.email,
    links: { ...defaultProfile.links },
    resumePdf: defaultProfile.resumePdf,
    portrait: { ...defaultProfile.portrait },
    interests: [...defaultProfile.interests],
    availabilityStatus: 'Open to Opportunities',
  },
  education: defaultEducation.map((e) => ({ ...e })),
  experience: defaultExperience.map((e) => ({ ...e, points: [...e.points] })),
  projects: defaultProjects.map((p) => ({
    ...p,
    stack: [...p.stack],
    build: [...p.build],
    features: [...p.features],
    metrics: p.metrics.map((m) => ({ ...m })),
    palette: { ...p.palette },
  })),
  achievements: defaultAchievements.map((a) => ({ ...a })),
  certifications: defaultCertifications.map((c) => ({ ...c })),
  skillCategories: defaultSkillCategories.map((c) => ({
    ...c,
    skills: c.skills.map((s) => ({ ...s })),
  })),
  skillEvidence: { ...defaultSkillEvidence },
  seasons: defaultSeasons.map((s) => ({
    ...s,
    episodes: s.episodes.map((ep) => ({
      ...ep,
      tags: [...ep.tags],
      palette: { ...ep.palette },
    })),
  })),
  topPicks: defaultTopPicks.map((tp) => ({
    ...tp,
    palette: { ...tp.palette },
  })),
  introSlides: defaultIntroSlides.map((is) => ({
    ...is,
    lines: [...is.lines],
    chips: is.chips ? [...is.chips] : undefined,
  })),
  viewerProfiles: defaultViewerProfiles.map((vp) => ({
    ...vp,
    order: [...vp.order],
  })),
  siteSettings: {
    siteTitle: 'Harsh — The Series',
    siteDescription: 'Full-Stack Developer • AI / ML • Java. Every project is an Original.',
    ogImage: './assets/og-image.jpg',
    themeColor: '#07070a',
    copyrightText: 'AN H-ORIGINAL // ALL RIGHTS RESERVED',
    footerQuote: 'TO BE CONTINUED…',
  },
  themeSettings: { ...defaultThemeSettings },
  lastUpdated: new Date().toISOString(),
  version: 5,
};

/**
 * Retrieves the published portfolio data from persistent storage or returns defaults
 */
export function getPublishedData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_PUBLISHED_KEY);
    if (!raw) return { ...initialDefaultData };
    const parsed = JSON.parse(raw);
    return {
      ...initialDefaultData,
      ...parsed,
      profile: { ...initialDefaultData.profile, ...(parsed.profile || {}) },
      siteSettings: { ...initialDefaultData.siteSettings, ...(parsed.siteSettings || {}) },
      themeSettings: parsed.themeSettings ? { ...defaultThemeSettings, ...parsed.themeSettings } : { ...defaultThemeSettings },
    };
  } catch (err) {
    console.error('Failed reading published portfolio data from localStorage:', err);
    return { ...initialDefaultData };
  }
}

/**
 * Retrieves draft portfolio data for editing in the admin panel
 */
export function getDraftData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (!raw) {
      return getPublishedData();
    }
    const parsed = JSON.parse(raw);
    return {
      ...initialDefaultData,
      ...parsed,
      profile: { ...initialDefaultData.profile, ...(parsed.profile || {}) },
      siteSettings: { ...initialDefaultData.siteSettings, ...(parsed.siteSettings || {}) },
      themeSettings: parsed.themeSettings ? { ...defaultThemeSettings, ...parsed.themeSettings } : { ...defaultThemeSettings },
    };
  } catch (err) {
    console.error('Failed reading draft data from localStorage:', err);
    return getPublishedData();
  }
}

/**
 * Synchronizes and restores state from IndexedDB (redundant multi-gigabyte persistence)
 */
export async function syncFromIndexedDB(): Promise<{ published: PortfolioData; draft: PortfolioData } | null> {
  try {
    const [idbPublished, idbDraft] = await Promise.all([
      idbGet<PortfolioData>(STORAGE_PUBLISHED_KEY),
      idbGet<PortfolioData>(STORAGE_DRAFT_KEY),
    ]);

    if (!idbPublished && !idbDraft) return null;

    const pub = idbPublished ? { ...initialDefaultData, ...idbPublished } : getPublishedData();
    const drf = idbDraft ? { ...initialDefaultData, ...idbDraft } : pub;

    // Refresh localStorage cache if valid
    try {
      if (idbPublished) localStorage.setItem(STORAGE_PUBLISHED_KEY, JSON.stringify(pub));
      if (idbDraft) localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(drf));
    } catch {
      /* quota full warning */
    }

    return { published: pub, draft: drf };
  } catch (err) {
    console.warn('syncFromIndexedDB error:', err);
    return null;
  }
}

/**
 * Saves draft changes in the admin panel (LocalStorage + IndexedDB)
 */
export function saveDraftData(data: PortfolioData): boolean {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(updated);

    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, jsonStr);
    } catch (lsErr) {
      console.warn('LocalStorage draft quota warning, falling back to IndexedDB:', lsErr);
    }

    // Always persist to IndexedDB asynchronously
    idbSet(STORAGE_DRAFT_KEY, updated);
    return true;
  } catch (err) {
    console.error('Failed saving draft:', err);
    return false;
  }
}

/**
 * Saves directly to source code on disk via Vite dev server
 */
export async function saveToSourceCode(data: PortfolioData): Promise<{ success: boolean; message: string }> {
  try {
    const sourceCode = generatePortfolioSourceCode(data);
    const res = await fetch('/__api/save-portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceCode, data }),
    });

    if (res.ok) {
      const json = await res.json();
      return { success: true, message: json.message || 'Saved permanently to src/data/portfolio.ts' };
    }
    return { success: false, message: 'Server API not active (running static build)' };
  } catch {
    return { success: false, message: 'Static hosting environment (use download or commit)' };
  }
}

/**
 * Publishes draft changes directly to the live website (LocalStorage, IndexedDB & Source Code)
 */
export async function publishLive(data: PortfolioData): Promise<boolean> {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(updated);

    try {
      localStorage.setItem(STORAGE_PUBLISHED_KEY, jsonStr);
      localStorage.setItem(STORAGE_DRAFT_KEY, jsonStr);
    } catch (lsErr) {
      console.warn('LocalStorage publish quota warning, saving to IndexedDB:', lsErr);
    }

    // Always persist to IndexedDB
    await Promise.all([
      idbSet(STORAGE_PUBLISHED_KEY, updated),
      idbSet(STORAGE_DRAFT_KEY, updated),
    ]);

    // Try saving directly to source code on local disk
    await saveToSourceCode(updated);

    // Update browser title & meta if changed
    if (updated.siteSettings?.siteTitle) {
      document.title = updated.siteSettings.siteTitle;
    }

    return true;
  } catch (err) {
    console.error('Failed publishing live:', err);
    return false;
  }
}

/**
 * Checks if unsaved draft changes exist compared to published data
 */
export function hasUnpublishedChanges(): boolean {
  try {
    const draft = localStorage.getItem(STORAGE_DRAFT_KEY);
    const pub = localStorage.getItem(STORAGE_PUBLISHED_KEY);
    if (!draft) return false;
    if (!pub) return true;
    return draft !== pub;
  } catch {
    return false;
  }
}

/**
 * Resets all portfolio data back to repository defaults
 */
export function resetPortfolioDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_PUBLISHED_KEY);
    localStorage.removeItem(STORAGE_DRAFT_KEY);
    localStorage.removeItem(STORAGE_MEDIA_CACHE_KEY);
    idbRemove(STORAGE_PUBLISHED_KEY);
    idbRemove(STORAGE_DRAFT_KEY);
  } catch (err) {
    console.error('Failed resetting defaults:', err);
  }
}

/**
 * Converts uploaded file into permanent optimized base64 data URI
 * Auto-compresses images into WebP to guarantee storage fit without exceeding browser quota.
 */
export async function processFileUpload(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    // Compress and scale image to max 1280px WebP at 85% quality
    return optimizeImageUpload(file, 1280, 0.85);
  }

  // Non-image files (e.g. PDF resume)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File exceeds maximum allowed size (5MB). Please select a smaller file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed reading file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generates JSON backup file for download
 */
export function exportBackup(data: PortfolioData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads the real `portfolio.ts` source code file
 * so user can directly place or commit it to their repository.
 */
export function exportSourceCodeFile(data: PortfolioData): void {
  const sourceCode = generatePortfolioSourceCode(data);
  const blob = new Blob([sourceCode], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio.ts';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports and validates backup JSON
 */
export function importBackup(jsonString: string): { success: boolean; data?: PortfolioData; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.profile || !parsed.projects) {
      return { success: false, error: 'Invalid backup structure. Missing profile or projects.' };
    }
    const merged: PortfolioData = {
      ...initialDefaultData,
      ...parsed,
      profile: { ...initialDefaultData.profile, ...parsed.profile },
      siteSettings: { ...initialDefaultData.siteSettings, ...(parsed.siteSettings || {}) },
      themeSettings: parsed.themeSettings ? { ...defaultThemeSettings, ...parsed.themeSettings } : { ...defaultThemeSettings },
      lastUpdated: new Date().toISOString(),
    };
    return { success: true, data: merged };
  } catch (err) {
    return { success: false, error: 'Malformed JSON file.' };
  }
}
