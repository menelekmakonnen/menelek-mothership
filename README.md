# Menelek Makonnen - Luxury Portfolio Website

A high-performance, cinematic portfolio website built with Next.js, featuring an immersive Galleria system and camera-inspired interface design.

## 🎬 Overview

This is a luxury creative portfolio showcasing:
- **Photography** - Professional photo galleries
- **Films & Music Videos** - Cinematic storytelling
- **AI Albums** - AI-generated art collections
- **Epic Video Edits** - Video editing showcase
- **Loremaker Universe** - Character and worldbuilding archive

## ✨ Key Features

### The Galleria System
A full-screen, multi-level visual exploration experience with:
- **4 Navigation Levels**: Galleria → Gallery → Album → Single View
- **Portrait-style covers** for all media categories
- **Smart navigation** with level-specific arrow behaviors
- **Sorting options**: Default, A-Z, Z-A, Random
- **Smooth transitions** with zero blackouts
- **Slideshow mode** with customizable intervals
- **Zoom controls** in single view

### Camera HUD
Professional camera-inspired interface with:
- **Power management** - Boot sequence, standby mode
- **Camera settings** - ISO, aperture, shutter speed controls
- **Lens system** - 5 professional lenses with real specs
- **HUD visibility modes** - None, Minimal, Standard, Full
- **Battery indicator** - Time-based drain simulation
- **Theme system** - Dark/Light mode via flash control

### Luxury Design
- **Cinematic gradients** and smooth animations
- **Glass morphism** effects throughout
- **Icon-only draggable navbar** with hover labels
- **Responsive design** for all screen sizes
- **Dark mode default** for first-time visitors
- **Professional typography** (Inter + JetBrains Mono)

## 🛠 Tech Stack

- **Framework**: Next.js 14.2.0
- **UI Library**: React 18.2.0
- **Animations**: Framer Motion 11.0.0
- **Styling**: Tailwind CSS 3.4.3
- **Icons**: Lucide React 0.344.0
- **State Management**: React Context API

## 📁 Project Structure

```
menelek-mothership/
├── pages/
│   ├── _app.jsx              # App wrapper with providers
│   ├── _document.jsx         # HTML document setup
│   └── index.jsx             # Home page
├── components/
│   ├── camera/               # Camera HUD system
│   │   ├── CameraHUD.jsx     # Main HUD display
│   │   ├── PowerButton.jsx   # Power control
│   │   └── BootSequence.jsx  # Startup animation
│   ├── navbar/
│   │   └── IconNavbar.jsx    # Draggable icon navigation
│   └── galleria/             # Galleria system
│       ├── Galleria.jsx      # Main container
│       ├── GalleriaView.jsx  # Category view
│       ├── GalleryView.jsx   # Gallery/album list
│       ├── AlbumView.jsx     # Album items
│       ├── SingleView.jsx    # Full-screen media
│       └── NavigationArrows.jsx
├── context/
│   ├── CameraContext.jsx     # Camera state management
│   └── GalleriaContext.jsx   # Galleria navigation
├── lib/
│   ├── sampleMediaData.js    # Sample media content
│   └── useMediaData.js       # Media data loader
├── styles/
│   └── globals.css           # Global styles & theme
└── package.json
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file for production media sources:

```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_api_key
NEXT_PUBLIC_PHOTOGRAPHY_FOLDER_ID=your_folder_id
NEXT_PUBLIC_AI_ALBUMS_FOLDER_ID=your_ai_folder_id
```

## 🎨 Customization

### Theme Colors

Edit CSS variables in `styles/globals.css`:

```css
:root {
  --accent: #00ff88;          /* Primary accent color */
  --accent-dim: #00cc6a;      /* Accent hover state */
  --bg-primary: #0a0a0a;      /* Main background */
  /* ... */
}
```

### Media Data

Replace sample data in `lib/sampleMediaData.js` or connect to your own API:

```javascript
export const SAMPLE_MEDIA_DATA = {
  photography: {
    galleries: [
      {
        id: 'album-1',
        name: 'Your Album',
        coverUrl: 'path/to/cover.jpg',
        items: [/* your images */]
      }
    ]
  }
}
```

## 📱 Responsive Behavior

- **Desktop**: Full Galleria experience with all features
- **Tablet**: Optimized grid layouts, touch gestures
- **Mobile**: Simplified navigation, portrait-optimized

## ⌨️ Keyboard Shortcuts

- `ESC` - Close Galleria / Go back / Reset zoom
- `←` / `→` - Navigate left/right (level-aware)
- `Space` - Toggle slideshow
- `Mouse wheel` - Zoom (when hovering image in Single View)

## 🎯 Z-Index Hierarchy

```
1. Website content         z-index: 1
2. Galleria overlay        z-index: 1000
3. Camera HUD              z-index: 2000
4. Modals/Alerts           z-index: 3000
```

## 🔧 Camera Settings

### Available Lenses
1. **50mm f/1.4 Prime** - Standard (1x zoom)
2. **24-70mm f/2.8** - Versatile (0.85x zoom)
3. **70-200mm f/2.8** - Telephoto (1.5x zoom)
4. **85mm f/1.4 Portrait** - Portrait (1.2x zoom)
5. **16-35mm f/2.8 Wide** - Wide angle (0.7x zoom)

### Camera Controls
- **ISO**: 100-6400 (affects noise overlay)
- **Aperture**: f/1.4-f/22 (affects depth of field)
- **Shutter Speed**: 1/8000s to 30s (affects motion blur)
- **Flash Mode**: Auto, On (light theme), Off (dark theme)

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Private portfolio project for Menelek Makonnen.

## 🙏 Credits

- **Design & Development**: Built with Next.js and Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts), JetBrains Mono
- **Sample Images**: Unsplash (for demonstration only)

---

**Built with precision. Designed for impact.**
