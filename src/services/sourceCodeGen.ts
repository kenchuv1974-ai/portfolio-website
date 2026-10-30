import type { PortfolioData } from '../types/portfolio';

/**
 * Generates the complete, production-ready TypeScript source code
 * for `src/data/portfolio.ts` from active portfolio state.
 * This allows direct persistence into the repository files.
 */
export function generatePortfolioSourceCode(data: PortfolioData): string {
  const p = data.profile;
  const edu = data.education;
  const exp = data.experience;
  const proj = data.projects;
  const ach = data.achievements;
  const cert = data.certifications;
  const skills = data.skillCategories;
  const evidence = data.skillEvidence;
  const seasons = data.seasons;
  const picks = data.topPicks;
  const slides = data.introSlides;
  const profiles = data.viewerProfiles;

  return `/**
 * Central portfolio data — Generated and synchronized via Portfolio Admin Terminal.
 * Updating here updates the entire public site across all builds.
 */

export type Palette = { from: string; via: string; to: string; accent: string };
export type ProfileId = 'harsh' | 'sushmita' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';
export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};
export type ViewerProfile = { id: ProfileId; name: string; blurb: string; color: string; order: SectionId[] };

export const profile = ${JSON.stringify(p, null, 2)};

export const education = ${JSON.stringify(edu, null, 2)};

export const experience = ${JSON.stringify(exp, null, 2)};

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  liveDemo?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
  featured?: boolean;
  order?: number;
};

export const projects: Project[] = ${JSON.stringify(proj, null, 2)};

export const achievements = ${JSON.stringify(ach, null, 2)};

export const certifications = ${JSON.stringify(cert, null, 2)};

export const skillCategories = ${JSON.stringify(skills, null, 2)};

export const skillEvidence: Record<string, string[]> = ${JSON.stringify(evidence, null, 2)};

export const seasons = ${JSON.stringify(seasons, null, 2)};

export const topPicks = ${JSON.stringify(picks, null, 2)};

export const introSlides = ${JSON.stringify(slides, null, 2)};

export const viewerProfiles: ViewerProfile[] = ${JSON.stringify(profiles, null, 2)};

const violet: Palette = { from: '#1a0b2e', via: '#3b1261', to: '#09070a', accent: '#c084fc' };
const amber: Palette = { from: '#2e1505', via: '#6e380f', to: '#09070a', accent: '#ffb547' };
const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const jade: Palette = { from: '#062017', via: '#0f523c', to: '#09070a', accent: '#46e3a8' };
const ocean: Palette = { from: '#071829', via: '#113e66', to: '#09070a', accent: '#4cc9ff' };

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & training', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: \`\${seasons.length} Seasons • \${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes\`, palette: amber },
  originals: { nav: 'Originals', card: 'My Projects', meta: \`\${projects.length} Originals • 2026\`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 from the resume', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: \`\${skillCategories.length} Categories\`, palette: ocean },
  moments: { nav: 'Moments', card: 'My Achievements', meta: \`\${achievements.length} Moments • \${certifications.length} Certifications\`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
`;
}

