export default function FlashOverlay({ cursorPosition }) {
  return (
    <div className="flash-overlay">
      <style jsx>{`
        .flash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9998;
          background: radial-gradient(
            circle at ${cursorPosition.x}px ${cursorPosition.y}px,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.7) 20%,
            rgba(255, 255, 255, 0.3) 40%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: flash-fade 120ms ease-out forwards;
        }

        @keyframes flash-fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
