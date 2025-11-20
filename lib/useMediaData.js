import { useEffect } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { SAMPLE_MEDIA_DATA } from './sampleMediaData';
import { LOREMAKER_SHEET_ID } from './realMediaData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();

  useEffect(() => {
    setMediaData(SAMPLE_MEDIA_DATA);

    const fetchLorumaker = async () => {
      try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${LOREMAKER_SHEET_ID}/gviz/tq?tqx=out:json`);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows || [];

        const characters = rows
          .filter((row) => row.c?.[1]?.v)
          .slice(0, 20)
          .map((row, index) => {
            const cells = row.c;
            const name = cells[1]?.v;
            const alias = cells[2]?.v;
            const coverUrl = cells[13]?.v || cells[14]?.v;
            const urlSlug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `character-${index}`;

            return {
              id: `loremaker-${index}`,
              name,
              role: alias || cells[6]?.v || 'Character',
              coverUrl,
              url: cells[12]?.v || `https://loremaker.cloud/characters/${urlSlug}`,
            };
          });

        setMediaData((prev) => ({
          ...prev,
          loremaker: { characters },
        }));
      } catch (error) {
        console.error('Failed to load Loremaker characters', error);
      }
    };

    fetchLorumaker();
  }, [setMediaData]);
};
