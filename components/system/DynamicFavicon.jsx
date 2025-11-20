import { useEffect } from 'react';

const ACCENTS = ['#5af0ff', '#ff7af5', '#7cffb5', '#c8b3ff'];

export default function DynamicFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    let raf;
    let currentLink = document.querySelector("link[rel='icon']");
    const originalHref = currentLink?.getAttribute('href');

    if (!currentLink) {
      currentLink = document.createElement('link');
      currentLink.rel = 'icon';
      document.head.appendChild(currentLink);
    }

    const drawFrame = (tick) => {
      const accent = ACCENTS[tick % ACCENTS.length];
      ctx.clearRect(0, 0, size, size);

      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, 'rgba(10,10,14,0.9)');
      gradient.addColorStop(1, 'rgba(26,28,40,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < 4; i += 1) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 1 + Math.random() * 2;
        ctx.fillStyle = `${accent}55`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const leftOffset = 8 + Math.sin(tick / 3) * 2;
      const rightOffset = 32 + Math.cos(tick / 4) * 2;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const drawM = (x) => {
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(x, 46);
        ctx.lineTo(x + 6, 18);
        ctx.lineTo(x + 14, 34);
        ctx.lineTo(x + 22, 18);
        ctx.lineTo(x + 28, 46);
        ctx.stroke();
      };

      drawM(leftOffset);
      drawM(rightOffset);

      currentLink.href = canvas.toDataURL('image/png');
    };

    let tick = 0;
    const loop = () => {
      drawFrame(tick);
      tick += 1;
      raf = requestAnimationFrame(() => loop());
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      if (originalHref) {
        currentLink.href = originalHref;
      }
    };
  }, []);

  return null;
}
