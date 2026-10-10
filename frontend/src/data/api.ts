import { getPalette } from './palettes';
import type { Portfolio } from './types';

// In development Vite forwards /api to the Spring Boot server (see vite.config.ts).
// For a deployed site, set VITE_API_URL to the backend address, e.g. https://api.example.com
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchPortfolio(): Promise<Portfolio> {
  const res = await fetch(`${BASE_URL}/api/portfolio`);
  if (!res.ok) throw new Error(`The API answered with status ${res.status}`);
  const raw: any = await res.json();

  // Small clean-up so components can use ready-made values:
  //  - palette names become real colours
  //  - the portrait image paths are added
  return {
    ...raw,
    profile: {
      ...raw.profile,
      portrait: {
        src: '/assets/portrait-560.webp',
        srcSet: '/assets/portrait-340.webp 340w, /assets/portrait-560.webp 560w, /assets/portrait-760.webp 760w',
        alt: `Portrait of ${raw.profile.displayName}`,
      },
    },
    projects: raw.projects.map((p: any) => ({ ...p, palette: getPalette(p.palette) })),
    journey: raw.journey.map((s: any) => ({
      ...s,
      episodes: s.episodes.map((e: any) => ({ ...e, palette: getPalette(e.palette) })),
    })),
  } as Portfolio;
}
