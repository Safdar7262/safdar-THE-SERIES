import type { Palette, PaletteName } from './types';

/** The backend sends a colour NAME ("crimson"); this turns it into the actual gradient colours. */
export const palettes: Record<PaletteName, Palette> = {
  crimson: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
  amber: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
  ocean: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
  violet: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
  jade: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
};

export const getPalette = (name: string): Palette => palettes[name as PaletteName] ?? palettes.crimson;
