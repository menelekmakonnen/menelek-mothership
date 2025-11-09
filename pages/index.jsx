import { useEffect, useMemo, useRef, useState } from 'react';
import { lensProfiles } from '../config/lensProfiles';

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_vignette;
uniform float u_distortion;
uniform float u_blur;
uniform float u_apertureNorm;
uniform float u_fov;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 baseScene(vec2 uv, float time, float fov) {
  float gradient = smoothstep(0.0, 1.0, uv.y);
  vec3 sky = mix(vec3(0.05, 0.08, 0.12), vec3(0.2, 0.28, 0.45), gradient);
  vec3 ground = mix(vec3(0.12, 0.1, 0.14), vec3(0.08, 0.07, 0.09), uv.y);
  vec3 color = mix(ground, sky, smoothstep(0.4, 0.7, uv.y));
  float streak = smoothstep(0.45, 0.75, uv.x + sin(time * 0.3) * 0.05);
  color += streak * vec3(0.4, 0.5, 0.6);
  float parallax = sin((uv.x + uv.y) * (fov * 0.06) + time * 0.3);
  color += parallax * 0.05;
  float sparkle = pow(hash(floor(uv * 12.0) + time), 6.0);
  color += sparkle * 0.2;
  return color;
}

vec2 distort(vec2 uv, float distortion) {
  vec2 centered = uv * 2.0 - 1.0;
  float r2 = dot(centered, centered);
  float factor = 1.0 + distortion * r2;
  centered *= factor;
  return (centered + 1.0) * 0.5;
}

vec3 radialBlur(vec2 uv, vec2 originalUV, float blur, float apertureNorm, float time, float fov) {
  vec2 center = vec2(0.5);
  vec2 dir = uv - center;
  float baseStrength = blur * (1.15 - apertureNorm);
  baseStrength *= smoothstep(0.1, 0.9, length(originalUV - center));
  vec3 accum = vec3(0.0);
  float total = 0.0;
  for (int i = 0; i < 6; i++) {
    float t = float(i) / 5.0;
    float offset = mix(-baseStrength, baseStrength, t);
    vec2 sampleUV = center + dir * (1.0 + offset);
    sampleUV = clamp(sampleUV, 0.0, 1.0);
    accum += baseScene(sampleUV, time, fov);
    total += 1.0;
  }
  return accum / max(total, 0.0001);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float time = u_time;
  vec2 distorted = distort(uv, u_distortion);
  vec3 color = radialBlur(distorted, uv, u_blur, u_apertureNorm, time, u_fov);
  float dist = length(distorted - 0.5);
  float vignette = smoothstep(0.2, 0.75, dist);
  color *= mix(1.0, 1.0 - vignette, clamp(u_vignette, 0.0, 1.0));
  float scan = sin((uv.y + time * 0.3) * 420.0) * 0.01;
  color += scan;
  float focusPulse = sin(time * 0.8) * 0.5 + 0.5;
  color *= 0.9 + focusPulse * 0.1 * (1.0 - u_apertureNorm);
  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
  const vertexShader = compileShader(gl, vertexSrc, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function LensCanvas({ lens, aperture }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const uniformRef = useRef({});
  const frameRef = useRef(null);
  const startTimeRef = useRef(performance.now());

  const apertureNorm = useMemo(() => {
    const range = lens.maxAperture - lens.minAperture || 1;
    return Math.min(1, Math.max(0, (aperture - lens.minAperture) / range));
  }, [lens, aperture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported in this browser');
      return;
    }
    glRef.current = gl;
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    uniformRef.current = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      vignette: gl.getUniformLocation(program, 'u_vignette'),
      distortion: gl.getUniformLocation(program, 'u_distortion'),
      blur: gl.getUniformLocation(program, 'u_blur'),
      aperture: gl.getUniformLocation(program, 'u_apertureNorm'),
      fov: gl.getUniformLocation(program, 'u_fov'),
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth * ratio;
      const height = canvas.clientHeight * ratio;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const program = programRef.current;
    const uniforms = uniformRef.current;
    if (!gl || !canvas || !program || !uniforms.resolution) return;

    const render = (time) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.vignette, lens.vignetteIntensity);
      const distortionAmount = lens.distortion === 'pincushion'
        ? -Math.abs(lens.distortionAmount)
        : Math.abs(lens.distortionAmount);
      gl.uniform1f(uniforms.distortion, distortionAmount);
      const blurStrength = lens.radialBlurStrength * (1.2 - apertureNorm);
      gl.uniform1f(uniforms.blur, blurStrength);
      gl.uniform1f(uniforms.aperture, apertureNorm);
      gl.uniform1f(uniforms.fov, lens.fov);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [lens, apertureNorm]);

  return <canvas ref={canvasRef} className="lens-canvas" />;
}

function LensHud({ lens, aperture, onApertureChange }) {
  const apertureNorm = useMemo(() => {
    const range = lens.maxAperture - lens.minAperture || 1;
    return Math.min(1, Math.max(0, (aperture - lens.minAperture) / range));
  }, [lens, aperture]);

  return (
    <div className="hud">
      <div className="hud__title">{lens.label}</div>
      <div className="hud__metrics">
        <div>
          <span className="hud__metric-label">FOV</span>
          <span className="hud__metric-value">{lens.fov}°</span>
        </div>
        <div>
          <span className="hud__metric-label">Aperture</span>
          <span className="hud__metric-value">f/{aperture.toFixed(1)}</span>
        </div>
      </div>
      <label className="hud__slider">
        <span>Aperture Control</span>
        <input
          type="range"
          min={lens.minAperture}
          max={lens.maxAperture}
          step={0.1}
          value={aperture}
          onChange={(event) => onApertureChange(Number(event.target.value))}
          style={{ '--accent': lens.hudAccent }}
        />
        <div className="hud__slider-labels">
          <span>f/{lens.minAperture.toFixed(1)}</span>
          <span>f/{lens.maxAperture.toFixed(1)}</span>
        </div>
      </label>
      <div className="hud__meter">
        <div className="hud__meter-fill" style={{ width: `${(1 - apertureNorm) * 100}%`, backgroundColor: lens.hudAccent }} />
        <span className="hud__meter-label">Bokeh Intensity</span>
      </div>
    </div>
  );
}

function BokehLayer({ lens, aperture }) {
  const apertureNorm = useMemo(() => {
    const range = lens.maxAperture - lens.minAperture || 1;
    return Math.min(1, Math.max(0, (aperture - lens.minAperture) / range));
  }, [lens, aperture]);

  const circles = useMemo(() => {
    const count = 8;
    const items = [];
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 30 + 18 * Math.sin((i + 1) * 1.3);
      const offsetX = Math.sin(angle * 1.3) * 35 + 50;
      const offsetY = Math.cos(angle * 0.9) * 25 + 45;
      const scale = 0.8 + (1 - apertureNorm) * (0.6 + (i % 3) * 0.15);
      items.push({
        id: `${lens.id}-${i}`,
        left: `${offsetX}%`,
        top: `${offsetY}%`,
        size: `${radius * scale}px`,
        opacity: 0.1 + (1 - apertureNorm) * 0.3,
      });
    }
    return items;
  }, [lens.id, apertureNorm]);

  return (
    <div className="bokeh-layer">
      {circles.map((circle) => (
        <span
          key={circle.id}
          className="bokeh-circle"
          style={{
            left: circle.left,
            top: circle.top,
            width: circle.size,
            height: circle.size,
            opacity: circle.opacity,
          }}
        />
      ))}
    </div>
  );
}

function LensSelector({ activeLensId, onSelect }) {
  return (
    <div className="lens-selector">
      {lensProfiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          onClick={() => onSelect(profile.id)}
          className={profile.id === activeLensId ? 'active' : ''}
        >
          <span className="lens-selector__label">{profile.label}</span>
          <span className="lens-selector__range">f/{profile.minAperture.toFixed(1)} – f/{profile.maxAperture.toFixed(1)}</span>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeLensId, setActiveLensId] = useState(lensProfiles[0].id);
  const activeLens = useMemo(() => lensProfiles.find((lens) => lens.id === activeLensId) ?? lensProfiles[0], [activeLensId]);
  const [aperture, setAperture] = useState(activeLens.defaultAperture);
  const [isRolling, setIsRolling] = useState(false);
  const [rollSequence, setRollSequence] = useState(0);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    setAperture(activeLens.defaultAperture);
    if (hasMountedRef.current) {
      setIsRolling(true);
      setRollSequence((value) => value + 1);
      const timer = setTimeout(() => setIsRolling(false), 650);
      return () => clearTimeout(timer);
    }
    hasMountedRef.current = true;
    return undefined;
  }, [activeLens]);

  useEffect(() => {
    setAperture((current) => {
      const clamped = Math.min(Math.max(current, activeLens.minAperture), activeLens.maxAperture);
      return parseFloat(clamped.toFixed(1));
    });
  }, [activeLens]);

  const handleLensSelect = (lensId) => {
    if (lensId === activeLensId) return;
    setActiveLensId(lensId);
  };

  const handleApertureChange = (value) => {
    const clamped = Math.min(Math.max(value, activeLens.minAperture), activeLens.maxAperture);
    setAperture(parseFloat(clamped.toFixed(1)));
  };

  return (
    <div className="page">
      <div className="stage-wrapper">
        <div
          key={rollSequence}
          className={`stage ${isRolling ? 'stage--rolling' : ''}`}
          style={{ '--hud-accent': activeLens.hudAccent }}
        >
          <LensCanvas lens={activeLens} aperture={aperture} />
          <BokehLayer lens={activeLens} aperture={aperture} />
          <LensHud lens={activeLens} aperture={aperture} onApertureChange={handleApertureChange} />
        </div>
      </div>
      <LensSelector activeLensId={activeLensId} onSelect={handleLensSelect} />
      <style jsx global>{`
        :root {
          color-scheme: dark;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: radial-gradient(circle at top, #0b0e16 0%, #02040a 55%, #010108 100%);
        }
        body {
          margin: 0;
          min-height: 100vh;
          background: transparent;
        }
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 2.5rem;
        }
        .stage-wrapper {
          perspective: 1200px;
          width: min(960px, 90vw);
        }
        .stage {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
          transform-style: preserve-3d;
          transition: filter 0.5s ease;
          background: #05060d;
        }
        .stage--rolling {
          animation: lens-roll 0.65s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        @keyframes lens-roll {
          0% {
            transform: rotateZ(0deg) scale(0.98);
            filter: blur(0px) brightness(1);
          }
          40% {
            transform: rotateZ(180deg) scale(0.96);
            filter: blur(2px) brightness(0.9);
          }
          100% {
            transform: rotateZ(360deg) scale(1);
            filter: blur(0px) brightness(1);
          }
        }
        .lens-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .hud {
          position: absolute;
          inset: auto 0 0 0;
          padding: 1.5rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          color: #cfd4ff;
          backdrop-filter: blur(16px);
          background: linear-gradient(180deg, rgba(5, 6, 13, 0.4) 0%, rgba(5, 6, 13, 0.75) 100%);
          border-top: 1px solid rgba(143, 152, 255, 0.2);
        }
        .hud__title {
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--hud-accent, #8be9fd);
        }
        .hud__metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          font-size: 0.95rem;
        }
        .hud__metric-label {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .hud__metric-value {
          font-size: 1.1rem;
          font-weight: 500;
        }
        .hud__slider {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .hud__slider span {
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .hud__slider input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(120, 128, 200, 0.25);
          outline: none;
        }
        .hud__slider input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent, #8be9fd);
          box-shadow: 0 0 12px rgba(139, 233, 253, 0.6);
          cursor: pointer;
          border: none;
        }
        .hud__slider input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent, #8be9fd);
          border: none;
          box-shadow: 0 0 12px rgba(139, 233, 253, 0.6);
          cursor: pointer;
        }
        .hud__slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          opacity: 0.65;
        }
        .hud__meter {
          position: relative;
          height: 20px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(40, 45, 70, 0.45);
        }
        .hud__meter-fill {
          position: absolute;
          inset: 0 auto 0 0;
          transition: width 0.3s ease;
          background: var(--hud-accent, #8be9fd);
        }
        .hud__meter-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 242, 255, 0.85);
        }
        .bokeh-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .bokeh-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 65%);
          filter: blur(2px);
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
        }
        .lens-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .lens-selector button {
          background: rgba(9, 12, 24, 0.65);
          border: 1px solid rgba(120, 128, 200, 0.25);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          color: #e5e9ff;
          cursor: pointer;
          min-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .lens-selector button:hover {
          transform: translateY(-2px);
          border-color: rgba(139, 233, 253, 0.6);
          background: rgba(9, 12, 24, 0.85);
        }
        .lens-selector button.active {
          border-color: rgba(139, 233, 253, 0.85);
          box-shadow: 0 0 32px rgba(139, 233, 253, 0.18);
        }
        .lens-selector__label {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .lens-selector__range {
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          opacity: 0.7;
        }
        @media (max-width: 768px) {
          .page {
            padding: 1.5rem 1rem 3rem;
          }
          .stage {
            border-radius: 20px;
          }
          .hud {
            padding: 1.25rem 1.4rem 1.6rem;
          }
          .lens-selector {
            flex-direction: column;
            width: 100%;
          }
          .lens-selector button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
