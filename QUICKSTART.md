# Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Install Dependencies
```bash
cd d:\ShareRoute
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open your browser to **`http://localhost:5173/`**

### 3. See Changes in Real-Time
Edit `src/App.tsx` and changes appear instantly (HMR enabled)

---

## 📁 What You Have

✅ **Complete React + TypeScript + Vite project**
✅ **Tailwind CSS v4 configured with custom theme**
✅ **EasyRoute Hero component fully integrated**
✅ **Framer Motion animations working**
✅ **Production build ready**

---

## 🎨 Customize in 5 Minutes

### Change Brand Name
Open `src/App.tsx` and find (around line 208):
```tsx
<span className="text-2xl font-bold text-white ml-2">EasyRoute</span>
```
Replace `EasyRoute` with your brand name.

### Change Primary Color
Open `src/index.css` and find:
```css
:root {
  --primary: oklch(0.205 0 0);  /* Emerald green */
}
```

Use any OKLch color. Examples:
- Blue: `oklch(0.5 0.2 264)`
- Red: `oklch(0.6 0.25 27)`
- Purple: `oklch(0.5 0.2 310)`

### Change Canvas Animation Intensity
Open `src/App.tsx` and modify these constants:
```typescript
const DOT_SPACING = 30;           // Lower = more dots
const INTERACTION_RADIUS = 140;   // Size of mouse effect
const OPACITY_BOOST = 0.55;       // Brightness on hover
const RADIUS_BOOST = 2.2;         // Size increase on hover
```

---

## 📦 Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder ready to deploy:
- Minified JavaScript (326KB → 104KB gzipped)
- Optimized CSS (28KB → 6KB gzipped)
- Assets ready for CDN

---

## 🚢 Deploy Options

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Manual
Upload the `dist/` folder to any static hosting.

---

## 📚 Documentation

- **`README.md`** - Full project documentation
- **`INTEGRATION_GUIDE.md`** - Integration details and customization
- **`COMPONENT_DETAILS.md`** - Deep dive into component architecture

---

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (if configured) |

---

## ❓ Troubleshooting

**Canvas animation not showing?**
- Ensure JavaScript is enabled
- Check browser console (F12 → Console)
- Try a different browser

**Styles look wrong?**
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

**Build fails?**
- Delete `node_modules`: `rm -r node_modules`
- Reinstall: `npm install`
- Check Node version: `node --version` (need 16+)

---

## 🎯 Next Steps

1. **Customize** the component for your brand
2. **Connect** the booking form to your API
3. **Add** pages with React Router
4. **Deploy** to production
5. **Iterate** based on user feedback

---

## 📞 Support

- Check documentation files in project root
- Review `src/App.tsx` comments for implementation details
- Visit [Tailwind docs](https://tailwindcss.com)
- Visit [Framer Motion docs](https://www.framer.com/motion)

---

## ✨ You're All Set!

Your modern, responsive, animated ridesharing landing page is ready to go. Happy coding! 🎉

```bash
npm run dev
```

And start building! 🚀
