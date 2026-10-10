/** Shapes of the data returned by the backend (GET /api/portfolio). */

export type Palette = { from: string; via: string; to: string; accent: string };
export type PaletteName = 'crimson' | 'amber' | 'ocean' | 'violet' | 'jade';

export type Profile = {
  fullName: string;
  displayName: string;
  firstName: string;
  seriesTag: string;
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: string;
  role: string;
  tagline: string[];
  intro: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumePdf: string;
  heroFacts: string[];
  floatingChips: { text: string; sub: string }[];
  strengths: string[];
  /** Added by the frontend (the images live in /public/assets). */
  portrait: { src: string; srcSet: string; alt: string };
};

export type Education = { school: string; place: string; degree: string; period: string; score: string };

export type Training = { company: string; role: string; place: string; period: string; points: string[] };

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  badge: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export type Episode = { code: string; title: string; description: string; tags: string[]; runtime: string; palette: Palette };
export type Season = { number: number; title: string; period: string; synopsis: string; episodes: Episode[] };

export type Highlight = { id: string; title: string; org: string; detail: string; laurel: string };

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export type Portfolio = {
  profile: Profile;
  education: Education[];
  training: Training[];
  projects: Project[];
  skills: SkillCategory[];
  skillEvidence: Record<string, string[]>;
  journey: Season[];
  highlights: Highlight[];
  introSlides: IntroSlide[];
};
