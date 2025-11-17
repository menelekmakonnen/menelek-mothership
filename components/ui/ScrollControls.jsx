import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollControls({ containerRef }) {
  const [showControls, setShowControls] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const container = containerRef?.current || window;

    const handleScroll = () => {
      let scrollTop, scrollHeight, clientHeight;

      if (containerRef?.current) {
        scrollTop = containerRef.current.scrollTop;
        scrollHeight = containerRef.current.scrollHeight;
        clientHeight = containerRef.current.clientHeight;
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      }

      setShowControls(scrollTop > 100);
      setAtTop(scrollTop < 50);
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
    };

    if (containerRef?.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => containerRef.current?.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef]);

  const scrollToTop = () => {
    const container = containerRef?.current || window;

    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    const container = containerRef?.current || window;

    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-6 bottom-24 z-[1400] flex flex-col gap-2"
        >
          {/* Back to top */}
          {!atTop && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full camera-hud flex items-center justify-center hover:scale-110 transition-transform"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}

          {/* Skip to bottom */}
          {!atBottom && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={scrollToBottom}
              className="w-12 h-12 rounded-full camera-hud flex items-center justify-center hover:scale-110 transition-transform"
              title="Skip to bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
