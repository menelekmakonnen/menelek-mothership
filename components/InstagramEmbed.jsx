import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Instagram Embed Component
 * Displays Instagram posts/reels using oEmbed or direct links
 */
export default function InstagramEmbed({ url, className = '' }) {
  const [embedData, setEmbedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchEmbed = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/instagram/oembed?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setEmbedData(data);
        }
      } catch (err) {
        console.error('Error fetching Instagram embed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbed();
  }, [url]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-white/5 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (error || !embedData?.html) {
    // Fallback: Show link to Instagram
    return (
      <div className={`flex flex-col items-center justify-center bg-white/5 rounded-lg p-8 ${className}`}>
        <div className="text-center max-w-full">
          <div className="text-white/60 text-sm mb-4">Instagram content</div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent-dim transition-colors max-w-full"
          >
            <span className="text-truncate">View on Instagram</span>
            <ExternalLink size={16} className="flex-shrink-0" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`instagram-embed-container ${className}`}
      dangerouslySetInnerHTML={{ __html: embedData.html }}
    />
  );
}

/**
 * Instagram Grid Item
 * Thumbnail view for gallery displays
 */
export function InstagramGridItem({ url, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative aspect-[9/16] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg overflow-hidden group cursor-pointer"
    >
      {/* Instagram icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>

      {/* Play button for reels */}
      {url.includes('/reel/') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
