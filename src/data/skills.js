/**
 * Arhan's Technical Skills
 * Organized by category
 */

export const skills = {
  frontend: {
    category: "Frontend",
    icon: "⚛️",
    skills: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  backend: {
    category: "Backend",
    icon: "🔧",
    skills: ["Node.js", "Express", "Prisma", "Convex", "REST APIs", "GraphQL"],
  },
  databases: {
    category: "Databases",
    icon: "🗄️",
    skills: ["MongoDB", "PostgreSQL", "Firebase", "Supabase", "MySQL"],
  },
  mobile: {
    category: "Mobile",
    icon: "📱",
    skills: ["React Native", "Expo", "Swift", "Kotlin"],
  },
  ai: {
    category: "AI & ML",
    icon: "🤖",
    skills: ["Google Gemini", "OpenAI GPT", "Together AI", "LangChain", "Vercel AI SDK"],
  },
  "3d": {
    category: "3D & Graphics",
    icon: "🎮",
    skills: ["Three.js", "React Three Fiber", "Babylon.js", "WebGL", "Canvas API"],
  },
  devops: {
    category: "DevOps & Deployment",
    icon: "☁️",
    skills: ["Vercel", "Railway", "Docker", "Git", "GitHub Actions"],
  },
  tools: {
    category: "Tools & Libraries",
    icon: "🛠️",
    skills: ["Vite", "Webpack", "Turborepo", "Liveblocks", "Stripe", "Auth0", "Clerk"],
  },
};

export const skillsArray = Object.values(skills);

export default skills;
