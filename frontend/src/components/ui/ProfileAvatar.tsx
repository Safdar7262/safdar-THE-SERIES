import { viewerProfiles, type ProfileId } from '../../data';

/** The small square picture for a "Who's watching?" profile. Safdar's profile uses his photo. */
export default function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-xl' : 'h-8 w-8 rounded-md';
  if (id === 'safdar') {
    return (
      <span className={`relative block overflow-hidden ${box}`} style={{ background: 'radial-gradient(circle at 50% 30%, #7a0f24, #1a0509)' }}>
        <img src="/assets/portrait-340.webp" alt="" className="absolute left-1/2 top-[-8%] h-[160%] w-auto max-w-none -translate-x-1/2" />
      </span>
    );
  }
  const glyph = { recruiter: 'R', developer: '</>' }[id];
  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden font-display text-bone ${box}`}
      style={{ background: `linear-gradient(145deg, ${p.color}, #0b0b10 120%)` }}
    >
      <span className={size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-sm'}>{glyph}</span>
    </span>
  );
}
