# 🎨 Arhan's Interactive Portfolio

Welcome to the source of [Arhan Ansari's personal portfolio website](https://www.arhanansari.me/)! This repository hosts a cutting-edge, immersive showcase featuring interactive 3D environments, AI-powered tools, and innovative full-stack projects. Built with modern web technologies and creative vision combining technical depth with artistic excellence.

> **Live Demo:** [arhanansari.me](https://www.arhanansari.me/) — Experience the interactive portfolio now!

---

## 🚀 About Me

**Arhan Ansari** — Full-stack developer, 3D artist, and AI enthusiast  
_Champion problem-solver building impactful applications, engaging interactive experiences, and innovative tools_

- 🏆 Full Stack Developer (MERN: MongoDB, Express, React, Node)
- 🎨 3D Artist & UI/UX Designer
- 🧠 Winner at Urjaa Brain Arithmetic Competition
- 🤖 AI/ML & Chatbot Enthusiast
- ☁️ SaaS & Cloud Architecture Expert
- 🎬 Android & Creative Tools Developer

---

## ✨ Key Features

### 🎯 Interactive Core Features

- **🤖 AI Twin Assistant** — Intelligent chatbot powered by Google AI SDK with natural conversational abilities
- **3D Environment** — Immersive 3D office space with Three.js and React Three Fiber
- **Dark/Light Theme Toggle** — Seamless theme switching with persistent state
- **Command Palette** — Quick navigation using keyboard shortcuts (like VS Code)
- **Easter Eggs** — Hidden interactive elements (try the Konami code!)
- **Smooth Animations** — Fluid motion design using Framer Motion and GSAP

### 📱 Interactive Playgrounds

- **🎓 Resume Analyzer** — AI-powered analysis of professional profiles
- **🤖 AI Playground** — Experimental AI features and demonstrations
- **🎥 Auto YouTube Generator** — Automated content generation tools for creators
- **🔍 Fraud Detection Demo** — Machine learning model showcase
- **System Design Lab** — Visual system architecture explorations
- **Secret Lab** — Hidden experimental features (easter egg)

### 📚 Content Sections

- **Experience Timeline** — Professional journey and milestones
- **Projects Gallery** — Detailed showcase of portfolio projects (InspireGem, EduSync, Clipgen AI, CanvasCraft, Clystra Networks)
- **Blog** — Technical articles and insights with detailed view
- **Resume** — Professional CV with interactive elements
- **3D Tech Galaxy** — Creative visualization of tech stack

### 🎨 Design Features

- ✅ Fully responsive design for all devices
- ✅ Performance-optimized with detection for low-power devices
- ✅ Particle background effects
- ✅ Custom cursor effects
- ✅ Loading screen with branding
- ✅ Error boundary with graceful error handling
- ✅ Advanced scroll interactions
- ✅ GitHub activity calendar integration

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18.2 with Vite (blazing-fast development)
- **3D Rendering:** Three.js 0.146 + React Three Fiber 8.13.3
- **3D Components:** React Three Drei 9.106.0
- **Animations:** Framer Motion 10.12.16 + GSAP 3.12.0
- **Styling:** Tailwind CSS 3.3.2 + CSS with PostCSS
- **Routing:** React Router DOM 7.11.0
- **State Management:** Jotai 2.1.1 (lightweight atoms)
- **UI Controls:** Leva 0.9.34 (inspection panel)
- **Icons:** React Icons 5.4.0 + Lucide React 0.544.0

### AI & Backend Features

- **AI Integration:** Google AI SDK (@ai-sdk/google) + Vercel AI Library
- **Email Service:** EmailJS 4.3.3 + Formspree
- **Forms:** React Google reCAPTCHA 3.1.0
- **HTTP Client:** Axios 1.7.9

### Analytics & Monitoring

- **Analytics:** Vercel Analytics 1.3.1
- **Performance:** Vercel Speed Insights 1.0.11
- **GitHub Integration:** React GitHub Calendar 5.0.5

### Development

- **Build Tool:** Vite 4.5.13
- **Styling:** Autoprefixer, PostCSS
- **TypeScript Ready:** Full TypeScript support

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Interactive Core
│   │   ├── AiTwin.jsx           # AI Twin chatbot interface
│   │   ├── Interface.jsx        # Main UI interface
│   │   ├── CommandPalette.jsx   # Command palette navigation
│   │   ├── Menu.jsx             # Navigation menu
│   │   └── Cursor.jsx           # Custom cursor effects
│   │
│   ├── 3D & Visuals
│   │   ├── Experience.jsx       # 3D office environment
│   │   ├── Avatar.jsx           # Character avatar
│   │   ├── Office.jsx           # 3D office space
│   │   ├── TechGalaxy.jsx       # Tech stack visualization
│   │   ├── Background.jsx       # Background scenes
│   │   ├── ParticleBackground.jsx  # Particle effects
│   │   └── FloatingParticles.jsx   # Floating particle system
│   │
│   ├── Content Pages
│   │   ├── Experience.jsx       # Professional experience
│   │   ├── Projects.jsx         # Portfolio projects
│   │   ├── Resume.jsx           # CV/Resume display
│   │   ├── Blog.jsx             # Blog listing
│   │   └── BlogDetail.jsx       # Blog post details
│   │
│   ├── Playgrounds & Labs
│   │   ├── SecretLab.jsx        # Hidden experimental features
│   │   ├── SystemDesignLab.jsx  # System architecture demos
│   │   └── playground/          # Interactive demo components
│   │       ├── AiPlayground.jsx
│   │       ├── ResumeAnalyzerDemo.jsx
│   │       ├── AutoYTGeneratorDemo.jsx
│   │       └── FraudDetectionDemo.jsx
│   │
│   ├── UI & UX
│   │   ├── LoadingScreen.jsx    # Loading experience
│   │   ├── ScrollManager.jsx    # Scroll interactions
│   │   ├── ErrorBoundary.jsx    # Error handling
│   │   ├── ExplorationGuide.jsx # User guide
│   │   ├── EasterEggs.jsx       # Hidden features
│   │   └── NotFound.jsx         # 404 page
│   │
│   └── API Layer
│       └── ai-twin.js           # AI Twin backend integration
│
├── App.jsx                   # Main app component
├── config.js                 # Global configuration
├── main.jsx                  # React entry point
├── index.css                 # Global styles
└── App.css                   # App styles

public/
├── models/                   # 3D Models for Three.js
├── textures/                 # Texture assets
├── animations/               # Animation data
├── projects/                 # Project showcase media
└── testimonials/             # Client testimonials

vite.config.js               # Vite configuration
tailwind.config.js           # Tailwind CSS configuration
tsconfig.json                # TypeScript configuration
postcss.config.js            # PostCSS configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** or **yarn**

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/ArhanAnsari/Arhans-Portfolio.git
cd Arhans-Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` with hot module reloading (HMR).

### Building for Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🤖 AI Twin Setup (Optional)

To enable the AI Twin chatbot features, set up the backend:

### Windows

```bash
./setup-ai-twin.bat
```

### macOS/Linux

```bash
./setup-ai-twin.sh
```

This will install backend dependencies and configure the AI Twin service.

---

## 🔐 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Google AI SDK
VITE_GOOGLE_AI_KEY=your_google_ai_key_here

# Email Service (EmailJS)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key

# AI Twin Backend (if running locally)
VITE_AI_TWIN_URL=http://localhost:3001
```

---

## 📦 npm Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production (minified)   |
| `npm run preview` | Preview production build locally  |

---

## 💼 Portfolio Projects

### Featured Works

| Project              | Description                                         | Tech                      |
| -------------------- | --------------------------------------------------- | ------------------------- |
| **InspireGem**       | AI-powered content generation platform              | React, Node.js, AI/ML     |
| **EduSync**          | AI-powered offline learning management system (LMS) | React, MongoDB, Node.js   |
| **Clipgen AI**       | Intelligent app for YouTube content creators        | React, FFmpeg, AI         |
| **CanvasCraft**      | AI-powered drag-and-drop website builder            | React, Three.js           |
| **Clystra Networks** | Enterprise networking solution                      | React, Node.js, WebSocket |

---

## 🎨 Customization

### Theme

The portfolio supports light and dark themes with persistent storage. Toggle via the theme button in the interface.

### Performance

The app automatically detects low-power devices and mobile browsers to enable performance mode:

- Reduces particle effects
- Simplifies 3D animations
- Optimizes render quality

### 3D Environment

Adjust 3D parameters using the **Leva Inspection Panel** (visible in development mode with keyboard shortcut).

---

## 📊 Analytics & Monitoring

- **Vercel Analytics** — Track page views, interactions, and user flows
- **Speed Insights** — Monitor real user performance metrics
- **GitHub Calendar** — Showcase coding activity

---

## 🔗 Connect

- 🌐 **Portfolio:** [arhanansari.me](https://www.arhanansari.me/)
- 💼 **GitHub:** [github.com/ArhanAnsari](https://github.com/ArhanAnsari)
- 💻 **LeetCode:** [leetcode.com/u/codewitharhan](https://leetcode.com/u/codewitharhan/)
- 📚 **Learning Blog:** [CodeWithArhan](https://codewitharhan.infinityfreeapp.com)
- 📱 **LinkedIn:** Connect for professional inquiries

---

## 📝 License

This repository is open source and available under the MIT License.

---

## 🤝 Contributing

Open to feedback, collaboration, and community contributions!

- 🐛 Found a bug? [Create an issue](https://github.com/ArhanAnsari/Arhans-Portfolio/issues)
- ✨ Have a feature idea? [Submit a pull request](https://github.com/ArhanAnsari/Arhans-Portfolio/pulls)
- 💬 Want to collaborate? Reach out — I'd love to work together!

---

## 🎓 Learning Resources

This portfolio showcases advanced React patterns:

- **3D Web Development** with Three.js and React Three Fiber
- **State Management** with Jotai atoms
- **Animation** techniques with Framer Motion and GSAP
- **Performance Optimization** for different device capabilities
- **AI Integration** with modern AI SDKs
- **Full-Stack Development** practices

Perfect for learning modern web development techniques!

---

> **Crafted with ❤️ by Arhan Ansari**  
> _Building the future, one project at a time_  
> Last Updated: March 2026
