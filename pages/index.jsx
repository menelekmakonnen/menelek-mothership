import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import {
  Activity,
  GaugeCircle,
  Radar,
  RefreshCcw,
  Shield,
  SignalHigh,
  Target,
  Zap,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const profileSequence = ['none', 'few', 'most', 'all'];

const profileReadouts = {
  none: [],
  few: ['velocity', 'shield'],
  most: ['velocity', 'shield', 'reactor', 'nav'],
  all: ['velocity', 'shield', 'reactor', 'nav', 'comms'],
};

const readoutMeta = {
  velocity: {
    label: 'Velocity',
    icon: GaugeCircle,
    suffix: 'm/s',
    decimals: 0,
  },
  shield: {
    label: 'Shield',
    icon: Shield,
    suffix: '%',
    decimals: 0,
  },
  reactor: {
    label: 'Reactor Flux',
    icon: Zap,
    suffix: 'MW',
    decimals: 1,
  },
  nav: {
    label: 'Nav Drift',
    icon: Target,
    suffix: '°',
    decimals: 2,
  },
  comms: {
    label: 'Signal Lock',
    icon: SignalHigh,
    suffix: '%',
    decimals: 0,
  },
};

function useAnimatedNumber(value) {
  const spring = useSpring(value, { stiffness: 140, damping: 18, mass: 0.6 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => setDisplay(v));
    return () => unsubscribe();
  }, [spring]);

  return display;
}

function AnimatedValue({ value, suffix = '', decimals = 0 }) {
  const animated = useAnimatedNumber(value);
  const formatted = useMemo(() => animated.toFixed(decimals), [animated, decimals]);

  return (
    <motion.span
      layout
      className="hud-value"
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      <span>{formatted}</span>
      {suffix && <small style={{ fontSize: '0.5em', marginLeft: '0.35em' }}>{suffix}</small>}
    </motion.span>
  );
}

function TooltipButton({ side = 'right', label, description, icon: Icon, onPress }) {
  const tooltipId = useMemo(() => `tooltip-${label.toLowerCase().replace(/\s+/g, '-')}`, [label]);
  const descriptionLines = useMemo(() => description.split('\n'), [description]);

  return (
    <div className="tooltip-wrapper" data-side={side}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        onClick={onPress}
      >
        <Icon size={20} />
      </button>
      <div className="tooltip-content" role="tooltip" id={tooltipId}>
        <strong style={{ display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </strong>
        <span style={{ color: '#cbd5f5' }}>
          {descriptionLines.map((line, index) => (
            <span key={`${tooltipId}-${index}`} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function CustomCursor({ onFocusLock }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [pressed, setPressed] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleDown = () => {
      setPressed(true);
      setPulseKey((key) => key + 1);
      onFocusLock?.();
    };

    const handleUp = () => setPressed(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [onFocusLock]);

  return (
    <motion.div
      className="cursor-overlay"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      animate={{ scale: pressed ? 0.85 : 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <motion.div
        key={pulseKey}
        className="cursor-ring"
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: [0.8, 1.35, 1], opacity: [0.6, 0.1, 0.4] }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      <motion.div
        className="cursor-core"
        animate={{ scale: pressed ? 0.6 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
    </motion.div>
  );
}

export default function Home() {
  const [profileIndex, setProfileIndex] = useState(3);
  const profile = profileSequence[profileIndex];
  const [metrics, setMetrics] = useState({
    velocity: 128,
    shield: 82,
    reactor: 45.5,
    nav: 0.34,
    comms: 72,
  });
  const [reactorOnline, setReactorOnline] = useState(true);
  const audioContextRef = useRef(null);
  const [focusLockWave, setFocusLockWave] = useState(0);

  const updateMetric = useCallback((key, amount) => {
    setMetrics((current) => {
      const next = { ...current };
      const updated = current[key] + amount;

      if (key === 'nav') {
        next[key] = Number(Math.max(-3, Math.min(3, updated)).toFixed(2));
      } else if (key === 'shield' || key === 'comms') {
        next[key] = Math.max(0, Math.min(100, Math.round(updated)));
      } else {
        next[key] = Number(Math.max(0, updated).toFixed(key === 'reactor' ? 1 : 0));
      }

      return next;
    });
  }, []);

  const cycleProfile = useCallback(() => {
    setProfileIndex((current) => (current + 1) % profileSequence.length);
  }, []);

  const setProfileByKey = useCallback((targetProfile) => {
    const idx = profileSequence.indexOf(targetProfile);
    if (idx >= 0) {
      setProfileIndex(idx);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.key === 'h' && event.altKey) {
        event.preventDefault();
        cycleProfile();
        return;
      }
      if (event.key >= '1' && event.key <= '4') {
        const mapping = ['none', 'few', 'most', 'all'];
        const target = mapping[Number(event.key) - 1];
        setProfileByKey(target);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleProfile, setProfileByKey]);

  const visibleReadouts = profileReadouts[profile];

  const leftControls = useMemo(
    () => [
      {
        label: 'Boost velocity',
        description: 'Increase forward velocity by +12 m/s.',
        icon: Activity,
        action: () => updateMetric('velocity', 12),
      },
      {
        label: 'Stabilize drift',
        description: 'Apply counter-thrust to reduce navigation drift.',
        icon: Radar,
        action: () => updateMetric('nav', -0.12),
      },
      {
        label: 'Shield recharge',
        description: 'Divert aux power for +8% shield reinforcement.',
        icon: Shield,
        action: () => updateMetric('shield', 8),
      },
    ],
    [updateMetric]
  );

  const rightControls = useMemo(
    () => [
      {
        label: reactorOnline ? 'Reactor standby' : 'Reactor online',
        description: reactorOnline
          ? 'Throttle reactor output to idle.\nShortcut: press Alt + R.'
          : 'Return reactor to full output.\nShortcut: press Alt + R.',
        icon: reactorOnline ? ToggleLeft : ToggleRight,
        action: () => {
          setReactorOnline((state) => !state);
          setMetrics((current) => ({ ...current, reactor: reactorOnline ? 12.4 : 46.8 }));
        },
      },
      {
        label: 'Comms pulse',
        description: 'Cycle array to improve signal lock by +5%.',
        icon: SignalHigh,
        action: () => updateMetric('comms', 5),
      },
      {
        label: 'Flux purge',
        description: 'Dump heat exchangers to reset readings.',
        icon: RefreshCcw,
        action: () =>
          setMetrics({ velocity: 96, shield: 68, reactor: 32.6, nav: 0.52, comms: 64 }),
      },
    ],
    [reactorOnline, updateMetric]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleAltR = (event) => {
      if (event.key.toLowerCase() === 'r' && event.altKey) {
        event.preventDefault();
        rightControls[0].action();
      }
    };

    window.addEventListener('keydown', handleAltR);
    return () => window.removeEventListener('keydown', handleAltR);
  }, [rightControls]);

  const visibleEntries = visibleReadouts.map((key) => ({
    key,
    value: metrics[key],
    ...readoutMeta[key],
  }));

  const triggerFocusLock = useCallback(() => {
    if (typeof window === 'undefined') return;

    setFocusLockWave((wave) => wave + 1);

    if (audioContextRef.current == null) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }, []);

  useEffect(() => {
    if (!focusLockWave) return undefined;
    const timeout = setTimeout(() => setFocusLockWave(0), 360);
    return () => clearTimeout(timeout);
  }, [focusLockWave]);

  return (
    <main className={`scene${focusLockWave ? ' scene--focus-lock' : ''}`}>
      <div className="hud-shell">
        <header className="hud-header">
          <span>Flight Deck HUD</span>
          <button type="button" className="hud-toggle" onClick={cycleProfile}>
            <Eye size={16} /> Profile: {profile.toUpperCase()}
          </button>
        </header>
      </div>

      <div className="hud-container" aria-live="polite">
        <motion.div layout className="hud-grid">
          {visibleEntries.length === 0 ? (
            <span className="hud-footnote">HUD suppressed · Press Alt + H or use the toggle to restore.</span>
          ) : (
            visibleEntries.map(({ key, label, icon: Icon, value, suffix, decimals }) => (
              <motion.div
                key={key}
                layout
                className="hud-readout"
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              >
                <span className="hud-label">
                  <Icon size={14} /> {label}
                </span>
                <AnimatedValue value={value} suffix={suffix} decimals={decimals} />
              </motion.div>
            ))
          )}
        </motion.div>
        <div className="hud-footnote">Alt + H cycles visibility · Profiles 1-4 jump directly.</div>
      </div>

      <div className="control-cluster left" aria-label="Primary thruster controls">
        {leftControls.map(({ label, description, icon, action }) => (
          <TooltipButton
            key={label}
            side="right"
            label={label}
            description={description}
            icon={icon}
            onPress={action}
          />
        ))}
      </div>

      <div className="control-cluster right" aria-label="Auxiliary ship controls">
        {rightControls.map(({ label, description, icon, action }) => (
          <TooltipButton
            key={label}
            side="left"
            label={label}
            description={description}
            icon={icon}
            onPress={action}
          />
        ))}
      </div>

      <CustomCursor onFocusLock={triggerFocusLock} />
    </main>
  );
}
