import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const rotatingWords = [
  'Friend', 'Brother', 'Boyfriend', 'Bro', 'Son',
  'Photographer', 'Filmmaker', 'Author', 'Screenwriter',
  'Director', 'Producer', 'Video Editor', 'Videographer',
  'Vibe Coder', 'Prompt Engineer', 'Instructor'
];

export default function IntroductionSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {/* Placeholder for professional headshot */}
            <div className="text-6xl">📸</div>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold leading-tight">
            Worldbuilder, AI Supernerd and{' '}
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-green-400 inline-block"
            >
              {rotatingWords[wordIndex]}
            </motion.span>
          </h1>

          <div className="space-y-4 text-lg text-gray-300">
            <p>
              Welcome to my digital portfolio. I'm Menelek Makonnen, a multidisciplinary creative
              professional specializing in visual storytelling, AI innovation, and world-building.
            </p>
            <p>
              From capturing moments through photography to crafting epic narratives in the
              Loremaker Universe, I blend technical expertise with artistic vision to create
              experiences that inspire and engage.
            </p>
            <p>
              Explore my work to discover how I'm pushing the boundaries of creativity through
              film, AI, and immersive storytelling.
            </p>
          </div>

          {/* Key achievements */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { label: 'Projects', value: '50+' },
              { label: 'Experience', value: '10+ yrs' },
              { label: 'Clients', value: '100+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="luxury-card text-center"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
