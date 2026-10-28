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
import type { PortfolioData } from '../types/portfolio';

const STORAGE_PUBLISHED_KEY = 'portfolio_series_published_v3';
const STORAGE_DRAFT_KEY = 'portfolio_series_draft_v3';
const STORAGE_MEDIA_CACHE_KEY = 'portfolio_series_media_v3';

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
    siteTitle: 'Sushmita — The Series',
    siteDescription: 'Full-Stack Developer • AI / ML • Java. Every project is an Original.',
    ogImage: './assets/og-image.jpg',
    themeColor: '#07070a',
    copyrightText: 'A DASARI ORIGINAL // ALL RIGHTS RESERVED',
    footerQuote: 'TO BE CONTINUED…',
  },
  lastUpdated: new Date().toISOString(),
  version: 3,
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
    };
  } catch (err) {
    console.error('Failed reading published portfolio data:', err);
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
    };
  } catch (err) {
    console.error('Failed reading draft data:', err);
    return getPublishedData();
  }
}

/**
 * Saves draft changes in the admin panel
 */
export function saveDraftData(data: PortfolioData): boolean {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed saving draft:', err);
    return false;
  }
}

/**
 * Publishes draft changes directly to the live website
 */
export function publishLive(data: PortfolioData): boolean {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(updated);
    localStorage.setItem(STORAGE_PUBLISHED_KEY, jsonStr);
    localStorage.setItem(STORAGE_DRAFT_KEY, jsonStr);

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
  } catch (err) {
    console.error('Failed resetting defaults:', err);
  }
}

/**
 * Converts uploaded file into permanent base64 data URI
 */
export function processFileUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      reject(new Error('File exceeds maximum allowed size (8MB). Please choose a smaller file.'));
      return;
    }

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
      lastUpdated: new Date().toISOString(),
    };
    return { success: true, data: merged };
  } catch (err) {
    return { success: false, error: 'Malformed JSON file.' };
  }
}
