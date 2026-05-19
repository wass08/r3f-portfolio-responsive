import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commands = [
  {
    id: "projects",
    label: "Open Projects",
    description: "Browse all projects",
    icon: "🚀",
    action: (ctx) => ctx.scrollTo(2),
    category: "Navigate",
  },
  {
    id: "skills",
    label: "View Skills",
    description: "Technical expertise & stack",
    icon: "⚡",
    action: (ctx) => ctx.scrollTo(1),
    category: "Navigate",
  },
  {
    id: "journey",
    label: "Developer Journey",
    description: "Timeline of milestones",
    icon: "🗺️",
    action: (ctx) => ctx.scrollTo(10),
    category: "Navigate",
  },
  {
    id: "achievements",
    label: "Achievements",
    description: "Stats & milestones",
    icon: "🏆",
    action: (ctx) => ctx.scrollTo(5),
    category: "Navigate",
  },
  {
    id: "contact",
    label: "Contact Arhan",
    description: "Get in touch",
    icon: "📬",
    action: (ctx) => ctx.scrollTo(13),
    category: "Navigate",
  },
  {
    id: "hire",
    label: "Hire Me",
    description: "Work with me",
    icon: "💼",
    action: (ctx) => ctx.scrollTo(12),
    category: "Navigate",
  },
  {
    id: "resume",
    label: "Download Resume",
    description: "View / download resume",
    icon: "📄",
    action: () => window.open("/resume", "_blank"),
    category: "Actions",
  },
  {
    id: "github",
    label: "View GitHub",
    description: "github.com/ArhanAnsari",
    icon: "🐙",
    action: () => window.open("https://github.com/ArhanAnsari", "_blank"),
    category: "Links",
  },
  {
    id: "youtube",
    label: "YouTube Channel",
    description: "CodeWithArhan tutorials",
    icon: "▶️",
    action: () => window.open("https://youtube.com/@codewitharhanofficial", "_blank"),
    category: "Links",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    description: "@codewitharhan",
    icon: "𝕏",
    action: () => window.open("https://x.com/codewitharhan", "_blank"),
    category: "Links",
  },
  {
    id: "discord",
    label: "Discord Community",
    description: "Join the Discord server",
    icon: "💬",
    action: () => window.open("https://discord.com/invite/bwjCXVwS8k", "_blank"),
    category: "Links",
  },
  {
    id: "services",
    label: "Services",
    description: "What I offer",
    icon: "🛠️",
    action: (ctx) => ctx.scrollTo(7),
    category: "Navigate",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Articles & tutorials",
    icon: "✍️",
    action: (ctx) => ctx.scrollTo(9),
    category: "Navigate",
  },
  {
    id: "galaxy",
    label: "Tech Stack Galaxy",
    description: "Interactive 3D tech exploration",
    icon: "🌌",
    action: (ctx) => ctx.scrollTo(14),
    category: "Navigate",
  },
  {
    id: "github-activity",
    label: "GitHub Activity",
    description: "Live developer stats & repos",
    icon: "📊",
    action: (ctx) => ctx.scrollTo(15),
    category: "Navigate",
  },
];

export const CommandPalette = ({ onSectionChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const ctx = {
    scrollTo: (section) => {
      onSectionChange(section);
      const target = document.getElementById(`section-${section}`);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    },
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [query]);

  const categories = useMemo(
    () => [...new Set(filtered.map((c) => c.category))],
    [filtered]
  );

  // Flat ordered list for keyboard nav
  const allFiltered = useMemo(
    () => categories.flatMap((cat) => filtered.filter((c) => c.category === cat)),
    [categories, filtered]
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation within palette
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && allFiltered[selectedIndex]) {
        allFiltered[selectedIndex].action(ctx);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIndex, allFiltered]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className="fixed z-[201] top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="rounded-2xl overflow-hidden border border-neutral-700/60 shadow-2xl bg-neutral-900/95 backdrop-blur-xl">
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-700/50">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-500 outline-none text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd className="hidden sm:block text-[10px] text-neutral-500 bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No commands found
                  </div>
                ) : (
                  categories.map((cat) => {
                    const catItems = filtered.filter((c) => c.category === cat);
                    return (
                      <div key={cat} className="mb-1">
                        <div className="px-4 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                          {cat}
                        </div>
                        {catItems.map((cmd) => {
                          const flatIdx = allFiltered.findIndex((c) => c.id === cmd.id);
                          const isSelected = flatIdx === selectedIndex;
                          return (
                            <motion.button
                              key={cmd.id}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                isSelected
                                  ? "bg-primary-500/20 text-primary-300"
                                  : "text-neutral-200 hover:bg-neutral-800/60"
                              }`}
                              onClick={() => {
                                cmd.action(ctx);
                                setOpen(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(flatIdx)}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-base w-6 text-center flex-shrink-0">
                                {cmd.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{cmd.label}</div>
                                <div className="text-[11px] text-neutral-500 truncate">{cmd.description}</div>
                              </div>
                              {isSelected && (
                                <kbd className="text-[10px] text-neutral-500 bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 flex-shrink-0">
                                  ↵
                                </kbd>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-700/50 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-neutral-600">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1 py-0.5">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1 py-0.5">↵</kbd>
                    select
                  </span>
                </div>
                <span className="text-[10px] text-neutral-600">
                  <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1 py-0.5">⌘K</kbd>
                  {" "}to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
