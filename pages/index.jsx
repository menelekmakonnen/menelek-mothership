import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

const PANELS = [
  {
    id: 'command',
    title: 'Command Deck',
    description:
      'Oversee fleet telemetry, initiate launch routines and coordinate with allied motherships in real time.',
    actions: [
      { id: 'launch', label: 'Prime Launch', detail: 'Arm thrusters and ready payload sequences.' },
      { id: 'sync', label: 'Fleet Sync', detail: 'Broadcast current formation vectors to wing leaders.' },
      { id: 'override', label: 'Manual Override', detail: 'Temporarily assume manual helm control.' },
    ],
    ambience: {
      background: 'radial-gradient(circle at 20% -10%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(circle at 80% 120%, rgba(244,114,182,0.18), transparent 55%), linear-gradient(130deg, rgba(14,116,144,0.45), rgba(88,28,135,0.35))',
      mid: 'radial-gradient(circle at 50% 50%, rgba(226,232,240,0.45), transparent 65%)',
    },
  },
  {
    id: 'navigation',
    title: 'Navigation Array',
    description:
      'Plot slipstream corridors, evaluate gravitational wells and share jump solutions with scout vessels.',
    actions: [
      { id: 'plot', label: 'Plot Jump', detail: 'Generate a three-hop slipstream itinerary.' },
      { id: 'scan', label: 'Deep Scan', detail: 'Resolve stellar objects along the projected corridor.' },
      { id: 'share', label: 'Share Trajectory', detail: 'Transmit optimal route to escort frigates.' },
    ],
    ambience: {
      background: 'radial-gradient(circle at 10% 30%, rgba(34,211,238,0.35), transparent 60%), radial-gradient(circle at 90% 80%, rgba(129,140,248,0.25), transparent 55%), linear-gradient(160deg, rgba(45,212,191,0.45), rgba(37,99,235,0.25))',
      mid: 'conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.45), rgba(14,165,233,0.1), transparent 70%)',
    },
  },
  {
    id: 'habitat',
    title: 'Habitat Systems',
    description:
      'Balance atmosphere, nutrition and circadian lighting for thousands of travelers across habitat rings.',
    actions: [
      { id: 'atmo', label: 'Atmosphere Tuning', detail: 'Adjust breathable mix and humidity gradients.' },
      { id: 'cycle', label: 'Cycle Lighting', detail: 'Blend morning spectrum across habitat decks.' },
      { id: 'wellness', label: 'Wellness Pulse', detail: 'Push restorative ambience and alert med bays.' },
    ],
    ambience: {
      background: 'radial-gradient(circle at 15% 15%, rgba(74,222,128,0.28), transparent 55%), radial-gradient(circle at 85% 95%, rgba(249,168,212,0.25), transparent 60%), linear-gradient(140deg, rgba(59,130,246,0.25), rgba(6,182,212,0.35))',
      mid: 'radial-gradient(circle at 55% 45%, rgba(190,242,100,0.3), transparent 70%)',
    },
  },
];

function formatFStop(aperture) {
  const min = 1.2;
  const max = 8;
  const value = min + (1 - aperture) * (max - min);
  return `f/${value.toFixed(1)}`;
}

function LayeredPanel({ panel, aperture, focusTarget, hasFocus, onFocusChange }) {
  const isPanelTarget = focusTarget?.panelId === panel.id;
  const focusKey = isPanelTarget ? `${focusTarget.panelId}:${focusTarget.controlId}` : null;
  const [pulse, setPulse] = useState(false);
  const [lastFocusKey, setLastFocusKey] = useState(null);

  useEffect(() => {
    if (focusKey && focusKey !== lastFocusKey) {
      setPulse(true);
      setLastFocusKey(focusKey);
      const timeout = setTimeout(() => setPulse(false), 650);
      return () => clearTimeout(timeout);
    }
    if (!focusKey) {
      setPulse(false);
      setLastFocusKey(null);
    }
  }, [focusKey, lastFocusKey]);

  const depthBlur = useMemo(() => {
    const backgroundBase = aperture * 28;
    const midBase = aperture * 16;
    const foregroundBase = aperture * 6;
    const focusEase = isPanelTarget ? 0.7 : hasFocus ? 1.18 : 1;
    const pulseBoost = pulse ? 1.25 : 1;

    return {
      background: Math.max(backgroundBase * focusEase * pulseBoost, 2).toFixed(2),
      mid: Math.max(midBase * focusEase * pulseBoost, 1).toFixed(2),
      foreground: Math.max(foregroundBase * (isPanelTarget ? 0.2 : hasFocus ? 0.9 : 0.6), 0).toFixed(2),
    };
  }, [aperture, hasFocus, isPanelTarget, pulse]);

  return (
    <article className="panel" aria-labelledby={`${panel.id}-title`}>
      <div className="panel__layers" aria-hidden="true">
        <div
          className="layer layer--background"
          style={{
            backgroundImage: panel.ambience.background,
            filter: `blur(${depthBlur.background}px)`,
          }}
        />
        <div
          className="layer layer--mid"
          style={{
            backgroundImage: panel.ambience.mid,
            filter: `blur(${depthBlur.mid}px) saturate(${isPanelTarget ? 1.1 : 0.9})`,
            transform: pulse ? 'scale(1.03)' : 'scale(1)',
          }}
        />
      </div>
      <div className="layer layer--foreground" style={{ filter: `blur(${depthBlur.foreground}px)` }}>
        <div className="panel__content">
          <h2 id={`${panel.id}-title`} className="panel__title">
            {panel.title}
          </h2>
          <p className="panel__description">{panel.description}</p>
          <div className="panel__controls" role="group" aria-label={`${panel.title} controls`}>
            {panel.actions.map((action) => {
              const isTargetControl = focusTarget?.panelId === panel.id && focusTarget.controlId === action.id;
              return (
                <div key={action.id}>
                  <span id={`${panel.id}-${action.id}-desc`} className="visually-hidden">
                    {action.detail}
                  </span>
                  <button
                    type="button"
                    className="control-button"
                    data-highlight={isTargetControl ? 'true' : 'false'}
                    data-pulsing={isTargetControl && pulse ? 'true' : 'false'}
                    aria-describedby={`${panel.id}-${action.id}-desc`}
                    onFocus={() => onFocusChange({ panelId: panel.id, controlId: action.id })}
                    onBlur={() =>
                      onFocusChange((previous) => {
                        if (!previous) return null;
                        if (previous.panelId === panel.id && previous.controlId === action.id) {
                          return null;
                        }
                        return previous;
                      })
                    }
                  >
                    {action.label}
                  </button>
                </div>
              );
            })}
          </div>
          <dl className="panel__meta">
            <div>
              <dt className="visually-hidden">Active focus</dt>
              <dd>{isPanelTarget ? 'Focus locked' : 'Peripheral'}</dd>
            </div>
            <div>
              <dt className="visually-hidden">Blur level</dt>
              <dd>{`${Math.round(aperture * 100)}% aperture energy`}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [aperture, setAperture] = useState(0.55);
  const [focusTarget, setFocusTarget] = useState(null);
  const hasFocus = Boolean(focusTarget);

  const handleFocusChange = (next) => {
    if (typeof next === 'function') {
      setFocusTarget((current) => next(current));
      return;
    }
    setFocusTarget(next);
  };

  return (
    <>
      <Head>
        <title>Mothership Depth Console</title>
        <meta name="description" content="Depth layered control panels with aperture driven focus transitions." />
      </Head>
      <main>
        <section className="panel-grid" aria-label="Mothership command panels">
          <div className="aperture-control">
            <label htmlFor="aperture-range">Aperture</label>
            <input
              id="aperture-range"
              className="aperture-control__range"
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={aperture}
              onChange={(event) => setAperture(parseFloat(event.target.value))}
              aria-valuetext={`${formatFStop(aperture)} depth of field`}
            />
            <div aria-live="polite">Current aperture: {formatFStop(aperture)}</div>
          </div>
          {PANELS.map((panel) => (
            <LayeredPanel
              key={panel.id}
              panel={panel}
              aperture={aperture}
              focusTarget={focusTarget}
              hasFocus={hasFocus}
              onFocusChange={handleFocusChange}
            />
          ))}
        </section>
      </main>
    </>
  );
}
