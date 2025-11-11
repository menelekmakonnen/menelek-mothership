import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Placeholder character data - replace with Google Sheets data
const allCharacters = [
  { name: 'Aria Stormweaver', emoji: '⚡', role: 'Elemental Mage' },
  { name: 'Dusk Shadowblade', emoji: '🗡️', role: 'Shadow Assassin' },
  { name: 'Zephyr Windcaller', emoji: '🌪️', role: 'Wind Archer' },
  { name: 'Terra Earthshaper', emoji: '🏔️', role: 'Earth Guardian' },
  { name: 'Lyra Moonwhisper', emoji: '🌙', role: 'Lunar Priestess' },
  { name: 'Blaze Inferno', emoji: '🔥', role: 'Fire Warrior' },
  { name: 'Frost Iceheart', emoji: '❄️', role: 'Ice Sorceress' },
  { name: 'Nova Starforge', emoji: '⭐', role: 'Cosmic Blacksmith' },
  { name: 'Raven Nightwing', emoji: '🦅', role: 'Sky Sentinel' },
  { name: 'Sage Timeless', emoji: '⏳', role: 'Chronomancer' },
  { name: 'Echo Soundwave', emoji: '🎵', role: 'Sonic Bard' },
  { name: 'Vex Voidwalker', emoji: '🌀', role: 'Void Mystic' },
  { name: 'Crimson Bloodmoon', emoji: '🩸', role: 'Blood Knight' },
  { name: 'Jade Lifebinder', emoji: '🌿', role: 'Nature Druid' },
  { name: 'Atlas Titanborn', emoji: '💪', role: 'Titan Champion' },
  { name: 'Cipher Codebreaker', emoji: '🔐', role: 'Rune Scholar' },
  { name: 'Phoenix Ashborn', emoji: '🔥', role: 'Flame Phoenix' },
  { name: 'Onyx Darkstone', emoji: '⚫', role: 'Dark Paladin' },
  { name: 'Aurora Dawnbringer', emoji: '🌅', role: 'Light Herald' },
  { name: 'Vortex Stormchaser', emoji: '🌊', role: 'Storm Rider' },
];

export default function LoremakerSection() {
  const [displayedCharacters, setDisplayedCharacters] = useState([]);

  useEffect(() => {
    // Randomly select characters on load
    const shuffled = [...allCharacters].sort(() => Math.random() - 0.5);
    setDisplayedCharacters(shuffled.slice(0, 12));
  }, []);

  return (
    <div className="w-full min-h-screen p-8 pt-32 overflow-auto">
      <div className="max-w-7xl mx-auto">
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

        {/* Static character grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCharacters.map((character, index) => (
            <motion.div
              key={character.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="luxury-card group cursor-pointer text-center"
              whileHover={{ y: -8 }}
            >
              {/* Character icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {character.emoji}
              </div>

              {/* Character name */}
              <h3 className="font-bold text-lg mb-2">{character.name}</h3>

              {/* Character role */}
              <p className="text-sm text-gray-400">{character.role}</p>

              {/* Hover effect */}
              <div className="mt-4 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          Characters are randomly selected from the Loremaker Universe roster
        </motion.div>
      </div>
    </div>
  );
}
