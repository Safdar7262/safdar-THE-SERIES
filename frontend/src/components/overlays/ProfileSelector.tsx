import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio, viewerProfiles, type ProfileId } from '../../data';
import ProfileAvatar from '../ui/ProfileAvatar';
import { EASE } from '../ui/fx';

export default function ProfileSelector({ onPick }: { onPick: (id: ProfileId) => void }) {
  const { profile } = usePortfolio();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onPick('safdar');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPick]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto bg-ink px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: EASE }}
      role="dialog"
      aria-label="Who's watching?"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(229,19,43,0.14),transparent_70%)]" />
      <motion.h2
        className="relative mb-10 text-center font-sans text-3xl font-medium tracking-tight text-bone sm:text-5xl"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Who&apos;s watching?
      </motion.h2>
      <motion.ul
        className="relative grid grid-cols-2 gap-6 sm:flex sm:gap-8"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {viewerProfiles.map((p) => (
          <motion.li key={p.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
            <button type="button" onClick={() => onPick(p.id)} data-cursor="play" className="group flex flex-col items-center gap-3 text-center">
              <span className="relative rounded-xl ring-2 ring-transparent transition duration-300 group-hover:scale-105 group-hover:ring-bone group-focus-visible:ring-bone">
                <ProfileAvatar id={p.id} />
                {p.id === 'safdar' && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-crimson px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-white">MAIN</span>
                )}
              </span>
              <span className="font-sans text-sm font-medium text-mist transition group-hover:text-bone sm:text-base">{p.name}</span>
              <span className="max-w-[9rem] text-[11px] leading-snug text-smoke">{p.blurb}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
      <p className="relative mt-12 max-w-md text-center text-xs leading-relaxed text-smoke">
        Every profile watches the same true story of {profile.displayName} — it only changes what plays first.
      </p>
    </motion.div>
  );
}
