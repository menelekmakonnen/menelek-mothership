export default function AFCursor({ position, isFocusing, focusLocked }) {
  return (
    <div
      className={`af-cursor ${isFocusing ? 'focusing' : ''} ${focusLocked ? 'locked' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {/* AF Point Square */}
        <rect
          x="15"
          y="15"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />

        {/* Corner brackets */}
        <path d="M12 18 L12 12 L18 12" stroke="currentColor" strokeWidth="2" />
        <path d="M42 12 L48 12 L48 18" stroke="currentColor" strokeWidth="2" />
        <path d="M48 42 L48 48 L42 48" stroke="currentColor" strokeWidth="2" />
        <path d="M18 48 L12 48 L12 42" stroke="currentColor" strokeWidth="2" />
      </svg>

      <style jsx>{`
        .af-cursor {
          position: fixed;
          width: 60px;
          height: 60px;
          pointer-events: none;
          z-index: 10000;
          color: rgba(255, 0, 0, 0.9);
          filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.5));
          transition: all 0.1s ease-out;
        }

        .af-cursor.focusing {
          color: rgba(255, 255, 0, 1);
          animation: focus-pulse 0.8s ease-in-out;
        }

        .af-cursor.locked {
          color: rgba(0, 255, 0, 1);
          filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.8));
        }

        @keyframes focus-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
