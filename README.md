# ⏰ Nova-Alarm

> **Modern AI-Powered Alarm & Time Management Application**

[![HTML](https://img.shields.io/badge/HTML-49.7%25-e34c26?style=flat-square&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![TypeScript](https://img.shields.io/badge/TypeScript-48.1%25-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-purple?style=flat-square)](https://nova-alarm.vercel.app)

---

## ✨ Overview

**Nova-Alarm** is a sophisticated alarm and time management application that combines powerful AI capabilities with a beautiful, intuitive user interface. Built with React 19, TypeScript, and Vite, it leverages Google's Generative AI for intelligent time management and smart notifications.

### 🎯 Key Highlights

- 🤖 **AI-Powered Intelligence** - Google Gemini integration for smart alarm scheduling
- ⚡ **Lightning-Fast Performance** - Vite powered development and production builds
- 🎨 **Beautiful UI** - Modern design with Lucide icons and smooth animations
- 📱 **Fully Responsive** - Perfect experience on all devices
- 🔔 **Smart Notifications** - Intelligent alerts with custom scheduling
- 💾 **Offline Support** - IndexedDB for local data persistence
- 🌙 **Modern Tooling** - TypeScript for type safety, Tailwind CSS for styling

---

## 🚀 Features

### Core Capabilities
- ✅ Create and manage multiple alarms
- ✅ AI-powered alarm suggestions
- ✅ Custom alarm notifications
- ✅ Time zone support
- ✅ Snooze functionality
- ✅ Alarm history tracking
- ✅ Quick alarm templates

### Advanced Features
- ✅ Google Gemini AI integration
- ✅ Offline-first architecture with IndexedDB
- ✅ Real-time clock display
- ✅ Responsive design system
- ✅ Motion animations
- ✅ Dark/Light theme support

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) - Modern UI library
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool**: [Vite 6](https://vitejs.dev/) - Next generation frontend tooling
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework

### UI & Components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Animations**: [Motion](https://motion.dev/) - Animation library for React
- **Date Handling**: [date-fns](https://date-fns.org/) - Modern date utilities

### AI & Storage
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) - Gemini API for intelligent features
- **Local Storage**: [IndexedDB (idb)](https://github.com/jakearchibald/idb) - Client-side database
- **Backend**: [Express](https://expressjs.com/) - Node.js server framework

### Development Tools
- **Type Checking**: TypeScript
- **Package Manager**: npm
- **Environment**: Node.js 22+

---

## 📦 Installation

### Prerequisites
- **Node.js 18+**
- **npm or yarn**
- **Google Gemini API Key**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayvazekin/Nova-Alarm.git
   cd Nova-Alarm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload (port 3000)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Utilities
npm run clean        # Remove dist folder
npm run lint         # Type check with TypeScript
```

---

## 🏗️ Project Structure

```
Nova-Alarm/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and Gemini services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── styles/             # Global styles
│   └── App.tsx             # Root component
├── public/                 # Static assets
├── index.html             # Entry HTML file
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Server configuration
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

**Get your API key:** https://ai.google.dev/

---

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Visit [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

**Live Demo**: https://nova-alarm.vercel.app

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

---

## 🤖 AI Features

### Gemini Integration

Nova-Alarm uses Google's Generative AI for:

- **Smart Scheduling** - AI suggests optimal alarm times based on your habits
- **Natural Language Processing** - Create alarms using natural language
- **Intelligent Notifications** - Personalized alarm messages
- **Time Optimization** - Recommendations for better sleep schedules

---

## 💾 Data Persistence

### IndexedDB
- Local storage of alarm data
- Offline-first architecture
- Fast data retrieval
- No server required for core functionality

### Features
- ✅ Alarms stored locally
- ✅ Sync across browser sessions
- ✅ Works offline
- ✅ Automatic backup to cloud (optional)

---

## 🎨 Customization

### Theming
Customize colors and design in:
- `tailwind.config.js` - Theme configuration
- CSS variables for component colors
- Component styling in respective files

### Adding New Features
1. Create components in `src/components/`
2. Add types in `src/types/`
3. Use custom hooks in `src/hooks/`
4. Update API calls in `src/services/`

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code structure
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ayvek**
- GitHub: [@ayvazekin](https://github.com/ayvazekin)
- Portfolio: Available on GitHub profile

---

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for Gemini API
- [Vercel](https://vercel.com/) for hosting
- [Vite](https://vitejs.dev/) for blazing fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) community

---

## 📞 Support

- 🐛 Found a bug? [Open an issue](https://github.com/ayvazekin/Nova-Alarm/issues)
- 💡 Have a suggestion? [Start a discussion](https://github.com/ayvazekin/Nova-Alarm/discussions)
- 📧 Need help? Reach out on GitHub

---

## 🔗 Quick Links

- **Live App**: https://nova-alarm.vercel.app
- **Google AI Studio**: https://ai.google.dev/
- **Documentation**: Check wiki tab
- **Issues**: Report bugs here

---

<div align="center">

**Made with ❤️ by Ayvek**

⏰ Set your alarms smarter with AI ⏰

⭐ If you find this project useful, please consider giving it a star! ⭐

</div>