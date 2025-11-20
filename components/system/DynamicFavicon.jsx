import { useEffect } from 'react';

const ACCENTS = ['#5af0ff', '#ff7af5', '#7cffb5', '#c8b3ff'];

export default function DynamicFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    let intervalId;
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

      ctx.strokeStyle = `${accent}aa`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const jitter = 2 + Math.sin(tick / 2) * 1.2;
      const drawM = (x) => {
        ctx.beginPath();
        ctx.moveTo(x, 46);
        ctx.lineTo(x + 6 + jitter, 18);
        ctx.lineTo(x + 14, 34 - jitter);
        ctx.lineTo(x + 22 - jitter, 18);
        ctx.lineTo(x + 28, 46);
        ctx.stroke();
      };

      drawM(10 + (tick % 3));
      drawM(30 - (tick % 3));

      currentLink.href = canvas.toDataURL('image/png');
    };

    let tick = 0;
    drawFrame(tick);
    intervalId = setInterval(() => {
      tick += 1;
      drawFrame(tick);
    }, 700);

    return () => {
      clearInterval(intervalId);
      if (originalHref) {
        currentLink.href = originalHref;
      }
    };
  }, []);

  return null;
}
