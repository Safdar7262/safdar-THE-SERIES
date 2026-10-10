import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { PortfolioProvider, viewerProfiles, type ProfileId, type Project, type SectionId } from './data';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import { EASE } from './components/ui/fx';
import CustomCursor from './components/ui/CustomCursor';

// layout
import Navbar from './components/layout/Navbar';
import Scene from './components/layout/Scene';
import SectionRail from './components/layout/SectionRail';
import Contact from './components/layout/Contact';

// page sections (one file each)
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Journey from './components/sections/Journey';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Highlights from './components/sections/Highlights';
import Resume from './components/sections/Resume';

// full-screen overlays
import OpeningSequence from './components/overlays/OpeningSequence';
import ProfileSelector from './components/overlays/ProfileSelector';

// Overlays opened on demand are split out of the first download.
const PlayIntro = lazy(() => import('./components/overlays/PlayIntro'));
const ProjectModal = lazy(() => import('./components/overlays/ProjectModal'));
const ResumeModal = lazy(() => import('./components/overlays/ResumeModal'));

/** The visitor first sees the opening titles, then picks a profile, then the home page. */
type Stage = 'opening' | 'profiles' | 'home';

const STORAGE_KEY = 'safdar-series-profile';

function readStoredProfile(): ProfileId | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return viewerProfiles.some((p) => p.id === v) ? (v as ProfileId) : null;
  } catch {
    return null;
  }
}

export default function App() {
  return (
    <PortfolioProvider>
      <SmoothScrollProvider>
        <Series />
      </SmoothScrollProvider>
    </PortfolioProvider>
  );
}

function Series() {
  const stored = readStoredProfile();
  const [stage, setStage] = useState<Stage>(stored ? 'home' : 'opening');
  const [profileId, setProfileId] = useState<ProfileId>(stored ?? 'safdar');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { scrollTo, lock, unlock } = useSmoothScroll();

  const order = viewerProfiles.find((p) => p.id === profileId)!.order;

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  const pickProfile = useCallback(
    (id: ProfileId) => {
      setProfileId(id);
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* storage unavailable — profile simply won't persist */
      }
      if (stage !== 'home') {
        window.scrollTo(0, 0);
        setStage('home');
      } else {
        const p = viewerProfiles.find((v) => v.id === id)!;
        setToast(`Now watching as ${p.name} — ${p.blurb.toLowerCase()}`);
        scrollTo(0, { offset: 0 });
      }
    },
    [stage, scrollTo],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  // Which component renders which section id. The profile's `order` decides the sequence.
  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: <Journey />,
    projects: <Projects onOpen={setProject} />,
    skills: <Skills />,
    highlights: <Highlights />,
    resume: <Resume onView={() => setResumeOpen(true)} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <AnimatePresence>
        {stage === 'opening' && <OpeningSequence key="opening" onDone={() => setStage('profiles')} />}
        {stage === 'profiles' && <ProfileSelector key="profiles" onPick={pickProfile} />}
      </AnimatePresence>

      {stage === 'home' && (
        <motion.div initial={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease: EASE }}>
          <Navbar order={order} profileId={profileId} onSwitch={pickProfile} />
          <main>
            <Hero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onResume={() => setResumeOpen(true)} profileId={profileId} />
            <SectionRail order={order} />
            {order.map((id) => (
              <Scene key={id} id={id} className={id === 'projects' ? '!py-0 sm:!py-0' : ''}>
                {sections[id]}
              </Scene>
            ))}
            <Contact onReplay={() => setStage('opening')} />
          </main>
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
