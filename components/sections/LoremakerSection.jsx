import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, User, Sparkles } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GalleryNavigation from '@/components/ui/GalleryNavigation';
import ScrollControls from '@/components/ui/ScrollControls';

// Configuration for Google Sheets integration
const SHEETS_CONFIG = {
  spreadsheetId: process.env.NEXT_PUBLIC_LOREMAKER_SHEET_ID || '',
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '',
};

// Fetch characters from Google Sheets
async function fetchCharacters() {
  if (!SHEETS_CONFIG.spreadsheetId || !SHEETS_CONFIG.apiKey) {
    // Return placeholder data if no API credentials
    return [
      { name: 'Aria Stormweaver', image: '', role: 'Elemental Mage', description: 'Master of elemental forces', realm: 'Stormlands' },
      { name: 'Dusk Shadowblade', image: '', role: 'Shadow Assassin', description: 'Silent blade in the darkness', realm: 'Shadow Realm' },
      { name: 'Zephyr Windcaller', image: '', role: 'Wind Archer', description: 'Commands the very winds', realm: 'Sky Kingdom' },
      { name: 'Terra Earthshaper', image: '', role: 'Earth Guardian', description: 'Protector of the ancient earth', realm: 'Stone Vale' },
      { name: 'Lyra Moonwhisper', image: '', role: 'Lunar Priestess', description: 'Blessed by the moon goddess', realm: 'Celestial Heights' },
      { name: 'Blaze Inferno', image: '', role: 'Fire Warrior', description: 'Wields flames of fury', realm: 'Ember Plains' },
      { name: 'Frost Iceheart', image: '', role: 'Ice Sorceress', description: 'Queen of eternal winter', realm: 'Frozen North' },
      { name: 'Nova Starforge', image: '', role: 'Cosmic Blacksmith', description: 'Forges weapons from starlight', realm: 'Astral Forge' },
      { name: 'Raven Nightwing', image: '', role: 'Sky Sentinel', description: 'Guardian of the skies', realm: 'Cloud Citadel' },
      { name: 'Sage Timeless', image: '', role: 'Chronomancer', description: 'Master of time itself', realm: 'Temporal Nexus' },
      { name: 'Echo Soundwave', image: '', role: 'Sonic Bard', description: 'Weaves magic through music', realm: 'Harmony Hall' },
      { name: 'Vex Voidwalker', image: '', role: 'Void Mystic', description: 'Traverses the spaces between', realm: 'The Void' },
    ];
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_CONFIG.spreadsheetId}/values/Characters!A2:E?key=${SHEETS_CONFIG.apiKey}`
    );
    const data = await response.json();

    return data.values?.map(row => ({
      name: row[0] || '',
      role: row[1] || '',
      description: row[2] || '',
      realm: row[3] || '',
      image: row[4] || '', // Google Drive image ID or URL
    })) || [];
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
}

export default function LoremakerSection({ onGalleryNavigate }) {
  const [characters, setCharacters] = useState([]);
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadCharacters() {
      setLoading(true);
      const data = await fetchCharacters();
      setCharacters(data);
      // Show random selection
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setDisplayedCharacters(shuffled.slice(0, 12));
      setLoading(false);
    }
    loadCharacters();
  }, []);

  const getCharacterImage = (character) => {
    if (!character.image) return null;

    // If it's a Google Drive file ID
    if (character.image.includes('drive.google.com') || character.image.length === 33) {
      const fileId = character.image.includes('/')
        ? character.image.split('/d/')[1]?.split('/')[0]
        : character.image;
      return `https://drive.google.com/uc?id=${fileId}&export=view`;
    }

    // If it's already a full URL
    return character.image;
  };

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [
      { id: 'galleria', label: 'Galleria' },
      { id: 'loremaker', label: 'Loremaker Universe' },
    ];

    if (selectedCharacter) {
      crumbs.push({ id: 'character', label: selectedCharacter.name });
    }

    return crumbs;
  };

  const handleBreadcrumbNavigate = (id, index) => {
    if (id === 'galleria') {
      onGalleryNavigate && onGalleryNavigate(null);
    } else if (id === 'loremaker') {
      setSelectedCharacter(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleBreadcrumbNavigate} />

        {/* Gallery Navigation */}
        <GalleryNavigation currentGallery="loremaker" onNavigate={onGalleryNavigate} />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Loremaker Universe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-12"
        >
          Epic character-driven narratives across multiple realms
        </motion.p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-400">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>Loading characters...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayedCharacters.map((character, index) => (
              <motion.div
                key={character.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => setSelectedCharacter(character)}
                className="luxury-card group cursor-pointer overflow-hidden"
                whileHover={{ y: -8 }}
              >
                {/* Character image */}
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 overflow-hidden relative">
                  {getCharacterImage(character) ? (
                    <img
                      src={getCharacterImage(character)}
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                      <User className="w-20 h-20 text-gray-600" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-xs text-white/90">{character.realm}</p>
                  </div>
                </div>

                {/* Character info */}
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{character.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{character.role}</p>

                {/* Hover effect */}
                <div className="mt-3 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details →
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Character Quick View Modal */}
        <AnimatePresence>
          {selectedCharacter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCharacter(null)}
              className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full overflow-hidden border border-gray-700 shadow-2xl"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-6 p-8">
                  {/* Character image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden">
                    {getCharacterImage(selectedCharacter) ? (
                      <img
                        src={getCharacterImage(selectedCharacter)}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-32 h-32 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Character details */}
                  <div className="flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="text-sm text-green-400 mb-2 mono">{selectedCharacter.realm}</div>
                      <h2 className="text-3xl font-bold mb-2">{selectedCharacter.name}</h2>
                      <p className="text-lg text-gray-400">{selectedCharacter.role}</p>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {selectedCharacter.description}
                    </p>

                    <div className="flex gap-3">
                      <button className="flex-1 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-bold transition-colors border border-green-500/50">
                        Read Story
                      </button>
                      <button className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors border border-white/10">
                        View Realm
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          {characters.length > 12 && `Showing 12 of ${characters.length} characters • `}
          Characters are loaded from Google Sheets
        </motion.div>

        {/* Scroll Controls */}
        <ScrollControls containerRef={containerRef} />
      </div>
    </div>
  );
}
