# MenelekMakonnen.com - Interactive Camera Portfolio

A premium, interactive portfolio website that simulates a professional camera interface, providing an immersive photography experience where all camera controls functionally affect the user interface.

## 🎥 Features

### Camera Simulation System
- **DSLR/Mirrorless Mode Toggle** - Switch between authentic camera interfaces
- **Boot Sequence** - Professional camera startup animation (first load of the day)
- **Power Management** - ON/OFF/STANDBY states with battery drain system
- **Battery System** - Time-based drain (fully charged at midnight, depleted at 23:11)

### Camera Controls
- **Exposure Controls** (Sliders)
  - ISO (100-6400) - Affects grain/noise overlay
  - Aperture (f/1.4 - f/22) - Controls depth of field blur
  - Shutter Speed (1/8000s - 30s) - Affects motion blur
  - Exposure Compensation

- **Lens System** (5 Professional Lenses)
  - 50mm f/1.4 Prime
  - 24-70mm f/2.8
  - 70-200mm f/2.8
  - 85mm f/1.4 Portrait
  - 16-35mm f/2.8 Wide
  - Iris blade transition animation on lens change

- **Flash Modes**
  - AUTO (system theme)
  - FLASH ON (light mode)
  - FLASH OFF (dark mode)

### Visual Effects
- **Depth of Field Blur** - Real-time bokeh based on aperture and layer depth
- **Focus System** - AF indicator cursor with click-to-focus behavior
- **ISO Noise** - Grain overlay at high ISO values
- **White Balance** - Color temperature adjustments
- **Rule of Thirds Grid** - Composition overlay
- **Histogram** - Real-time brightness analysis

### Camera HUD
- Real-time readings that respond to on-screen content
- Battery bar indicator
- Current camera settings display
- Visibility modes: None, Minimal, Standard, Full

### Content Sections
1. **Cover/Landing** - Auto-play slider showcasing main sections
2. **Introduction** - Professional bio with rotating title words
3. **Links** - Social media hub (LinkedIn, Instagram, YouTube, TikTok)
4. **Films & Music Videos** - Embedded content with filtering
5. **Loremaker Universe** - Static grid of random characters
6. **AI Projects** - Starterclass, Scholarships, Consultancy
7. **Epic Video Edits** - Gallery from Google Drive
8. **Photography Albums** - Camera-style gallery (Single/4-up/8-up/16-up views)
9. **AI Albums** - AI-generated visual art
10. **Blog** - Creative opinions and articles

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP, React Spring
- **Icons:** Lucide React
- **State Management:** React Context
- **Media:** Google Drive API (placeholder integration)

## 📦 Installation

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

## 🎨 Design Philosophy

- **High-Value Luxury** - $100,000 premium build aesthetic
- **Bold & Dark** - Luxury minimalist dark theme
- **Camera Never Intrudes** - All controls enhance, never obstruct navigation
- **Responsive** - Mobile and desktop equally prioritized
- **Performance** - 60fps animations, <3s load time, <5MB initial load

## 📁 Project Structure

```
├── components/
│   ├── camera/           # Camera UI components
│   │   ├── BootSequence.jsx
│   │   ├── CameraHUD.jsx
│   │   ├── ControlBoxes.jsx
│   │   ├── ExposureControls.jsx
│   │   ├── LensSelector.jsx
│   │   ├── AssistTools.jsx
│   │   ├── FlashToggle.jsx
│   │   ├── CameraModeToggle.jsx
│   │   ├── BatteryIndicator.jsx
│   │   ├── PowerButton.jsx
│   │   ├── IrisTransition.jsx
│   │   └── FocusIndicator.jsx
│   ├── sections/         # Content sections
│   │   ├── CoverSection.jsx
│   │   ├── IntroductionSection.jsx
│   │   ├── LinksSection.jsx
│   │   ├── FilmsSection.jsx
│   │   ├── LoremakerSection.jsx
│   │   ├── AIProjectsSection.jsx
│   │   ├── VideoEditsSection.jsx
│   │   ├── PhotographySection.jsx
│   │   ├── AIAlbumsSection.jsx
│   │   └── BlogSection.jsx
│   ├── ui/               # UI components
│   │   ├── RuleOfThirds.jsx
│   │   ├── Histogram.jsx
│   │   └── BlurLayer.jsx
│   └── SectionNavigation.jsx
├── context/
│   └── CameraContext.jsx # Global camera state management
├── lib/
│   └── googleDrive.js    # Google Drive integration (placeholder)
├── pages/
│   ├── _app.jsx
│   ├── _document.jsx
│   └── index.jsx
└── styles/
    └── globals.css       # Global styles and camera UI

```

## 🎮 Camera Controls

### Keyboard Shortcuts
- **Arrow Left/Right** - Navigate sections
- **Mouse Wheel** - Adjust focus (not scroll)

### Touch Gestures
- **Swipe Left/Right** - Navigate sections
- **Pinch** - Zoom where applicable
- **Tap** - Focus and interact

### Mouse Interactions
- **First Click** - Focus element with animation
- **Subsequent Clicks** - Direct interaction
- **Click Outside** - Shift focus
- **Double-Click Outside** - Close topmost box

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

### Google Drive Integration

1. Set up Google Drive API credentials
2. Share folders with service account
3. Use folder IDs to fetch content
4. Each subfolder represents a gallery/album

See `lib/googleDrive.js` for implementation details.

## 🎯 Key Technical Achievements

- **Real-time Blur Rendering** - CSS backdrop-filter with performance optimization
- **HUD Reading Actual Content** - DOM analysis for real ISO/histogram values
- **Iris Blade Animation** - GSAP-powered professional lens transition
- **Battery Time Sync** - Actual time-based drain system
- **Layer Architecture** - Up to 10 nested depth layers with smart z-index management
- **Infinite Section Loop** - Seamless carousel navigation
- **Focus System** - Camera-accurate AF behavior

## 🚀 Performance Optimizations

- Lazy loading for images and heavy content
- Efficient blur rendering (CSS filters, fallback strategies)
- Minimized reflows and repaints
- Debounced real-time adjustments
- Smooth 60fps animations
- Optimized component rendering

## 📱 Mobile Optimization

- Touch-optimized controls
- Swipe gestures for navigation
- Pinch to zoom support
- Scaled controls for touch targets
- Prevent accidental clicks
- iOS and Android tested

## 🎨 Customization

### Rotating Title Words
Edit `components/sections/IntroductionSection.jsx`:
```javascript
const rotatingWords = [
  'Friend', 'Brother', 'Photographer', // Add your words
];
```

### Loremaker Characters
Edit `components/sections/LoremakerSection.jsx`:
```javascript
const allCharacters = [
  { name: 'Character Name', emoji: '⚡', role: 'Role' },
  // Add your characters
];
```

### Social Links
Edit `components/sections/LinksSection.jsx`:
```javascript
const socialLinks = [
  { name: 'Platform', url: 'https://...', icon: Icon, ... },
];
```

## 📝 License

Private/Proprietary - Menelek Makonnen

## 🙏 Credits

**Design & Development:** Claude AI (Anthropic) + Menelek Makonnen
**Inspiration:** Professional camera UX from Canon, Sony, Nikon
**Built with:** Next.js, React, Framer Motion, Tailwind CSS

---

**Built with precision and passion for the craft of photography and interactive design.**
