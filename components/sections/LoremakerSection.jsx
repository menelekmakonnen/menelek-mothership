import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';
import Galleria from '@/components/galleria/Galleria';

// All available Loremaker characters
const allCharacters = [
  { id: 1, name: 'Aria Stormweaver', emoji: '⚡', role: 'Elemental Mage', description: 'Master of elemental storms and lightning magic' },
  { id: 2, name: 'Dusk Shadowblade', emoji: '🗡️', role: 'Shadow Assassin', description: 'Silent hunter of the dark realms' },
  { id: 3, name: 'Zephyr Windcaller', emoji: '🌪️', role: 'Wind Archer', description: 'Guardian of the sky paths' },
  { id: 4, name: 'Terra Earthshaper', emoji: '🏔️', role: 'Earth Guardian', description: 'Protector of the ancient mountains' },
  { id: 5, name: 'Lyra Moonwhisper', emoji: '🌙', role: 'Lunar Priestess', description: 'Keeper of moonlight rituals' },
  { id: 6, name: 'Blaze Inferno', emoji: '🔥', role: 'Fire Warrior', description: 'Champion of the eternal flame' },
  { id: 7, name: 'Frost Iceheart', emoji: '❄️', role: 'Ice Sorceress', description: 'Wielder of winter\'s fury' },
  { id: 8, name: 'Nova Starforge', emoji: '⭐', role: 'Cosmic Blacksmith', description: 'Forger of celestial weapons' },
  { id: 9, name: 'Raven Nightwing', emoji: '🦅', role: 'Sky Sentinel', description: 'Watcher of the endless skies' },
  { id: 10, name: 'Sage Timeless', emoji: '⏳', role: 'Chronomancer', description: 'Manipulator of time itself' },
  { id: 11, name: 'Echo Soundwave', emoji: '🎵', role: 'Sonic Bard', description: 'Maestro of sonic warfare' },
  { id: 12, name: 'Vex Voidwalker', emoji: '🌀', role: 'Void Mystic', description: 'Explorer of the void between worlds' },
  { id: 13, name: 'Crimson Bloodmoon', emoji: '🩸', role: 'Blood Knight', description: 'Warrior bound by ancient oaths' },
  { id: 14, name: 'Jade Lifebinder', emoji: '🌿', role: 'Nature Druid', description: 'Guardian of all living things' },
  { id: 15, name: 'Atlas Titanborn', emoji: '💪', role: 'Titan Champion', description: 'Bearer of immense strength' },
  { id: 16, name: 'Cipher Codebreaker', emoji: '🔐', role: 'Rune Scholar', description: 'Decoder of ancient mysteries' },
  { id: 17, name: 'Phoenix Ashborn', emoji: '🔥', role: 'Flame Phoenix', description: 'Reborn from the ashes of war' },
  { id: 18, name: 'Onyx Darkstone', emoji: '⚫', role: 'Dark Paladin', description: 'Knight of the shadow realm' },
  { id: 19, name: 'Aurora Dawnbringer', emoji: '🌅', role: 'Light Herald', description: 'Herald of the new dawn' },
  { id: 20, name: 'Vortex Stormchaser', emoji: '🌊', role: 'Storm Rider', description: 'Master of tempests and tides' },
  { id: 21, name: 'Ember Flamekeeper', emoji: '🕯️', role: 'Fire Keeper', description: 'Protector of the eternal flame' },
  { id: 22, name: 'Mistral Clouddancer', emoji: '☁️', role: 'Sky Dancer', description: 'Dancer among the clouds' },
  { id: 23, name: 'Obsidian Nightfall', emoji: '🌑', role: 'Shadow Lord', description: 'Ruler of the endless night' },
  { id: 24, name: 'Crystal Lightweaver', emoji: '💎', role: 'Light Mage', description: 'Weaver of pure light' },
  { id: 25, name: 'Thorin Earthbreaker', emoji: '🗿', role: 'Earth Titan', description: 'Breaker of mountains' },
];

export default function LoremakerSection() {
  const [isGalleriaOpen, setIsGalleriaOpen] = useState(false);
  const [loremakerData, setLoremakerData] = useState(null);
  const { registerGallery, goToGallery } = useGalleria();

  useEffect(() => {
    // Randomly select 20 characters
    const shuffled = [...allCharacters].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 20);

    // Create single album with 20 character "images"
    const data = {
      title: 'Loremaker Universe',
      description: '20 random characters from the Loremaker world',
      albums: [
        {
          id: 'loremaker-characters',
          name: 'Character Roster',
          emoji: '⚔️',
          images: selected.map(char => ({
            id: char.id,
            title: char.name,
            url: `https://picsum.photos/800/1000?random=${char.id + 900}`,
            thumbnail: `https://picsum.photos/400/400?random=${char.id + 900}`,
            emoji: char.emoji,
            role: char.role,
            description: char.description,
            loremakerLink: 'https://loremaker.cloud',
          })),
        },
      ],
    };

    setLoremakerData(data);
    registerGallery('loremaker', data);
  }, [registerGallery]);

  const handleOpenGalleria = () => {
    setIsGalleriaOpen(true);
    goToGallery('loremaker');
  };

  if (!loremakerData) return null;

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button
        onClick={handleOpenGalleria}
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-orange-600/20 to-red-600/20 p-12 transition-all hover:scale-105 hover:border-white/40 hover:shadow-2xl"
      >
        <BookOpen className="h-24 w-24 text-white transition-transform group-hover:scale-110" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Loremaker Universe</h2>
          <p className="mt-2 text-white/70">Click to meet 20 random characters</p>
        </div>
      </button>

      {loremakerData && (
        <Galleria
          isOpen={isGalleriaOpen}
          onClose={() => setIsGalleriaOpen(false)}
          galleriesData={{ loremaker: loremakerData }}
        />
      )}
    </div>
  );
}
