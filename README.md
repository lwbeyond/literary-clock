# Literary Clock ⏰📖

A beautiful desktop clock that tells time through literature. Each minute, discover a new quote from great novels, poems, and essays that mentions the current time.

![Literary Clock Screenshot](./screenshots/preview.png)

## ✨ Features

- **Time-based Quotes** - Every minute displays a literary quote mentioning the current time
- **Atmospheric Themes** - Automatic theme transitions based on time of day:
  - 🌅 Dawn (05:00-08:00) - Soft, warm awakening colors
  - ☀️ Day (08:00-17:00) - Clean, focused reading atmosphere
  - 🌆 Dusk (17:00-20:00) - Nostalgic sunset tones
  - 🌙 Night (20:00-05:00) - Deep, calm midnight mode
- **Frameless Design** - Minimalist borderless window
- **Cross-platform** - Available for Windows (macOS/Linux coming soon)

## 📥 Download

### Windows
Download the latest release from [Releases](../../releases):
- **`.msi`** - Installer (recommended)
- **`.exe`** - Portable executable

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Rust 1.70+
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/literary-clock.git
cd literary-clock

# Install dependencies
npm install

# Run in development mode (web)
npm run dev

# Run in development mode (desktop)
npx tauri dev

# Build for production
npx tauri build
```

### Tech Stack
- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Desktop**: Tauri 2.0
- **Animation**: Framer Motion

## 📁 Project Structure

```
literary-clock/
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   ├── data/          # Quote database
│   └── hooks/         # Custom React hooks
├── src-tauri/         # Tauri (Rust) backend
│   ├── capabilities/  # Permission configuration
│   └── tauri.conf.json
└── public/            # Static assets
```

## 📜 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Quote collection inspired by [The Literary Clock](http://www.literaryclock.com/)
- Built with [Tauri](https://tauri.app/) and [Next.js](https://nextjs.org/)
