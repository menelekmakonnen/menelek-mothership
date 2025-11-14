import { useCameraContext } from '@/context/CameraContext';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Camera components
import BootSequence from '@/components/camera/BootSequence';
import PowerButton from '@/components/camera/PowerButton';
import CameraHUD from '@/components/camera/CameraHUD';
import ControlBoxes from '@/components/camera/ControlBoxes';
import FlashToggle from '@/components/camera/FlashToggle';
import CameraModeToggle from '@/components/camera/CameraModeToggle';
import LensToggle from '@/components/camera/LensToggle';
import IrisTransition from '@/components/camera/IrisTransition';
import FocusIndicator from '@/components/camera/FocusIndicator';
import BottomMenu from '@/components/camera/BottomMenu';
import PowerControls from '@/components/camera/PowerControls';
import MobileImmersiveHUD from '@/components/camera/MobileImmersiveHUD';

// UI components
import RuleOfThirds from '@/components/ui/RuleOfThirds';
import Histogram from '@/components/ui/Histogram';
import SectionNavButtons from '@/components/ui/SectionNavButtons';

// Section components
import SectionNavigation from '@/components/SectionNavigation';
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
    currentSection,
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
      <div className="w-full h-full flex items-center justify-center bg-black">
        <button
          onClick={powerOn}
          className="text-gray-400 hover:text-white transition-colors text-xl mono"
        >
          TAP TO WAKE
        </button>
      </div>
    );
  }

  // Main camera interface
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--bg-primary)]">
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

      {/* Section navigation buttons (show all except current section) */}
      <SectionNavButtons
        currentSection={currentSection}
        onNavigate={setCurrentSection}
      />

      {/* Flash toggle */}
      <FlashToggle />

      {/* Camera mode toggle */}
      <div className="fixed top-20 right-4 z-[1600] pointer-events-auto">
        <CameraModeToggle />
      </div>

      {/* Lens toggle */}
      <LensToggle />

      {/* Power controls under the lens */}
      <PowerControls />

      {/* Control boxes */}
      <ControlBoxes />

      {/* Mobile immersive interface */}
      <MobileImmersiveHUD />

      {/* Main content - Section navigation */}
      <div className="relative z-[1] h-full w-full overflow-hidden">
        <SectionNavigation
          sections={sections}
          contentStyle={wbFilter.filter ? { filter: wbFilter.filter } : undefined}
        />
      </div>

      {/* Camera HUD */}
      <CameraHUD />

      {/* Bottom navigation menu */}
      <BottomMenu />
    </div>
  );
}
