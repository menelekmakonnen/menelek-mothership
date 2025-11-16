import { useCameraContext } from '@/context/CameraContext';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home as HomeIcon,
  Film,
  BookOpen,
  Brain,
  Video,
  Camera,
  Image,
  FileText,
  Link2,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Globe,
} from 'lucide-react';

// Camera components
import BootSequence from '@/components/camera/BootSequence';
import PowerButton from '@/components/camera/PowerButton';
import CameraHUD from '@/components/camera/CameraHUD';
import ControlBoxes from '@/components/camera/ControlBoxes';
import IrisTransition from '@/components/camera/IrisTransition';
import FocusIndicator from '@/components/camera/FocusIndicator';
import BottomMenu from '@/components/camera/BottomMenu';
import MobileImmersiveHUD from '@/components/camera/MobileImmersiveHUD';
import InterfaceOverlays from '@/components/camera/InterfaceOverlays';
import ShutdownSequence from '@/components/camera/ShutdownSequence';

// UI components
import RuleOfThirds from '@/components/ui/RuleOfThirds';
import Histogram from '@/components/ui/Histogram';
import SectionNavButtons from '@/components/ui/SectionNavButtons';

// Section components
import SectionNavigation from '@/components/SectionNavigation';
import IntroductionSection from '@/components/sections/IntroductionSection';
import LinksSection from '@/components/sections/LinksSection';
import GalleriaHome from '@/components/GalleriaHome';

const SECTION_NAV_ITEMS = [
  { id: 0, name: 'Home', icon: HomeIcon, gradient: 'from-green-600 to-emerald-600' },
  { id: 1, name: 'Films', icon: Film, gradient: 'from-red-600 to-orange-600' },
  { id: 2, name: 'Loremaker', icon: BookOpen, gradient: 'from-purple-600 to-pink-600' },
  { id: 3, name: 'AI Projects', icon: Brain, gradient: 'from-blue-600 to-cyan-600' },
  { id: 4, name: 'Video Edits', icon: Video, gradient: 'from-indigo-600 to-purple-600' },
  { id: 5, name: 'Photography', icon: Camera, gradient: 'from-teal-600 to-cyan-600' },
  { id: 6, name: 'AI Albums', icon: Image, gradient: 'from-pink-600 to-rose-600' },
  { id: 7, name: 'Blog', icon: FileText, gradient: 'from-yellow-600 to-orange-600' },
  { id: 8, name: 'Links', icon: Link2, gradient: 'from-cyan-600 to-blue-600' },
];

const STANDBY_LINKS = [
  { href: 'https://instagram.com/menelek.makonnen', label: 'Instagram', icon: Instagram },
  { href: 'https://youtube.com/@menelekmakonnen', label: 'YouTube', icon: Youtube },
  { href: 'https://linkedin.com/in/menelekmakonnen', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:admin@menelekmakonnen.com', label: 'Email', icon: Mail },
  { href: 'https://www.youtube.com/@director_menelek', label: 'Director Channel', icon: Youtube },
  { href: 'https://www.instagram.com/lore.maker', label: 'Loremaker IG', icon: Instagram },
  { href: 'https://www.instagram.com/icuni_', label: 'ICUNI IG', icon: Instagram },
  { href: 'https://loremaker.cloud', label: 'Website', icon: Globe },
];
import FilmsSection from '@/components/sections/FilmsSection';
import LoremakerSection from '@/components/sections/LoremakerSection';
import AIProjectsSection from '@/components/sections/AIProjectsSection';
import VideoEditsSection from '@/components/sections/VideoEditsSection';
import PhotographySection from '@/components/sections/PhotographySection';
import AIAlbumsSection from '@/components/sections/AIAlbumsSection';
import BlogSection from '@/components/sections/BlogSection';

export default function Home() {
  const {
    powerState,
    powerOn,
    hasBooted,
    completeShutdown,
    theme,
    isChangingLens,
    setCurrentSection,
    currentSection,
    getIsoNoise,
    getContentFilter,
  } = useCameraContext();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply ISO noise and white balance effects
  const isoNoise = getIsoNoise();
  const contentFilter = getContentFilter();

  // Define all sections - Introduction first
  const sections = [
    <IntroductionSection key="intro" />,
    <FilmsSection key="films" />,
    <LoremakerSection key="loremaker" />,
    <AIProjectsSection key="ai-projects" />,
    <VideoEditsSection key="video-edits" />,
    <PhotographySection key="photography" />,
    <AIAlbumsSection key="ai-albums" />,
    <BlogSection key="blog" />,
    <LinksSection key="links" />,
  ];

  if (powerState === 'shutting-down') {
    return <ShutdownSequence onComplete={completeShutdown} />;
  }

  // Power off state
  if (powerState === 'off') {
    return <PowerButton onClick={powerOn} />;
  }

  // Boot sequence
  if (powerState === 'booting' || (powerState === 'on' && !hasBooted)) {
    return <BootSequence onComplete={() => {}} />;
  }

  // Standby state
  if (powerState === 'standby') {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(32,64,64,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,12,18,0.6),transparent_70%)]" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 px-6 text-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={powerOn}
            className="group relative overflow-hidden rounded-full border border-white/20 px-12 py-4 text-lg font-semibold uppercase tracking-[0.6em] text-white mono"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-cyan-400/20 to-emerald-500/30 group-hover:via-white/20 transition-all" />
            <span className="relative z-10">Tap to Wake</span>
          </motion.button>

          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            {STANDBY_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main camera interface
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg-primary)]">
      {/* ISO Noise overlay */}
      <div className="iso-noise" style={{ opacity: isoNoise }} />

      {/* Lens change transition */}
      <IrisTransition isActive={isChangingLens} />

      {/* Focus indicator (custom cursor) */}
      <FocusIndicator />

      {/* Rule of thirds grid */}
      <RuleOfThirds />

      {/* Histogram */}
      <Histogram />

      {/* Mode-specific overlays */}
      <InterfaceOverlays />

      {/* Section navigation buttons (show all except current section) */}
      <SectionNavButtons
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        navItems={SECTION_NAV_ITEMS}
      />

      {/* Control boxes */}
      <ControlBoxes />

      {/* Mobile immersive interface */}
      <MobileImmersiveHUD />

      {/* Main content - Section navigation */}
      <div className="relative z-[1] w-full overflow-hidden">
        <SectionNavigation
          sections={sections}
          contentStyle={contentFilter.filter ? { filter: contentFilter.filter } : undefined}
          sectionMeta={SECTION_NAV_ITEMS.map(({ id, name }) => ({ id, name }))}
        />
      </div>

      {/* Camera HUD */}
      <CameraHUD />

      {/* Bottom navigation menu */}
      <BottomMenu />
      <GalleriaHome />
    </div>
  );
}
