import { getPalette } from './palettes';
import type { Portfolio } from './types';

// In development Vite forwards /api to the Spring Boot server (see vite.config.ts).
// For a deployed site, set VITE_API_URL to the backend address, e.g. https://api.example.com
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** GET a JSON file, giving up after `ms` milliseconds. */
async function getJson(url: string, ms: number): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${url} answered with status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Loads the portfolio data:
 *   1. from the Spring Boot API (PostgreSQL);
 *   2. if the API is asleep / down (free hosting sleeps when idle), from /portfolio-data.json,
 *      a copy of the same data that ships with the website. So the site always opens fast.
 */
export async function fetchPortfolio(): Promise<Portfolio> {
  let raw: any;
  try {
    raw = await getJson(`${BASE_URL}/api/portfolio`, 4000);
  } catch {
    raw = await getJson('/portfolio-data.json', 8000);
  }

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
