# ShareRoute - React Component Bundle Integration

A modern React + TypeScript ridesharing application built with Vite, Tailwind CSS v4, Framer Motion, and Lucide React icons.

## Project Overview

This project integrates the EasyRoute Hero component bundle into a production-ready React application.

## Tech Stack

- **React 18+** with TypeScript
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS v4** - Utility-first CSS framework with custom theming
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful, consistent icon library

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/App.tsx` - Main EasyRoute Hero component
- `src/index.css` - Global styles with Tailwind v4 and custom theme
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

## Features

### Interactive Canvas Animation
- Animated dot grid background that responds to mouse movement
- Performance-optimized spatial grid for efficient rendering
- Smooth 60fps animation with requestAnimationFrame

### Responsive Navigation
- Fixed header with scroll-aware styling
- Desktop menu + mobile hamburger menu
- Animated buttons with Framer Motion

### Booking Form
- Pickup location and destination inputs
- Icon-integrated input fields
- Form submission handling

### Feature Showcase
- Responsive grid (2x2 mobile, 1x4 desktop)
- Feature cards with icons: Fast, Safe, Affordable, Rated

### Styling
- Tailwind CSS v4 with custom OKLch color variables
- Light and dark theme support
- CSS variable system for easy customization

## Customization

### Change Brand
Edit the header text in `src/App.tsx`:
```tsx
<span className="text-2xl font-bold text-white ml-2">YourBrand</span>
```

### Modify Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: oklch(0.205 0 0);
}
```

### Animation Parameters
Adjust constants in `App.tsx`:
```typescript
const DOT_SPACING = 30;
const INTERACTION_RADIUS = 140;
const OPACITY_BOOST = 0.55;
const RADIUS_BOOST = 2.2;
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Troubleshooting

**Styles not applying?**
- Ensure `src/index.css` is imported in `main.tsx`
- Clear cache and restart dev server

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check Node version: `node --version` (should be 16+)

## License

Part of the ShareRoute platform.
