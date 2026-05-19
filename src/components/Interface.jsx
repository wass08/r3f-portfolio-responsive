import React, { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense as ReactSuspense } from "react";
import emailjs from "@emailjs/browser";
import { ValidationError, useForm } from "@formspree/react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { currentProjectAtom, projects } from "./Projects";
import { Blog } from "./Blog";
import axios from "axios";
import { GitHubCalendar } from "react-github-calendar";
import ProjectCard from "./projects/ProjectCard";
import { ProjectCaseStudyModal } from "./projects/ProjectCaseStudyModal";

// Lazy-load the heavy 3D TechGalaxy component
const TechGalaxy = lazy(() => import("./TechGalaxy"));

// Lazy-load System Design Lab
const SystemDesignLab = lazy(() => import("./SystemDesignLab"));

// GitHub profile used across API calls and the calendar widget
const GITHUB_USERNAME = "ArhanAnsari";

// Animated counter hook
const useAnimatedCounter = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    let animationFrameId;
    let isCancelled = false;
    if ((startOnView ? inView : true) && !hasStarted.current) {
      hasStarted.current = true;
      let startTime = null;
      const animate = (timestamp) => {
        if (isCancelled) return;
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => {
      isCancelled = true;
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, end, duration, startOnView]);

  return { count, ref };
};

const Section = (props) => {
  const { children, mobileTop, className = "", alignRight = false } = props;

  return (
    <motion.section
      className={`
        relative min-h-screen w-full section-padding
        flex flex-col ${alignRight ? 'items-end' : 'items-start'}
        ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
        ${className}
      `}
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.3,
        },
      }}
      viewport={{ once: true }}
    >
      {/* Section background overlay - Transparent to show 3D scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/5 dark:via-black/10 to-transparent -z-10" />
      {children}
    </motion.section>
  );
};

// Enhanced data with modern structure
const testimonials = [
  {
    name: "Clystra Networks Pvt. Ltd.",
    role: "Technology Partner",
    content: "Arhan's expertise in full-stack development and innovative approach to 3D web experiences helped us create exceptional digital solutions. His attention to detail and ability to translate complex requirements into elegant implementations is truly remarkable.",
    image: "/testimonials/clystra-logo.png",
    rating: 5,
    project: "Enterprise Web Platform"
  },
];

const currentWork = {
  title: "Open for New Opportunities",
  description: "I'm actively seeking exciting projects that push the boundaries of web development. Whether it's creating immersive 3D experiences, building scalable applications, or crafting innovative digital solutions.",
  progress: 0,
  technologies: ["React", "Three.js", "Node.js", "Next.js"],
  startDate: "Present",
  status: "Available"
};

const achievements = {
  projectsCompleted: 250,
  yearsOfExperience: 3,
  clientSatisfaction: 10,
  githubContributions: 1869,
  technologiesMastered: 20,
  awards: 5
};

const education = {
  current: {
    school: "Shri Rajendra High School",
    grade: "10th Class",
    year: "2025-2026",
    achievements: [
      "🥇 Academic Excellence Award",
      "🥇 Math Olympiad Gold Medalist", 
      "🥇 Science Olympiad Gold Medalist",
      "💻 Programming Club President",
      "🎨 Digital Art Competition Winner"
    ]
  }
};

const certifications = [
  {
    title: "Data Structures & Algorithms Essentials using C++",
    issuer: "Udemy",
    date: "Nov. 3, 2024",
    link: "#",
    badge: "🏆"
  },
  {
    title: "Mastering Github Copilot",
    issuer: "Udemy",
    date: "Feb. 2, 2025",
    link: "#",
    badge: "🎮"
  },
  {
    title: "DevOps for Data Scientists",
    issuer: "Udemy",
    date: "Feb. 2, 2025",
    link: "#",
    badge: "🎨"
  },
  {
    title: "Full Stack Web Development",
    issuer: "JS Mastery",
    date: "March 3, 2025",
    link: "#",
    badge: "💻"
  },
];

const services = [
  {
    title: "3D Web Experiences",
    description: "Immersive websites with Three.js and WebGL",
    icon: "🌐",
    technologies: ["Three.js", "React Three Fiber", "WebGL"],
    price: "Premium"
  },
  {
    title: "Full Stack Development", 
    description: "Complete web applications from frontend to backend",
    icon: "⚡",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    price: "Competitive"
  },
  {
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces",
    icon: "🎨", 
    technologies: ["Figma", "Adobe XD", "Framer"],
    price: "Affordable"
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile applications", 
    icon: "📱",
    technologies: ["React Native", "Flutter", "Expo"],
    price: "Standard"
  }
];

export const Interface = (props) => {
  const { setSection, performanceMode = false } = props;
  const [githubStats, setGithubStats] = useState({
    contributions: 1869,
    repos: 250,
    stars: 0,
    topLanguages: [],
    latestRepos: [],
  });

  useEffect(() => {
    const fetchGithubStats = async () => {
      // Check cache (1-hour TTL)
      const CACHE_KEY = "gh_stats_cache";
      const CACHE_TTL = 60 * 60 * 1000;
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) {
            setGithubStats(data);
            return;
          }
        }
      } catch { /* ignore localStorage errors */ }

      // Fetch all repository pages so star count is not limited to the first page
      const fetchAllRepos = async (username) => {
        const perPage = 100;
        let page = 1;
        let allRepos = [];
        while (true) {
          const res = await axios.get(`https://api.github.com/users/${username}/repos`, {
            params: { sort: "updated", per_page: perPage, page },
          });
          const reposPage = res.data || [];
          allRepos = allRepos.concat(reposPage);
          if (reposPage.length < perPage) {
            break;
          }
          page += 1;
          // Safety cap to avoid unbounded requests
          if (page > 10) {
            break;
          }
        }
        return allRepos;
      };
      try {
        const [userRes, repos] = await Promise.all([
          axios.get(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetchAllRepos(GITHUB_USERNAME),
        ]);
      const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);

        // Top languages
        const langMap = {};
        repos.forEach((repo) => {
          if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        });
        const topLanguages = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }));

        // Latest repos (non-fork, with description)
        const latestRepos = repos
          .filter((r) => !r.fork)
          .slice(0, 5)
          .map((r) => ({
            name: r.name,
            description: r.description || "No description",
            stars: r.stargazers_count,
            language: r.language,
            url: r.html_url,
          }));

        const data = {
          contributions: 1869,
          repos: userRes.data.public_repos,
          stars,
          topLanguages,
          latestRepos,
        };

        setGithubStats(data);
        // Cache for 1 hour
        try {
         localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        } catch { /* ignore */ }
      } catch (error) {
        // Handle rate-limit (403) gracefully — keep defaults
        if (error.response?.status === 403) {
          console.warn("GitHub API rate limit reached. Using cached/default values.");
        } else {
          console.error("Error fetching GitHub stats:", error);
        }
      }
    };
    fetchGithubStats();
  }, []);

  return (
    <div className="flex flex-col items-center w-full relative interface-content">
      {/* Removed fixed background overlays - Canvas is now visible behind content */}
      
      {/* Floating particles background */}
      <div className="particles-container" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-accent-400 rounded-full animate-float opacity-40"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce-subtle opacity-50"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-accent-300 rounded-full animate-float opacity-30"></div>
      </div>
      
      {/* Main Content with proper spacing for 3D character */}
      <div className="w-full relative z-0">
        <div id="section-0"><AboutSection setSection={setSection} /></div>
        <div id="section-1"><SkillsSection /></div>
        <div id="section-2"><ProjectsSection /></div>
        <div id="section-3"><ReactNativeProjectsSection /></div>
        <div id="section-4"><EducationSection /></div>
        <div id="section-5"><AchievementsSection stats={githubStats} /></div>
        <div id="section-6"><CurrentlyBuildingSection /></div>
        <div id="section-7"><ServicesSection /></div>
        <div id="section-8"><TestimonialsSection /></div>
        <div id="section-9"><BlogSection /></div>
        <div id="section-10"><DeveloperJourneySection /></div>
        <div id="section-11"><RecognitionsSection /></div>
        <div id="section-12"><HireMeSection setSection={setSection} /></div>
        <div id="section-13"><ContactSection /></div>
        <div id="section-14"><TechGalaxySection performanceMode={performanceMode} /></div>
        <div id="section-15"><GitHubActivitySection stats={githubStats} /></div>
        <div id="section-16"><SystemDesignLabSection /></div>
      </div>
    </div>
  );
};

const BlogSection = () => {
  return (
    <Section>
      <Blog />
    </Section>
  );
};

const AboutSection = (props) => {
  const { setSection } = props;
  return (
    <Section mobileTop className="relative overflow-hidden">
      {/* Logo */}
      <motion.div 
        className="absolute top-8 left-8 z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img 
          src="/logo.png" 
          alt="Arhan Ansari Logo" 
          className="w-16 h-16 object-contain filter drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
        />
      </motion.div>

      {/* Hero Content */}
      <div className="flex flex-col items-start justify-center h-full space-y-8 w-full max-w-4xl pl-8 md:pl-16 lg:pl-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-responsive-xl font-display font-bold leading-tight">
            <span className="block text-neutral-100">Hi, I'm</span>
            <span className="block text-gradient animate-gradient-x bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent">
              Arhan Ansari
            </span>
          </h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30">
              Full Stack Developer
            </span>
            <span className="px-3 py-1 bg-accent-500/20 text-accent-300 rounded-full text-sm font-medium border border-accent-500/30">
              3D Artist
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Lighthouse: 98+
            </span>
            <span className="px-3 py-1 bg-neutral-600/20 text-neutral-300 rounded-full text-sm font-medium border border-neutral-600/30">
              Student
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="space-y-4 max-w-2xl"
        >
          <p className="text-responsive-base text-neutral-300 leading-relaxed">
            Crafting the <span className="text-primary-400 font-semibold">future of web development</span> through 
            innovative 3D experiences and cutting-edge technologies. Currently mastering the art of 
            <span className="text-accent-400 font-semibold"> immersive digital solutions</span> while 
            excelling in my studies at Shri Rajendra High School.
          </p>
          
          <p className="text-lg text-neutral-400 leading-relaxed">
            Specializing in <span className="text-primary-300">React</span>, 
            <span className="text-accent-300"> Three.js</span>, and 
            <span className="text-primary-300"> modern web technologies</span> to create 
            experiences that inspire and engage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <motion.button
            onClick={() => {
              setSection(13);
              document.getElementById("section-13")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative overflow-hidden flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white group btn-gradient-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14,165,233,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span>Let's Collaborate</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
          
          <motion.button
            onClick={() => {
              setSection(2);
              document.getElementById("section-2")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative overflow-hidden flex items-center justify-center px-6 py-3 rounded-xl font-semibold group border border-primary-500/40 text-neutral-200 glass-morphism"
            whileHover={{ scale: 1.05, borderColor: 'rgba(14,165,233,0.8)', boxShadow: '0 0 20px rgba(14,165,233,0.2)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span>View Projects</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(217,70,239,0.2)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/resume"
              className="relative overflow-hidden flex items-center justify-center px-6 py-3 border border-accent-500/40 text-neutral-300 rounded-xl group glass-morphism font-semibold hover:border-accent-500/80 transition-colors duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume</span>
              <svg className="w-4 h-4 ml-1.5 group-hover:translate-y-0.5 transition-transform text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Social proof - Animated stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex items-center gap-6 pt-8 border-t border-neutral-800/50"
        >
          <AnimatedStatCard value={achievements.projectsCompleted} suffix="+" label="Projects" color="text-primary-400" accentColor="primary" />
          <AnimatedStatCard value={achievements.yearsOfExperience} suffix="+" label="Years" color="text-accent-400" accentColor="accent" />
          <AnimatedStatCard value={achievements.technologiesMastered} suffix="+" label="Technologies" color="text-primary-400" accentColor="primary" />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-accent-500/10 to-primary-500/10 rounded-full blur-2xl"></div>
    </Section>
  );
};

const AnimatedStatCard = ({ value, suffix, label, color, accentColor }) => {
  const { count, ref } = useAnimatedCounter(value);
  const isPrimary = accentColor === "primary";
  return (
    <motion.div
      ref={ref}
      className={`relative text-center px-5 py-3 rounded-2xl glass-morphism transition-all duration-300 group cursor-default ${
        isPrimary
          ? "border border-primary-500/20 hover:border-primary-500/50"
          : "border border-accent-500/20 hover:border-accent-500/50"
      }`}
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isPrimary
          ? "bg-gradient-to-br from-primary-500/5 to-transparent"
          : "bg-gradient-to-br from-accent-500/5 to-transparent"
      }`} />
      <div className={`text-2xl font-bold ${color} tabular-nums`}>{count}{suffix}</div>
      <div className="text-xs text-neutral-500 mt-1 font-medium">{label}</div>
    </motion.div>
  );
};

const AchievementCountCard = ({ achievement, index }) => {
  const { count, ref } = useAnimatedCounter(achievement.value, 2500);
  return (
    <motion.div
      ref={ref}
      className="card-modern text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <div className="space-y-2">
          <div className={`text-4xl font-bold ${achievement.color} tabular-nums group-hover:scale-110 transition-transform`}>
            {count}{achievement.suffix}
          </div>
          <div className="text-neutral-300 font-medium">
            {achievement.key}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const skills = [
  {
    title: "Three.js / React Three Fiber",
    description: "Building immersive 3D web experiences",
    years: "2+ years",
    projects: "15+ projects",
    icon: "🎮",
    category: "3D Development",
    technologies: ["Three.js", "React Three Fiber", "WebGL", "Blender"]
  },
  {
    title: "Frontend Development",
    description: "Modern React applications with TypeScript",
    years: "3+ years",
    projects: "50+ projects",
    icon: "⚛️",
    category: "Frontend",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
  },
  {
    title: "Backend Development", 
    description: "RESTful APIs and real-time applications",
    years: "2+ years",
    projects: "30+ projects",
    icon: "🚀",
    category: "Backend",
    technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL"]
  },
  {
    title: "UI/UX Design",
    description: "User-centered design with modern aesthetics",
    years: "2+ years",
    projects: "40+ designs",
    icon: "🔎 + ✍️ + ✨",
    category: "Design",
    technologies: ["Figma", "Adobe XD", "Framer", "Sketch"]
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile applications",
    years: "1+ years",
    projects: "10+ apps",
    icon: "📱",
    category: "Mobile",
    technologies: ["React Native", "Flutter", "Expo"]
  },
  {
    title: "DevOps & Deployment",
    description: "CI/CD and cloud infrastructure",
    years: "1+ years",
    projects: "25+ deployments",
    icon: "☁️",
    category: "DevOps",
    technologies: ["Vercel", "Netlify", "AWS", "Docker"]
  }
];

const languages = [
  {
    title: "🇺🇸 English",
    level: 100,
  },
  {
    title: "🇮🇳 Hindi", 
    level: 100,
  },
  {
    title: "🇮🇳 Marathi",
    level: 90,
  },
];

const techToolboxGroups = [
  { label: "Frontend", icon: "⚛️", techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { label: "Backend", icon: "⚡", techs: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"] },
  { label: "Mobile", icon: "📱", techs: ["React Native", "Expo", "iOS", "Android"] },
  { label: "AI / ML", icon: "🤖", techs: ["Google Gemini", "Together AI", "OpenAI", "Langchain", "Vercel AI SDK"] },
  { label: "3D / Creative", icon: "🎮", techs: ["Three.js", "React Three Fiber", "WebGL", "Blender", "GSAP"] },
  { label: "DevOps", icon: "☁️", techs: ["Vercel", "Appwrite", "Firebase", "Convex", "Sentry"] },
];

const SkillsSection = () => {
  const categories = [...new Set(skills.map(skill => skill.category))];
  
  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
      <motion.div className="w-full max-w-4xl pr-8 md:pr-16 lg:pr-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Technical Expertise
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Constantly evolving my skillset to stay at the forefront of modern web development
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-neutral-200 border-l-4 border-primary-500 pl-4">
                {category}
              </h3>
              
              <div className="space-y-4">
                {skills
                  .filter(skill => skill.category === category)
                  .map((skill, index) => (
                    <motion.div
                      key={skill.title}
                      className="card-modern group hover:border-primary-500/30"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {skill.icon}
                          </span>
                          <div>
                            <h4 className="font-semibold text-neutral-200 group-hover:text-primary-300 transition-colors">
                              {skill.title}
                            </h4>
                            <p className="text-sm text-neutral-400 mt-1">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skill.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-primary-500/10 text-primary-300 text-xs rounded-full border border-primary-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">
                          <span className="text-accent-400 font-medium">{skill.years}</span> experience
                        </span>
                        <span className="text-neutral-400">
                          <span className="text-primary-400 font-medium">{skill.projects}</span> completed
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 glass-morphism rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-neutral-200 mb-6 text-center">
            Languages I Speak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={language.title}
                className="text-center space-y-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-lg font-medium text-neutral-200">
                  {language.title}
                </div>
                <div className="relative h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${language.level}%` }}
                    transition={{ duration: 1.2, delay: 0.8 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>
                <div className="text-sm text-accent-400 font-medium">
                  {language.level}% Fluency
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Quick Reference Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold text-neutral-200 mb-6 text-center">My Tech Toolbox</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techToolboxGroups.map((group, gIdx) => (
              <motion.div
                key={group.label}
                className="card-modern group p-4 hover:border-primary-500/40"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: gIdx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{group.icon}</span>
                  <span className="font-semibold text-sm text-neutral-200 group-hover:text-primary-300 transition-colors">{group.label}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.techs.map((tech) => (
                    <span key={tech} className="px-1.5 py-0.5 bg-neutral-800/60 text-neutral-400 text-[10px] rounded border border-neutral-700/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

const ProjectsSection = () => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from projects
  const categories = useMemo(
    () => ["all", ...new Set(projects.map(p => p.category || "web").filter(Boolean))],
    []
  );

  // Separate featured and regular projects - memoized for performance
  const featuredProjects = useMemo(() => projects.filter(p => p.featured), []);
  
  const nonFeaturedFilteredProjects = useMemo(() => 
    selectedCategory === "all" 
      ? projects.filter(p => !p.featured)
      : projects.filter(p => (p.category || "web") === selectedCategory && !p.featured),
    [selectedCategory]
  );
  
  const allFilteredProjects = useMemo(() =>
    selectedCategory === "all"
      ? projects
      : projects.filter(p => (p.category || "web") === selectedCategory),
    [selectedCategory]
  );

  const displayProjects = nonFeaturedFilteredProjects.slice(0, visibleProjects);

  const loadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 6, nonFeaturedFilteredProjects.length));
  };

  return (
    <Section className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div className="w-full max-w-6xl pl-8 md:pl-16 lg:pl-24 space-y-16" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A showcase of my best work — from AI-powered SaaS platforms to immersive 3D experiences and full-stack applications.
          </motion.p>
        </div>

        {/* Featured Projects - Large Cards */}
        {selectedCategory === "all" && featuredProjects.length > 0 && (
          <div className="space-y-6">
            {/* First two featured as large side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredProjects.slice(0, 2).map((project, index) => (
                <FeaturedProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  onClick={() => setCurrentProject(projects.findIndex(p => p.title === project.title))}
                />
              ))}
            </div>
            {/* Remaining featured in a 3-column row */}
            {featuredProjects.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.slice(2).map((project, index) => (
                  <FeaturedProjectCard
                    key={project.title}
                    project={project}
                    index={index + 2}
                    compact
                    onClick={() => setCurrentProject(projects.findIndex(p => p.title === project.title))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Filters */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-200">
              {selectedCategory === "all" ? "All Projects" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Projects`}
              <span className="ml-2 text-sm font-normal text-neutral-500">({allFilteredProjects.length})</span>
            </h3>
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setVisibleProjects(6);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary-500 text-white shadow-glow"
                      : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50 hover:text-white border border-neutral-700/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <ProjectCard 
                key={project.title} 
                project={project} 
                index={index}
                onClick={() => setCurrentProject(projects.findIndex(p => p.title === project.title))}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleProjects < nonFeaturedFilteredProjects.length && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={loadMore}
                className="px-8 py-3 rounded-xl border border-primary-500/40 text-neutral-200 glass-morphism font-semibold hover:border-primary-500/80 transition-colors duration-300"
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(14,165,233,0.2)' }}
                whileTap={{ scale: 0.97 }}
              >
                Load More Projects ({nonFeaturedFilteredProjects.length - visibleProjects} remaining)
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Project Stats */}
        <motion.div
          className="p-8 glass-morphism rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-400">{projects.length}+</div>
              <div className="text-sm text-neutral-400">Total Projects</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent-400">{categories.length - 1}</div>
              <div className="text-sm text-neutral-400">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-400">1000+</div>
              <div className="text-sm text-neutral-400">Hours Coded</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent-400">5+</div>
              <div className="text-sm text-neutral-400">Happy Clients</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

const ReactNativeProjectsSection = () => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);
  const mobileProjects = projects.filter(p => p.category === "mobile");

  return (
    <Section className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div className="w-full max-w-6xl pl-8 md:pl-16 lg:pl-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            React Native Projects
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A collection of my cross-platform mobile applications built with React Native and Expo.
            Specializing in performant, user-friendly mobile experiences.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mobileProjects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index}
              onClick={() => setCurrentProject(projects.findIndex(p => p.title === project.title))}
            />
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

const FeaturedProjectCard = ({ project, index, onClick, compact = false }) => {
  return (
    <motion.div
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border border-primary-500/20 hover:border-primary-500/60 transition-all duration-500 ${compact ? 'h-64' : 'h-80'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(14,165,233,0.2)' }}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-900/60 to-neutral-900/10 group-hover:via-neutral-900/50 transition-all duration-500" />
      
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
          ⭐ Featured
        </span>
      </div>

      {/* Type Badge */}
      {project.type && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            project.type === 'original' ? 'bg-green-500/90 text-white' :
            project.type === 'client' ? 'bg-purple-500/90 text-white' :
            'bg-blue-500/90 text-white'
          }`}>
            {project.type === 'original' ? '✨ Original' : project.type === 'client' ? '👨‍💼 Client' : '🎨 Inspired'}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`font-bold text-white group-hover:text-primary-300 transition-colors ${compact ? 'text-lg' : 'text-xl'}`}>
              {project.title}
            </h3>
          </div>
          
          <p className={`text-neutral-300 leading-relaxed ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'}`}>
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies?.slice(0, compact ? 3 : 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 bg-neutral-800/80 text-neutral-300 text-xs rounded-md border border-neutral-700/50">
                {tech}
              </span>
            ))}
            {project.technologies?.length > (compact ? 3 : 4) && (
              <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 text-xs rounded-md">
                +{project.technologies.length - (compact ? 3 : 4)}
              </span>
            )}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-3 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/90 text-white text-xs font-medium rounded-full hover:bg-primary-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/90 text-white text-xs font-medium rounded-full hover:bg-neutral-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <Section className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
      <motion.div className="w-full max-w-5xl pl-8 md:pl-16 lg:pl-24" whileInView={"visible"}>
        <div className="text-center space-y-4 mb-12">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Client Testimonials
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            What clients say about working with me
          </motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 p-4 md:p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 1,
                    delay: 0.5 + index * 0.2,
                  },
                },
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <div className="w-16 h-16 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-lg font-bold text-indigo-500">{testimonial.name}</h3>
                  <p className="text-indigo-400 text-sm md:text-base">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-indigo-400 italic text-sm md:text-base leading-relaxed">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

const CurrentlyBuildingSection = () => {
  const activeProjects = [
    {
      title: "AutoYT",
      description: "AI-powered YouTube automation platform that generates scripts, thumbnails, and metadata using advanced AI models. Fully automated content pipeline for creators.",
      status: "🚀 Production",
      statusColor: "text-green-400 bg-green-500/10 border-green-500/30",
      accent: "from-green-500/20 to-emerald-500/10",
      border: "border-green-500/20",
      technologies: ["Next.js", "Google Gemini", "Together AI", "Vercel AI SDK", "Clerk"],
      progress: 85,
      link: null,
    },
    {
      title: "CanvasCraft",
      description: "AI-powered visual website builder — describe your vision and watch it materialize in real time. Drag-and-drop + AI generation hybrid workflow.",
      status: "⚡ Active",
      statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      accent: "from-yellow-500/20 to-orange-500/10",
      border: "border-yellow-500/20",
      technologies: ["React", "Three.js", "Google Gemini", "Cloudinary", "Node.js"],
      progress: 60,
      link: null,
    },
    {
      title: "Clipgen AI v2",
      description: "Next generation of the creator productivity tool with advanced video intelligence, automated clip selection, and multi-platform publishing.",
      status: "🚧 In Development",
      statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      accent: "from-blue-500/20 to-primary-500/10",
      border: "border-blue-500/20",
      technologies: ["Next.js 15", "Convex", "Clerk", "Together AI", "FFmpeg"],
      progress: 40,
      link: "https://clipgen-ai.vercel.app/",
    },
  ];

  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div className="w-full max-w-6xl pr-8 md:pr-16 lg:pr-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Live Progress
          </motion.div>
          <motion.h2
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Currently Building
          </motion.h2>
          <motion.p
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Active projects in development — building the future one commit at a time
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((project, index) => (
            <motion.div
              key={project.title}
              className={`relative overflow-hidden rounded-2xl border ${project.border} bg-neutral-900/50 backdrop-blur-sm p-6 group hover:shadow-lg transition-all duration-500`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-50 pointer-events-none`} />

              <div className="relative space-y-4">
                {/* Status badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${project.statusColor}`}>
                  {project.status}
                </span>

                <div>
                  <h3 className="text-xl font-bold text-neutral-100 mb-2 group-hover:text-primary-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3" title={project.description}>
                    {project.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Progress</span>
                    <span className="text-primary-400 font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      transition={{ duration: 1.2, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-neutral-800/80 text-neutral-300 text-[10px] rounded border border-neutral-700/50">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-[10px] rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View current version
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open for collaboration note */}
        <motion.div
          className="mt-8 p-6 glass-morphism rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-200">Have an idea?</h4>
              <p className="text-sm text-neutral-400">Let's collaborate and build something amazing together.</p>
            </div>
          </div>
          <a
            href="mailto:arhanansari2009@gmail.com"
            className="flex-shrink-0 px-5 py-2.5 btn-gradient-primary text-white font-semibold text-sm rounded-xl"
          >
            Let's Talk
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
};

const EducationSection = () => {
  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
      <motion.div className="w-full max-w-5xl pr-8 md:pr-16 lg:pr-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Education & Learning
          </motion.h2>
        </div>

        {/* Vertical Timeline */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary-500/50 before:to-transparent">
          
          {/* Current Education */}
          <motion.div 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-500 bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              🎓
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[45%] card-modern !p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h3 className="font-bold text-neutral-100">{education.current.school}</h3>
                <span className="text-primary-400 text-sm font-mono">{education.current.year}</span>
              </div>
              <p className="text-accent-300 text-sm mb-3">{education.current.grade}</p>
              <div className="flex flex-wrap gap-2">
                {education.current.achievements.slice(0, 3).map((a, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-neutral-800 rounded-full text-neutral-400 border border-neutral-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          {certifications.map((cert, index) => (
            <motion.div 
              key={index}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-accent-500 bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {cert.badge}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[45%] card-modern !p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <h3 className="font-bold text-neutral-100 text-sm">{cert.title}</h3>
                  <span className="text-accent-400 text-[10px] font-mono">{cert.date}</span>
                </div>
                <p className="text-neutral-400 text-xs">{cert.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

const AchievementsSection = ({ stats }) => {
  const achievementEntries = [
    { key: "Projects Completed", value: stats?.repos || achievements.projectsCompleted, suffix: "+", icon: "🚀", color: "text-primary-400" },
    { key: "Years of Experience", value: achievements.yearsOfExperience, suffix: "+", icon: "⏱️", color: "text-accent-400" },
    { key: "GitHub Stars", value: stats?.stars || 0, suffix: "", icon: "⭐", color: "text-yellow-400" },
    { key: "GitHub Contributions", value: achievements.githubContributions, suffix: "+", icon: "💻", color: "text-green-400" },
    { key: "Technologies Mastered", value: achievements.technologiesMastered, suffix: "+", icon: "🛠️", color: "text-blue-400" },
    { key: "Awards Won", value: achievements.awards || 5, suffix: "", icon: "🏆", color: "text-orange-400" },
  ];

  return (
    <Section className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div className="w-full max-w-6xl pl-8 md:pl-16 lg:pl-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Achievements & Metrics
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Milestones that reflect my journey, growth, and impact in the world of technology
          </motion.p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementEntries.map((achievement, index) => (
            <AchievementCountCard
              key={achievement.key}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>

        {/* Achievement Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card-modern">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl">🌟</span>
              <div>
                <h3 className="text-xl font-bold text-neutral-100">Recent Highlights</h3>
                <p className="text-neutral-400 text-sm">Latest achievements</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
                <span>Completed 250+ projects successfully</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                <span>Achieved 100% client satisfaction rate</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>1800+ GitHub contributions this year</span>
              </li>
            </ul>
          </div>

          <div className="card-modern">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-xl font-bold text-neutral-100">Goals for 2026</h3>
                <p className="text-neutral-400 text-sm">Future milestones</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Launch 50 new innovative projects</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Master 5 new technologies</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Expand international client base</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

const ServicesSection = () => {
  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
      <motion.div className="w-full max-w-6xl pr-8 md:pr-16 lg:pr-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Services & Solutions
          </motion.h2>
          <motion.p 
            className="text-neutral-400 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Transforming ideas into digital reality with cutting-edge technologies and innovative approaches.
            Let's bring your vision to life.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="card-modern group hover:border-primary-500/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{service.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100 group-hover:text-primary-300 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <div className="text-sm text-neutral-500 font-medium">Technologies:</div>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-neutral-800/50 text-neutral-300 text-sm rounded-full border border-neutral-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-700/30">
                    <span className="text-sm text-neutral-400">Starting from:</span>
                    <span className="text-primary-400 font-semibold">{service.price} rates</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 p-8 glass-morphism rounded-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-neutral-100 mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
            Let's discuss your ideas and create something amazing together. 
            I'm always excited to work on innovative projects that push boundaries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Start a Project
            </button>
            <button className="btn-secondary">
              Schedule Consultation
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

const ContactSection = () => {
  const [state, handleSubmit] = useForm("mayzgjbd");
  const [formValues, setFormValues] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormValid =
    formValues.user_name.trim() &&
    formValues.user_email.trim() &&
    formValues.message.trim();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the reCAPTCHA token
      const recaptchaToken = await executeRecaptcha();

      if (!recaptchaToken) {
        alert("reCAPTCHA verification failed.");
        setIsSubmitting(false);
        return;
      }

      // Proceed with form submission
      emailjs
        .sendForm("service_oxjis4c", "template_ho0bwum", e.target, {
          publicKey: "7i7_YEAdQWQzN_UBZ",
        })
        .then(
          () => {
            alert("Form submitted successfully!");
            setFormValues({ user_name: "", user_email: "", message: "" });
          },
          (error) => {
            console.error("Failed to send email:", error.text);
            alert("Form submission failed. Please try again.");
          }
        );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeRecaptcha = async () => {
    return new Promise((resolve) => {
      if (!window.grecaptcha) {
        console.error("reCAPTCHA script is not loaded.");
        resolve("");
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute( import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then((token) => {
            setRecaptchaToken(token);
            resolve(token);
          })
          .catch((error) => {
            console.error("reCAPTCHA execution failed:", error);
            resolve("");
          });
      });
    });
  };

  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div className="w-full max-w-6xl pr-8 md:pr-16 lg:pr-24 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Let's Work Together
          </motion.h2>
          <motion.p 
            className="text-neutral-300 max-w-2xl mx-auto text-center text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to bring your ideas to life? Let's create something amazing together.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="card-modern"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {state.succeeded ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-primary-400 mb-2">Message Sent!</h3>
                <p className="text-neutral-300">Thanks for reaching out! I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      value={formValues.user_name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-neutral-100/10 dark:bg-neutral-800/50 border border-neutral-400/20 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-200 placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      value={formValues.user_email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-neutral-100/10 dark:bg-neutral-800/50 border border-neutral-400/20 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-200 placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                    <ValidationError
                      className="mt-1 text-red-400 text-sm"
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-200 mb-2"
                  >
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={formValues.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 bg-neutral-100/10 dark:bg-neutral-800/50 border border-neutral-400/20 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-200 placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
                  />
                  <ValidationError
                    className="mt-1 text-red-400 text-sm"
                    errors={state.errors}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    isFormValid && !isSubmitting
                      ? "btn-primary hover:scale-105"
                      : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  }`}
                  whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Quick Contact */}
            <div className="card-modern">
              <h3 className="text-xl font-bold text-neutral-200 mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-neutral-300 font-medium">Email</p>
                    <a href="mailto:arhanansari2009@gmail.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                      arhanansari2009@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-neutral-300 font-medium">Response Time</p>
                    <p className="text-accent-400">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-modern">
              <h3 className="text-xl font-bold text-neutral-200 mb-6">Quick Start</h3>
              <div className="space-y-3">
                <a 
                  href="https://calendly.com/arhanansari2009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-neutral-100/10 dark:bg-neutral-800/30 border border-neutral-400/10 dark:border-transparent rounded-lg hover:bg-neutral-200/20 dark:hover:bg-neutral-700/30 transition-colors group"
                >
                  <span className="text-neutral-300 group-hover:text-primary-300">Schedule a Call</span>
                  <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <a 
                  href="https://github.com/ArhanAnsari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-neutral-100/10 dark:bg-neutral-800/30 border border-neutral-400/10 dark:border-transparent rounded-lg hover:bg-neutral-200/20 dark:hover:bg-neutral-700/30 transition-colors group"
                >
                  <span className="text-neutral-300 group-hover:text-primary-300">View My Code</span>
                  <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="card-modern">
              <h3 className="text-xl font-bold text-neutral-200 mb-6">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://github.com/ArhanAnsari" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-400/20 dark:border-transparent rounded-full flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/arhan-ansari-687597353" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/codewitharhan" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-400/20 dark:border-transparent rounded-full flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPER JOURNEY (section 10)
// ─────────────────────────────────────────────────────────────────────────────
const journeyMilestones = [
  {
    year: "2021",
    title: "First Lines of Code",
    description: "Started with HTML & CSS, building simple static pages. Discovered the magic of creating things from nothing but text.",
    icon: "💻",
    color: "primary",
  },
  {
    year: "2022",
    title: "JavaScript Mastery",
    description: "Dived deep into JavaScript — DOM manipulation, APIs, and building interactive web apps. First real projects went live.",
    icon: "⚡",
    color: "accent",
  },
  {
    year: "2022",
    title: "MERN Stack Developer",
    description: "Learned MongoDB, Express, React, and Node.js. Started building full-stack applications with real databases and backends.",
    icon: "🚀",
    color: "primary",
  },
  {
    year: "2023",
    title: "3D Web & Three.js",
    description: "Discovered Three.js and React Three Fiber. Built immersive 3D experiences — car racing games, multiplayer 3D apps, and this portfolio.",
    icon: "🎮",
    color: "accent",
  },
  {
    year: "2024",
    title: "AI-Powered Tools",
    description: "Integrated Google Gemini, OpenAI, and Together AI into production apps. Built SaaS platforms: Chat to PDF, InspireGem, Synthara.",
    icon: "🤖",
    color: "primary",
  },
  {
    year: "2024",
    title: "React Native Mobile Dev",
    description: "Expanded into mobile development with React Native & Expo. Built cross-platform apps for iOS and Android.",
    icon: "📱",
    color: "accent",
  },
  {
    year: "2025",
    title: "SaaS & Client Platforms",
    description: "Shipped multiple SaaS products and built production websites for real clients including Clystra Networks. 250+ projects total.",
    icon: "🏆",
    color: "primary",
  },
];

const DeveloperJourneySection = () => (
  <Section className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
    <motion.div className="w-full max-w-4xl pl-8 md:pl-16 lg:pl-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
      <div className="text-center space-y-4">
        <motion.h2
          className="text-responsive-lg font-display font-bold text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Developer Journey
        </motion.h2>
        <motion.p
          className="text-neutral-400 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          From first Hello World to building production SaaS platforms — the story so far
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/80 via-accent-500/50 to-primary-500/20" />

        <div className="space-y-10">
          {journeyMilestones.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={milestone.title}
                className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className={`md:w-5/12 pl-14 md:pl-0 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                  <motion.div
                    className={`card-modern p-5 group hover:shadow-lg ${
                      milestone.color === "primary" ? "hover:border-primary-500/40" : "hover:border-accent-500/40"
                    } transition-all duration-300`}
                    whileHover={{ y: -3, scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          milestone.color === "primary"
                            ? "bg-primary-500/15 text-primary-400"
                            : "bg-accent-500/15 text-accent-400"
                        }`}>
                          {milestone.year}
                        </span>
                        <h3 className="font-bold text-neutral-100 mt-1 group-hover:text-primary-300 transition-colors">
                          {milestone.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{milestone.description}</p>
                  </motion.div>
                </div>

                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6">
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 ${
                      milestone.color === "primary"
                        ? "border-primary-400 bg-primary-500/30 shadow-[0_0_12px_rgba(14,165,233,0.6)]"
                        : "border-accent-400 bg-accent-500/30 shadow-[0_0_12px_rgba(217,70,239,0.6)]"
                    }`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 + 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>

                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// RECOGNITIONS (section 11)
// ─────────────────────────────────────────────────────────────────────────────
const recognitionsList = [
  { title: "Urjaa Brain Arithmetic Winner", description: "First-place winner demonstrating exceptional mathematical problem-solving speed and accuracy.", icon: "🥇", category: "Competition", year: "2023", colorClass: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { title: "Math Olympiad Gold Medalist", description: "Gold medal in the school Mathematics Olympiad, achieving the highest score among all competitors.", icon: "🏅", category: "Academic", year: "2024", colorClass: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { title: "Science Olympiad Gold Medalist", description: "Top performer in the Science Olympiad, excelling in Physics, Chemistry, and Biology.", icon: "🔬", category: "Academic", year: "2024", colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { title: "Programming Club President", description: "Elected President of the school Programming Club — organizing workshops and mentoring junior developers.", icon: "👨‍💻", category: "Leadership", year: "2024", colorClass: "text-primary-400 bg-primary-500/10 border-primary-500/30" },
  { title: "Digital Art Competition Winner", description: "First place in the school Digital Art Competition, blending coding creativity with visual design skills.", icon: "🎨", category: "Creative", year: "2023", colorClass: "text-accent-400 bg-accent-500/10 border-accent-500/30" },
  { title: "250+ Open Source Projects", description: "Built and published over 250 projects across web, mobile, AI, and 3D on GitHub.", icon: "🐙", category: "Community", year: "2021–2025", colorClass: "text-green-400 bg-green-500/10 border-green-500/30" },
  { title: "1869+ GitHub Contributions", description: "Consistent daily contributions to repositories reflecting a deep passion for shipping code.", icon: "🔥", category: "Community", year: "2024", colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  { title: "Academic Excellence Award", description: "Recognized for outstanding overall academic performance combined with technical achievements.", icon: "🏆", category: "Academic", year: "2024", colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
];

const RecognitionsSection = () => (
  <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
    <motion.div className="w-full max-w-6xl pr-8 md:pr-16 lg:pr-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
      <div className="text-center space-y-4">
        <motion.h2
          className="text-responsive-lg font-display font-bold text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Recognitions
        </motion.h2>
        <motion.p
          className="text-neutral-400 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Awards, achievements, and milestones that mark the journey
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recognitionsList.map((item, index) => (
          <motion.div
            key={item.title}
            className={`relative p-5 rounded-2xl border ${item.colorClass} bg-neutral-900/40 backdrop-blur-sm group hover:shadow-lg transition-all duration-300`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-neutral-500 block">{item.category}</span>
                  <span className="text-[10px] text-neutral-600">{item.year}</span>
                </div>
              </div>
              <h3 className="font-bold text-neutral-100 text-sm leading-snug group-hover:text-primary-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3" title={item.description}>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// HIRE ME (section 12)
// ─────────────────────────────────────────────────────────────────────────────
const HireMeSection = ({ setSection }) => {
  const availableFor = [
    { icon: "⚡", label: "Full-Stack Web Development", description: "MERN, Next.js, React applications" },
    { icon: "📱", label: "Mobile App Development", description: "React Native for iOS & Android" },
    { icon: "🤖", label: "AI Integrations & SaaS", description: "LLM-powered tools & platforms" },
    { icon: "🎮", label: "3D Web Experiences", description: "Three.js, React Three Fiber, WebGL" },
    { icon: "🎨", label: "UI/UX Design", description: "Figma, Framer Motion, Tailwind" },
    { icon: "🚀", label: "Freelance Projects", description: "Short-term and long-term contracts" },
  ];

  return (
    <Section className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
      <motion.div className="w-full max-w-5xl pl-8 md:pl-16 lg:pl-24 space-y-12" whileInView="visible" viewport={{ once: true }}>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Open to Work
          </motion.div>
          <motion.h2
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Work With Me
          </motion.h2>
          <motion.p
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Available for freelance work, collaborative projects, and full-time opportunities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableFor.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-start gap-4 p-5 rounded-2xl glass-morphism border border-neutral-700/30 hover:border-primary-500/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
            >
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-neutral-200 text-sm group-hover:text-primary-300 transition-colors">{item.label}</h3>
                <p className="text-neutral-500 text-xs mt-0.5">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center space-y-6 pt-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-400 text-lg">Ready to start a project? Let's connect.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => {
                setSection(13);
                document.getElementById("section-13")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-gradient-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14,165,233,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start a Project
            </motion.button>
            <a
              href="https://calendly.com/arhanansari2009"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-neutral-200 border border-neutral-700/50 glass-morphism hover:border-primary-500/50 transition-all duration-300 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule a Call
            </a>
          </div>
          <p className="text-neutral-600 text-sm">
            💬 Usually responds within 24 hours &nbsp;·&nbsp; 🌏 Available for remote work worldwide
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE DIAGRAM (used inside ProjectCaseStudyModal)
// ─────────────────────────────────────────────────────────────────────────────

const ArchitectureDiagram = ({ architecture }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="space-y-4">
      <p className="text-neutral-500 text-xs">
        Hover over any layer to learn more. Arrows show system flow.
      </p>
      <div className="relative flex flex-col items-center gap-0 py-4">
        {architecture.layers.map((layer, index) => (
          <div key={layer.id} className="relative flex flex-col items-center w-full">
            {/* Arrow from previous */}
            {index > 0 && (
              <motion.div
                className="w-px h-8 bg-gradient-to-b from-primary-500/60 to-primary-500/20 relative"
                initial={{ height: 0 }}
                whileInView={{ height: 32 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                {/* Arrow head */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "6px solid rgba(14,165,233,0.6)",
                  }}
                />
              </motion.div>
            )}

            {/* Layer node */}
            <motion.div
              className={`relative w-full max-w-sm px-5 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                hoveredNode === layer.id
                  ? "border-primary-400 bg-primary-500/10 shadow-[0_0_16px_rgba(14,165,233,0.2)]"
                  : "border-neutral-700/50 bg-neutral-800/40"
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              tabIndex={0}
              role="button"
              aria-expanded={hoveredNode === layer.id}
              aria-label={`${layer.label} layer`}
              onMouseEnter={() => setHoveredNode(layer.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode(layer.id)}
              onBlur={() => setHoveredNode(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{layer.icon}</span>
                  <div>
                    <p className="font-semibold text-neutral-100 text-sm">{layer.label}</p>
                    {layer.tech && (
                      <p className="text-[10px] text-primary-400 mt-0.5">{layer.tech.join(" · ")}</p>
                    )}
                  </div>
                </div>
                <svg className={`w-4 h-4 transition-transform ${hoveredNode === layer.id ? "rotate-90" : ""} text-neutral-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Expanded description */}
              <AnimatePresence>
                {hoveredNode === layer.id && layer.description && (
                  <motion.p
                    className="text-xs text-neutral-400 mt-2 leading-relaxed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {layer.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK GALAXY (section 14)
// ─────────────────────────────────────────────────────────────────────────────
const TechGalaxySection = ({ performanceMode }) => (
  <Section className="bg-gradient-to-b from-transparent via-neutral-950/20 to-transparent">
    <motion.div
      className="w-full max-w-6xl pl-8 md:pl-16 lg:pl-24 space-y-8"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="text-center space-y-4">
        <motion.h2
          className="text-responsive-lg font-display font-bold text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Tech Stack Galaxy
        </motion.h2>
        <motion.p
          className="text-neutral-400 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Explore the technologies I work with — orbiting in 3D space. Click any node to learn more.
        </motion.p>
      </div>

      <ReactSuspense
        fallback={
          <div className="flex items-center justify-center h-64 text-neutral-500 text-sm">
            Loading galaxy…
          </div>
        }
      >
        <TechGalaxy performanceMode={performanceMode} />
      </ReactSuspense>
    </motion.div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB ACTIVITY (section 15)
// ─────────────────────────────────────────────────────────────────────────────

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#da5b0b",
  PHP: "#777bb4",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00add8",
};

const GitHubStatCard = ({ icon, label, value, color, delay = 0 }) => {
  const { count, ref } = useAnimatedCounter(typeof value === "number" ? value : 0, 1500);
  return (
    <motion.div
      ref={ref}
      className="glass-morphism rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.02 }}
    >
      <span className="text-3xl">{icon}</span>
      <div className={`text-3xl font-bold ${color}`}>
        {typeof value === "number" ? count.toLocaleString() : value}
      </div>
      <p className="text-neutral-400 text-xs font-medium">{label}</p>
    </motion.div>
  );
};

const GitHubActivitySection = ({ stats }) => {
  const { repos, stars, contributions, topLanguages, latestRepos } = stats;
  const maxCount = useMemo(
    () => (topLanguages.length ? Math.max(...topLanguages.map((l) => l.count)) : 1),
    [topLanguages]
  );

  // Fallback languages if API hasn't loaded yet
  const languages = topLanguages.length
    ? topLanguages
    : [
        { name: "JavaScript", count: 80 },
        { name: "TypeScript", count: 45 },
        { name: "Python", count: 25 },
        { name: "HTML", count: 60 },
        { name: "CSS", count: 40 },
        { name: "PHP", count: 15 },
      ];

  return (
    <Section alignRight className="bg-gradient-to-b from-transparent via-neutral-950/30 to-transparent">
      <motion.div
        className="w-full max-w-6xl pr-8 md:pr-16 lg:pr-24 space-y-12"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            className="text-responsive-lg font-display font-bold text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Developer Activity
          </motion.h2>
          <motion.p
            className="text-neutral-400 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Live GitHub metrics — contributions, repositories, and top languages
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GitHubStatCard icon="🔥" label="Contributions" value={contributions} color="text-orange-400" delay={0} />
          <GitHubStatCard icon="📦" label="Public Repos" value={repos} color="text-primary-400" delay={0.1} />
          <GitHubStatCard icon="⭐" label="GitHub Stars" value={stars} color="text-yellow-400" delay={0.2} />
          <GitHubStatCard icon="💻" label="Hours Coded" value={1000} color="text-green-400" delay={0.3} />
        </div>

        {/* GitHub Contribution Heatmap */}
        <motion.div
          className="glass-morphism rounded-2xl p-6 space-y-4 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold text-neutral-200 flex items-center gap-2">
            <span>📅</span> Contribution Activity
          </h3>
          <div className="min-w-0">
            <GitHubCalendar
              username={GITHUB_USERNAME}
              colorScheme="dark"
              fontSize={12}
              blockSize={13}
              blockMargin={4}
              theme={{
                dark: ["#1e293b", "#0c4a6e", "#0369a1", "#0284c7", "#38bdf8"],
              }}
              style={{ width: "100%" }}
            />
          </div>
        </motion.div>

        {/* Two-column: Languages + Latest Repos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Languages */}
          <motion.div
            className="glass-morphism rounded-2xl p-6 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-neutral-200 flex items-center gap-2">
              <span>🧠</span> Top Languages
            </h3>
            <div className="space-y-3">
              {languages.map((lang, i) => {
                const color = LANG_COLORS[lang.name] || "#888";
                const pct = Math.round((lang.count / maxCount) * 100);
                return (
                  <motion.div
                    key={lang.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        {lang.name}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.07 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Latest repos */}
          <motion.div
            className="glass-morphism rounded-2xl p-6 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-neutral-200 flex items-center gap-2">
              <span>🗂️</span> Latest Repositories
            </h3>
            <div className="space-y-3">
              {(latestRepos.length
                ? latestRepos
                : [
                    { name: "Arhans-Portfolio", description: "Interactive 3D developer portfolio", stars: 0, language: "TypeScript", url: "https://github.com/ArhanAnsari/Arhans-Portfolio" },
                    { name: "clipgen-ai", description: "AI-powered clip generator for creators", stars: 0, language: "JavaScript", url: "https://github.com/ArhanAnsari" },
                    { name: "AutoYT", description: "Automated YouTube content pipeline", stars: 0, language: "TypeScript", url: "https://github.com/ArhanAnsari" },
                  ]
              ).map((repo, i) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-neutral-800/40 hover:bg-neutral-700/40 border border-neutral-700/30 hover:border-primary-500/40 transition-all duration-200 group"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200 group-hover:text-primary-300 transition-colors truncate">
                      {repo.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1" title={repo.description}>
                      {repo.description}
                    </p>
                    {repo.language && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-neutral-500">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[repo.language] || "#888" }}
                        />
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {repo.stars}
                  </div>
                </motion.a>
              ))}
              <a
                href="https://github.com/ArhanAnsari"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-primary-400 hover:text-primary-300 transition-colors mt-2"
              >
                View all repositories →
              </a>
            </div>
          </motion.div>
        </div>

        {/* GitHub link CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/ArhanAnsari"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass-morphism border border-neutral-700/50 hover:border-primary-500/50 text-neutral-200 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary-500/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View Full GitHub Profile
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
};

// SYSTEM DESIGN LAB (section 16)
const SystemDesignLabSection = () => (
  <ReactSuspense fallback={
    <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
      Loading System Design Lab…
    </div>
  }>
    <SystemDesignLab />
  </ReactSuspense>
);
