export type Palette = { from: string; via: string; to: string; accent: string };

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

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
  certificateImg?: string;
  order?: number;
};

export type Certification = {
  id?: string;
  issuer: string;
  name: string;
  link: string;
  date?: string;
  credentialId?: string;
};

export type Education = {
  school: string;
  place: string;
  degree: string;
  department?: string;
  period: string;
  score: string;
  isCurrent?: boolean;
  description?: string;
  logo?: string;
};

export type Experience = {
  company: string;
  role: string;
  place: string;
  period: string;
  points: string[];
  technologies?: string[];
  logo?: string;
};

export type Skill = {
  name: string;
  mono: string;
  note?: string;
  isLearning?: boolean;
};
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

export type TopPick = {
  label: string;
  title: string;
  detail: string;
  palette: Palette;
};

export type IntroSlide = {
  kicker: string;
  title: string;
  lines: string[];
  chips?: string[];
};

export type ProfileId = 'harsh' | 'sushmita' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export type ViewerProfile = {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
};

export type ProfileData = {
  fullName: string;
  displayName: string;
  firstName: string;
  seriesTag: string;
  originalLabel: string;
  role: string;
  tagline: string[];
  intro: string;
  location: string;
  email: string;
  links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  resumePdf: string;
  portrait: {
    src: string;
    srcSet?: string;
    alt: string;
  };
  interests: string[];
  availabilityStatus?: string;
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  themeColor: string;
  copyrightText?: string;
  footerQuote?: string;
};

export type ThemePreset = 'crimson' | 'violet' | 'emerald' | 'cyan' | 'amber' | 'slate';

export type ThemeSettings = {
  preset: ThemePreset;
  primaryColor: string;       // Accent / Brand (e.g. #e5132b)
  primaryColorHover: string;  // Accent light/glow (e.g. #ff3d5a)
  backgroundColor: string;    // Canvas background (e.g. #07070a)
  cardBackground: string;     // Card surface (e.g. #0e0e13)
  cardBorderColor: string;    // Card borders (e.g. #16161d)
  textColor: string;          // Main text (e.g. #f4f1ec)
  textMutedColor: string;     // Muted text (e.g. #a7a6ad)
  borderRadius: 'sharp' | 'rounded' | 'soft';
  glowIntensity: 'subtle' | 'balanced' | 'high';
  enableFilmGrain: boolean;
  cursorStyle: 'cinematic' | 'minimal' | 'system';
};

export type PortfolioData = {
  profile: ProfileData;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Certification[];
  skillCategories: SkillCategory[];
  skillEvidence: Record<string, string[]>;
  seasons: Season[];
  topPicks: TopPick[];
  introSlides: IntroSlide[];
  viewerProfiles: ViewerProfile[];
  siteSettings: SiteSettings;
  themeSettings?: ThemeSettings;
  lastUpdated?: string;
  version?: number;
};
