import { useEffect, useRef } from 'react';

/**
 * Animated Favicon Component
 * Creates two "M" letters with:
 * - Hue shift (blue → purple → cyan loop)
 * - Glow pulse (synchronized)
 * - Slight rotation wobble (±3°)
 * - Random occasional flashes
 */
export default function FaviconAnimator() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const lastFlashRef = useRef(0);

  useEffect(() => {
    // Create canvas for favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Find or create favicon link element
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    let isVisible = true;

    // Handle visibility change to pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startTimeRef.current = Date.now();
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isVisible) return;

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000; // seconds

      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);

      // Calculate hue shift (0-360 degrees, cycling every 6 seconds)
      const hue = (elapsed * 60) % 360; // 60 degrees per second

      // Calculate glow pulse (opacity oscillates between 0.3 and 1.0)
      const pulseSpeed = 2; // Hz
      const glowIntensity = 0.35 + 0.65 * (Math.sin(elapsed * pulseSpeed * Math.PI * 2) * 0.5 + 0.5);

      // Calculate rotation wobble (±3 degrees)
      const wobbleSpeed = 0.5; // Hz
      const wobbleAngle = 3 * Math.sin(elapsed * wobbleSpeed * Math.PI * 2);

      // Random flash (every 5-10 seconds)
      const timeSinceLastFlash = now - lastFlashRef.current;
      let flashIntensity = 0;
      if (timeSinceLastFlash > 5000 && Math.random() < 0.01) {
        lastFlashRef.current = now;
        flashIntensity = 1;
      } else if (timeSinceLastFlash < 200) {
        flashIntensity = 1 - (timeSinceLastFlash / 200);
      }

      // Save context
      ctx.save();

      // Move to center for rotation
      ctx.translate(32, 32);
      ctx.rotate((wobbleAngle * Math.PI) / 180);
      ctx.translate(-32, -32);

      // Set color with hue shift
      const baseColor = `hsl(${hue}, 80%, 60%)`;
      const glowColor = `hsla(${hue}, 80%, 60%, ${glowIntensity})`;

      // Draw glow effect
      ctx.shadowBlur = 10 + (flashIntensity * 20);
      ctx.shadowColor = glowColor;

      // Draw first "M" (left)
      ctx.fillStyle = baseColor;
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add extra glow for flash
      if (flashIntensity > 0) {
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 0.5 + (flashIntensity * 0.5);
      }

      // Draw two "M"s overlapping slightly
      ctx.fillText('M', 20, 32);
      ctx.fillText('M', 44, 32);

      // Restore context
      ctx.globalAlpha = 1;
      ctx.restore();

      // Update favicon
      link.href = canvas.toDataURL('image/png');

      // Continue animation at 30 FPS
      animationFrameRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / 30);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
