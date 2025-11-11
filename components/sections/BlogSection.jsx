import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
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
  },
  {
    id: 2,
    title: 'Building Immersive Narratives: The Loremaker Approach',
    excerpt: 'Deep dive into world-building techniques and creating compelling character-driven stories that resonate with audiences.',
    date: '2024-10-28',
    readTime: '12 min',
    category: 'Storytelling',
    featured: false,
  },
  {
    id: 3,
    title: 'Photography in the Digital Age',
    excerpt: 'Balancing technical mastery with artistic vision in modern photography. Lessons from years behind the lens.',
    date: '2024-10-15',
    readTime: '6 min',
    category: 'Photography',
    featured: false,
  },
  {
    id: 4,
    title: 'From Vision to Screen: The Filmmaking Process',
    excerpt: 'A comprehensive look at bringing creative visions to life through film, from pre-production to final cut.',
    date: '2024-10-08',
    readTime: '15 min',
    category: 'Filmmaking',
    featured: true,
  },
];

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="w-full min-h-screen p-8 pt-32 overflow-auto">
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
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="mb-6">
              <span className="text-sm text-green-400 mono">{selectedArticle.category}</span>
            </div>

            <h1 className="text-5xl font-bold mb-6">{selectedArticle.title}</h1>

            <div className="flex items-center gap-6 text-gray-400 text-sm mb-8">
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

            <div className="text-gray-300 leading-relaxed space-y-6">
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
    <div className="w-full min-h-screen p-8 pt-32 overflow-auto">
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

        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedArticle(article)}
              className={`luxury-card group cursor-pointer ${
                article.featured ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs mono text-green-400">{article.category}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <span className="text-xs text-gray-500">•</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 mb-4">{article.excerpt}</p>

                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {article.featured && (
                  <div className="hidden md:block w-48 h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center text-4xl">
                    📝
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
