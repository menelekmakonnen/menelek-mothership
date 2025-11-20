/**
 * Dynamic Animated Favicon Generator
 * Creates an animated "MM" favicon with independent motion for each M
 * Optimized for performance with RAF and minimal memory usage
 */

class DynamicFavicon {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.faviconLink = null;
    this.animationId = null;
    this.lastFrame = 0;
    this.fps = 12; // Lower FPS for efficiency
    this.frameInterval = 1000 / this.fps;

    // Animation state for each M
    this.m1 = {
      rotation: 0,
      scale: 1,
      offsetY: 0,
      colorPhase: 0,
      rotationSpeed: 0.02,
      scaleSpeed: 0.015,
      bounceSpeed: 0.03,
    };

    this.m2 = {
      rotation: 0,
      scale: 1,
      offsetY: 0,
      colorPhase: Math.PI, // Offset phase for variety
      rotationSpeed: -0.025,
      scaleSpeed: 0.018,
      bounceSpeed: 0.035,
    };

    this.init();
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    // Get or create favicon link element
    this.faviconLink = document.querySelector('link[rel="icon"]');
    if (!this.faviconLink) {
      this.faviconLink = document.createElement('link');
      this.faviconLink.rel = 'icon';
      document.head.appendChild(this.faviconLink);
    }

    // Start animation
    this.animate(0);
  }

  // Generate dynamic gradient color based on phase
  getColor(phase) {
    const hue = (phase * 180 / Math.PI + 180) % 360;
    return `hsl(${hue}, 85%, 60%)`;
  }

  // Draw a single M with transformations
  drawM(x, y, state, ctx) {
    ctx.save();

    // Apply transformations
    ctx.translate(x, y);
    ctx.rotate(state.rotation);
    ctx.scale(state.scale, state.scale);
    ctx.translate(0, state.offsetY);

    // Set style
    ctx.fillStyle = this.getColor(state.colorPhase);
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw M with glow effect
    ctx.shadowColor = this.getColor(state.colorPhase);
    ctx.shadowBlur = 4;
    ctx.fillText('M', 0, 0);

    ctx.restore();
  }

  // Update animation state
  update(deltaTime) {
    const dt = deltaTime / 16.67; // Normalize to 60fps base

    // Update first M
    this.m1.rotation += this.m1.rotationSpeed * dt;
    this.m1.colorPhase += 0.02 * dt;
    this.m1.scale = 1 + Math.sin(Date.now() * this.m1.scaleSpeed * 0.001) * 0.1;
    this.m1.offsetY = Math.sin(Date.now() * this.m1.bounceSpeed * 0.001) * 2;

    // Update second M (independent movement)
    this.m2.rotation += this.m2.rotationSpeed * dt;
    this.m2.colorPhase += 0.025 * dt;
    this.m2.scale = 1 + Math.cos(Date.now() * this.m2.scaleSpeed * 0.001) * 0.12;
    this.m2.offsetY = Math.cos(Date.now() * this.m2.bounceSpeed * 0.001 + 1) * 2;

    // Occasionally sync up (creates interesting "together" moments)
    if (Math.random() < 0.002 * dt) {
      const avgRotation = (this.m1.rotation + this.m2.rotation) / 2;
      this.m1.rotation = this.m1.rotation * 0.95 + avgRotation * 0.05;
      this.m2.rotation = this.m2.rotation * 0.95 + avgRotation * 0.05;
    }
  }

  // Render frame
  render() {
    const { canvas, ctx } = this;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (dark with slight transparency)
    ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw both M's
    this.drawM(10, 16, this.m1, ctx);
    this.drawM(22, 16, this.m2, ctx);

    // Update favicon
    this.faviconLink.href = canvas.toDataURL('image/png');
  }

  // Animation loop with FPS throttling
  animate(timestamp) {
    const elapsed = timestamp - this.lastFrame;

    // Throttle to target FPS
    if (elapsed >= this.frameInterval) {
      this.update(elapsed);
      this.render();
      this.lastFrame = timestamp - (elapsed % this.frameInterval);
    }

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }

  // Stop animation (for cleanup)
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Resume animation
  resume() {
    if (!this.animationId) {
      this.lastFrame = performance.now();
      this.animate(this.lastFrame);
    }
  }
}

// Export singleton instance
let faviconInstance = null;

export function initDynamicFavicon() {
  if (typeof window === 'undefined') return null;

  if (!faviconInstance) {
    faviconInstance = new DynamicFavicon();
  }

  return faviconInstance;
}

export function stopDynamicFavicon() {
  if (faviconInstance) {
    faviconInstance.stop();
  }
}

export function resumeDynamicFavicon() {
  if (faviconInstance) {
    faviconInstance.resume();
  }
}
