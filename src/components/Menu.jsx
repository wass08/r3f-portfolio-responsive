import {
  FaGithub,
  FaYoutube,
  FaDiscord,
  FaGlobe,
  FaXTwitter,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Menu = (props) => {
  const { onSectionChange, menuOpened, setMenuOpened } = props;
  
  const menuItems = [
    { label: "About", section: 0, icon: "👨‍💻" },
    { label: "Skills", section: 1, icon: "⚡" },
    { label: "Projects", section: 2, icon: "🚀" },
    { label: "React Native", section: 3, icon: "📱" },
    { label: "Education", section: 4, icon: "🎓" },
    { label: "Achievements", section: 5, icon: "🏆" },
    { label: "Building", section: 6, icon: "🔨" },
    { label: "Services", section: 7, icon: "🛠️" },
    { label: "Testimonials", section: 8, icon: "💬" },
    { label: "Blog", section: 9, icon: "✍️" },
    { label: "Journey", section: 10, icon: "🗺️" },
    { label: "Recognitions", section: 11, icon: "🎖️" },
    { label: "Hire Me", section: 12, icon: "💼" },
    { label: "Contact", section: 13, icon: "📬" },
    { label: "Tech Galaxy", section: 14, icon: "🌌" },
    { label: "GitHub Activity", section: 15, icon: "📊" },
    { label: "System Design Lab", section: 16, icon: "🔬" },
  ];

  // 🔥 Smooth scroll handler
  const handleScroll = (section) => {
    setMenuOpened(false);
    const target = document.getElementById(`section-${section}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hamburger Button (hidden when open) */}
      {!menuOpened && (
        <motion.button
          type="button"
          onClick={() => setMenuOpened(true)}
          className="z-50 fixed top-6 right-6 p-3 glass-morphism-dark rounded-xl w-14 h-14 flex items-center justify-center group hover:bg-primary-500/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-5 relative">
            <motion.div className="absolute h-0.5 w-6 rounded-full bg-slate-200" />
            <motion.div className="absolute top-2 h-0.5 w-6 rounded-full bg-slate-200" />
            <motion.div className="absolute top-4 h-0.5 w-6 rounded-full bg-slate-200" />
          </div>
        </motion.button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {menuOpened && (
          <motion.div
            className="z-40 fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpened(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <motion.div
        className="z-50 fixed top-0 right-0 bottom-0 glass-morphism-dark border-l border-neutral-700/50 flex flex-col overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: menuOpened ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: menuOpened ? "min(400px, 100vw)" : "0" }}
      >
        {/* Header + Close */}
        <div className="p-8 border-b border-neutral-700/30 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Arhan Ansari Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className="text-xl font-display font-bold text-gradient">
                Arhan Ansari
              </h2>
              <p className="text-sm text-neutral-400">Full Stack Developer</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpened(false)}
            className="p-2 rounded-lg hover:bg-neutral-800/40 transition"
            aria-label="Close Menu"
          >
            <X size={28} className="text-neutral-300" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-6">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <MenuButton
                key={item.label}
                {...item}
                onClick={() => { 
                  onSectionChange(item.section); 
                  handleScroll(item.section);
                  setMenuOpened(false); // ✅ close menu after click
                }}
                index={index}
                delay={index * 0.1}
              />
            ))}
          </nav>
        </div>

        {/* Social Links */}
        <div className="p-6 border-t border-neutral-700/30">
          <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">
            Connect With Me
          </h3>
          <div className="grid grid-cols-5 gap-3">
            <SocialLink
              href="https://github.com/ArhanAnsari"
              icon={<FaGithub size={20} />}
              label="GitHub"
              color="hover:text-neutral-100"
            />
            <SocialLink
              href="https://youtube.com/@codewitharhanofficial"
              icon={<FaYoutube size={20} />}
              label="YouTube"
              color="hover:text-red-400"
            />
            <SocialLink
              href="https://discord.com/invite/bwjCXVwS8k"
              icon={<FaDiscord size={20} />}
              label="Discord"
              color="hover:text-indigo-400"
            />
            <SocialLink
              href="https://codewitharhan.infinityfreeapp.com"
              icon={<FaGlobe size={20} />}
              label="Website"
              color="hover:text-primary-400"
            />
            <SocialLink
              href="https://x.com/codewitharhan"
              icon={<FaXTwitter size={20} />}
              label="X (Twitter)"
              color="hover:text-neutral-100"
            />
          </div>

          {/* Contact Info */}
          <div className="mt-6 p-4 bg-neutral-800/30 rounded-xl">
            <div className="text-xs text-neutral-400 mb-1">
              Ready to collaborate?
            </div>
            <div className="text-sm text-neutral-200 font-medium">
              arhanansari2009@gmail.com
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const MenuButton = ({ label, onClick, icon, index, delay }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center space-x-4 p-4 rounded-xl text-left group hover:bg-neutral-800/30 transition-all duration-300 border border-transparent hover:border-primary-500/30"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 8 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-lg font-medium text-neutral-200 group-hover:text-primary-300 transition-colors">
        {label}
      </span>
      <svg
        className="w-4 h-4 ml-auto text-neutral-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </motion.button>
  );
};

const SocialLink = ({ href, icon, label, color }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center p-3 rounded-xl bg-neutral-800/30 text-neutral-400 ${color} transition-all duration-300 hover:scale-110 hover:bg-neutral-700/30`}
      aria-label={label}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.a>
  );
};
