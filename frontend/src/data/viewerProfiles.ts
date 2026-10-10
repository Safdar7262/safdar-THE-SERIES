import type { Palette, Portfolio } from './types';
import { palettes } from './palettes';

/**
 * UI settings (not content), so they live in the frontend, not in the database.
 *
 * "Who's watching?" lets a visitor pick a profile. A profile only changes the ORDER of the sections.
 */
export type SectionId = 'about' | 'journey' | 'projects' | 'skills' | 'highlights' | 'resume';
export type ProfileId = 'safdar' | 'recruiter' | 'developer';

export const viewerProfiles: { id: ProfileId; name: string; blurb: string; color: string; order: SectionId[] }[] = [
  {
    id: 'safdar',
    name: 'Safdar',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'projects', 'skills', 'highlights', 'resume'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, highlights & skills first',
    color: '#4cc9ff',
    order: ['resume', 'highlights', 'skills', 'projects', 'about', 'journey'],
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Projects, stack & GitHub first',
    color: '#46e3a8',
    order: ['projects', 'skills', 'journey', 'highlights', 'about', 'resume'],
  },
];

export type SectionMeta = { nav: string; card: string; meta: string; palette: Palette };

/** Titles used by the navbar and the "Continue Exploring" cards. The counts come from the real data. */
export function buildSectionMeta(p: Portfolio): Record<SectionId, SectionMeta> {
  const episodes = p.journey.reduce((n, s) => n + s.episodes.length, 0);
  return {
    about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & training', palette: palettes.violet },
    journey: { nav: 'Journey', card: 'My Journey', meta: `${p.journey.length} Seasons • ${episodes} Episodes`, palette: palettes.amber },
    projects: { nav: 'Projects', card: 'My Projects', meta: `${p.projects.length} Originals`, palette: palettes.crimson },
    skills: { nav: 'Skills', card: 'My Skills', meta: `${p.skills.length} Categories`, palette: palettes.ocean },
    highlights: { nav: 'Highlights', card: 'Top Moments', meta: `${p.highlights.length} Highlights`, palette: palettes.jade },
    resume: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: palettes.violet },
  };
}
