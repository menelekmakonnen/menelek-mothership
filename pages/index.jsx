import { useCameraContext } from '@/context/CameraContext';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Camera components
import BootSequence from '@/components/camera/BootSequence';
import PowerButton from '@/components/camera/PowerButton';
import CameraHUD from '@/components/camera/CameraHUD';
import ControlBoxes from '@/components/camera/ControlBoxes';
import DesktopControls from '@/components/camera/DesktopControls';
import CameraModeToggle from '@/components/camera/CameraModeToggle';
import IrisTransition from '@/components/camera/IrisTransition';
import FocusIndicator from '@/components/camera/FocusIndicator';

// UI components
import RuleOfThirds from '@/components/ui/RuleOfThirds';
import Histogram from '@/components/ui/Histogram';
import NavbarTextPopup from '@/components/NavbarTextPopup';

// Section components
import SectionNavigation from '@/components/SectionNavigation';
import CoverSection from '@/components/sections/CoverSection';
import IntroductionSection from '@/components/sections/IntroductionSection';
import LinksSection from '@/components/sections/LinksSection';
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
    theme,
    isChangingLens,
    setCurrentSection,
    getIsoNoise,
    getWhiteBalanceFilter,
  } = useCameraContext();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply ISO noise and white balance effects
  const isoNoise = getIsoNoise();
  const wbFilter = getWhiteBalanceFilter();

  // Define all sections
  const sections = [
    <CoverSection key="cover" onSectionSelect={(index) => setCurrentSection(index)} />,
    <IntroductionSection key="intro" />,
    <LinksSection key="links" />,
    <FilmsSection key="films" />,
    <LoremakerSection key="loremaker" />,
    <AIProjectsSection key="ai-projects" />,
    <VideoEditsSection key="video-edits" />,
    <PhotographySection key="photography" />,
    <AIAlbumsSection key="ai-albums" />,
    <BlogSection key="blog" />,
  ];

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
      <div className="w-full h-full flex flex-col items-center justify-center bg-black gap-12">
        {/* Wake button */}
        <button
          onClick={powerOn}
          className="relative group mono text-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative px-8 py-4 bg-black border-2 border-green-500/50 rounded-full hover:border-green-400 transition-all group-hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <span className="text-green-400 group-hover:text-green-300 transition-colors font-bold tracking-wider">
              ⚡ TAP TO WAKE ⚡
            </span>
          </div>
        </button>

        {/* Social media links */}
        <div className="flex gap-6 items-center">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-400 transition-colors transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-400 transition-colors transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-red-400 transition-colors transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 9.7s-.23-1.62-.93-2.33a3.5 3.5 0 00-2.46-1C16.08 6.14 12 6.14 12 6.14s-4.08 0-7.61.23a3.5 3.5 0 00-2.46 1C1.23 8.08 1 9.7 1 9.7S.77 11.55.77 13.4v1.73c0 1.85.23 3.7.23 3.7s.23 1.62.93 2.33a3.99 3.99 0 002.76 1.08c2.01.19 7.31.25 7.31.25s4.08-.01 7.61-.24a3.5 3.5 0 002.46-1c.7-.71.93-2.33.93-2.33s.23-1.85.23-3.7V13.4c0-1.85-.23-3.7-.23-3.7zM9.74 15.88V10l6.16 2.94-6.16 2.94z"></path>
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition-colors transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // Main camera interface
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        filter: wbFilter.filter || '',
        '--lens-zoom': currentLens.zoom,
      }}
    >
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

      {/* Camera mode toggle */}
      <div className="fixed top-20 right-4 z-[1600] pointer-events-auto">
        <CameraModeToggle />
      </div>

      {/* Navbar text popup */}
      <NavbarTextPopup />

      {/* Desktop controls (hidden on mobile) */}
      <DesktopControls />

      {/* Mobile control boxes (hidden on desktop) */}
      <ControlBoxes />

      {/* Main content - Section navigation */}
      <div className="w-full h-full">
        <SectionNavigation sections={sections} />
      </div>

      {/* Camera HUD */}
      <CameraHUD />
    </div>
  );
}
