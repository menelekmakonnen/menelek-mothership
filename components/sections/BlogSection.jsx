import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, PenSquare, Sparkles, Camera, Brain } from 'lucide-react';
import { useState } from 'react';

const articles = [
  {
    id: 1,
    title: 'The Future of AI in Creative Industries',
    excerpt: 'Exploring how artificial intelligence is transforming creative workflows and opening new possibilities for artists and creators.',
    date: '2024-11-01',
    readTime: '8 min',
    category: 'AI & Technology',
    featured: true,
    gradient: 'from-indigo-600 to-purple-600',
    icon: Brain,
  },
  {
    id: 2,
    title: 'Building Immersive Narratives: The Loremaker Approach',
    excerpt: 'Deep dive into world-building techniques and creating compelling character-driven stories that resonate with audiences.',
    date: '2024-10-28',
    readTime: '12 min',
    category: 'Storytelling',
    featured: false,
    gradient: 'from-rose-600 to-amber-500',
    icon: PenSquare,
  },
  {
    id: 3,
    title: 'Photography in the Digital Age',
    excerpt: 'Balancing technical mastery with artistic vision in modern photography. Lessons from years behind the lens.',
    date: '2024-10-15',
    readTime: '6 min',
    category: 'Photography',
    featured: false,
    gradient: 'from-emerald-600 to-teal-600',
    icon: Camera,
  },
  {
    id: 4,
    title: 'From Vision to Screen: The Filmmaking Process',
    excerpt: 'A comprehensive look at bringing creative visions to life through film, from pre-production to final cut.',
    date: '2024-10-08',
    readTime: '15 min',
    category: 'Filmmaking',
    featured: true,
    gradient: 'from-blue-600 to-cyan-600',
    icon: Sparkles,
  },
];

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="w-full min-h-screen p-8 pt-32 pb-32">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-green-400 hover:underline mb-6"
          >
            ← Back to Articles
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none text-[color:var(--text-secondary)]"
          >
            <div className="mb-6">
              <span className="text-sm text-green-400 mono">{selectedArticle.category}</span>
            </div>

            <h1 className="text-5xl font-bold mb-6">{selectedArticle.title}</h1>

            <div className="flex items-center gap-6 text-[color:var(--text-secondary)] text-sm mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {selectedArticle.readTime} read
              </div>
            </div>

            <div className="text-[color:var(--text-secondary)] leading-relaxed space-y-6">
              <p>{selectedArticle.excerpt}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Blog
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-12"
        >
          Creative opinions, insights, and stories
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            const Icon = article.icon || PenSquare;
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedArticle(article)}
                className="camera-hud group cursor-pointer flex flex-col h-full rounded-3xl border border-white/10 overflow-hidden"
              >
                <div className={`relative aspect-video bg-gradient-to-br ${article.gradient} flex flex-col justify-between p-6`}>
                  <div className="flex items-center justify-between text-white/80">
                    <Icon className="w-8 h-8" />
                    <span className="px-3 py-1 rounded-full bg-black/30 text-[11px] mono uppercase tracking-[0.3em]">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 text-white/80 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-[color:var(--text-secondary)] mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)] mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                    <div className="text-green-300 flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
