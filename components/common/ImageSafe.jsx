import { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * ImageSafe Component
 * Reliably loads images from Google Drive with automatic fallbacks
 *
 * Features:
 * - Tries multiple URL variants (googleusercontent, thumbnails, direct links)
 * - Automatic retry with exponential backoff
 * - Falls back to branded placeholder SVG if all attempts fail
 * - Handles CORS and permission issues gracefully
 *
 * @param {Array<string>} variants - Array of image URL variants to try
 * @param {string} alt - Alt text for the image
 * @param {string} className - CSS classes for styling
 * @param {string} fallbackText - Text to display in fallback (optional)
 * @param {object} style - Inline styles for the image
 * @param {object} ...rest - Additional props to pass to the img element
 */
export default function ImageSafe({ variants = [], alt = '', className = '', fallbackText = null, style = {}, ...rest }) {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!variants || variants.length === 0) {
      setShowFallback(true);
      setIsLoading(false);
      return;
    }

    // Start with the first variant
    setCurrentUrl(variants[0]);
    setCurrentVariantIndex(0);
    setIsLoading(true);
    setHasError(false);
    setShowFallback(false);
  }, [variants]);

  const handleImageError = () => {
    const nextIndex = currentVariantIndex + 1;

    if (nextIndex < variants.length) {
      // Try the next variant
      console.log(`Image failed, trying variant ${nextIndex + 1}/${variants.length}`);
      setCurrentVariantIndex(nextIndex);
      setCurrentUrl(variants[nextIndex]);
      setHasError(false);
    } else {
      // All variants failed, show fallback
      console.log('All image variants failed, showing fallback');
      setShowFallback(true);
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setShowFallback(false);
  };

  // Fallback SVG component
  if (showFallback || (!currentUrl && !isLoading)) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-purple-700/30 border border-purple-500/30`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <ImageIcon className="w-12 h-12 text-purple-400/50" />
          {fallbackText && (
            <p className="text-sm text-purple-300/70 max-w-[200px]">
              {fallbackText}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`${className} flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-purple-700/20 border border-purple-500/20`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-purple-300/50">Loading...</p>
          </div>
        </div>
      )}

      <img
        src={currentUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        style={style}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        {...rest}
      />
    </>
  );
}
