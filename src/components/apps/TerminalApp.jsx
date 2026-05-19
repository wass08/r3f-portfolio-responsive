import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { useSystemStore } from '../../store/systemStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useBrowserStore } from '../../store/browserStore';
import { useNotificationStore } from '../../store/notificationStore';

const APP_ALIASES = ['about', 'projects', 'skills', 'terminal', 'content', 'contact', 'resume', 'ai', 'finder', 'safari', 'launchpad', 'notifications', 'codewitharhan', 'saas', 'devtimeline', 'settings', 'notes', 'photos', 'trash'];

const TerminalApp = ({ onAppSelect }) => {
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('root');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState(['ArhanOS Shell v5.0', 'Type "help" for available commands', '']);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const { bootTime } = useSystemStore();
  const { initialize, getNode, listFolder, openFolder, getCurrentFolder, createFolder, createTextFile, renameNode, deleteNode, moveNode, duplicateNode, getNodePath } = useFilesystemStore();
  const { openTab, resolveUrl } = useBrowserStore();
  const { pushNotification } = useNotificationStore();
  const outputEndRef = useRef(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const cwdNode = getNode(cwd) || getCurrentFolder();
  const cwdPath = useMemo(() => getNodePath(cwd).join('/').replace(/^ArhanOS\//, '~ /').replace(/^ArhanOS$/, '~'), [cwd, getNodePath]);

  const getUptime = () => {
    const diffSec = Math.max(1, Math.floor((Date.now() - bootTime) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const resolvePath = (target) => {
    if (!target || target === '~') return 'root';
    if (target === '/') return 'root';
    if (target === '.') return cwd;
    if (target === '..') {
      const node = getNode(cwd);
      return node?.parentId || 'root';
    }
    const currentNode = getNode(cwd);
    const candidates = listFolder(currentNode?.id || cwd);
    const child = candidates.find((item) => item.name.toLowerCase() === target.toLowerCase());
    if (child) return child.id;
    if (target.startsWith('/')) return target.replace(/^\/+/, '');
    return target;
  };

  const appendOutput = (lines) => {
    setOutput((prev) => [...prev, `arhan@arhanos:${cwdPath}$ ${input}`, ...lines, '']);
  };

  const openExternalOrInternal = (target) => {
    const normalized = target.toLowerCase();
    if (APP_ALIASES.includes(normalized)) {
      onAppSelect?.(normalized);
      return `opening ${normalized}...`;
    }

    if (normalized.startsWith('http') || normalized.includes('.')) {
      const url = resolveUrl(target);
      openTab(url);
      pushNotification({ type: 'terminal', title: 'Browser opened', description: url, source: 'terminal' });
      return `opening ${url} in Safari...`;
    }

    return `open: unknown target '${target}'`;
  };

  const showList = (folderId = cwd) => {
    const items = listFolder(folderId);
    return items.length ? [items.map((item) => `${item.kind === 'folder' ? 'd' : '-'} ${item.name}`).join('   ')] : [''];
  };

  const parsePathAndName = (value) => {
    const trimmed = value.trim();
    const pieces = trimmed.split('/').filter(Boolean);
    const name = pieces.pop() || trimmed;
    const parent = pieces.length ? pieces[pieces.length - 1] : cwd;
    return { name, parent };
  };

  const runCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return [''];

    const [commandRaw, ...args] = trimmed.split(/\s+/);
    const command = commandRaw.toLowerCase();

    switch (command) {
      case 'help':
        return [
          'Available commands:',
          '  ls, cd, pwd, mkdir, touch, cat, clear',
          '  open [app|url], rm, mv, cp, whoami, date',
          '  about, projects, skills, resume, contact, github, youtube, stats, uptime, neofetch',
        ];
      case 'about':
        return [`${profile.name} - ${profile.title}`, profile.bio.intro];
      case 'projects':
        return projects.slice(0, 8).map((project, index) => `${index + 1}. ${project.title}`);
      case 'skills':
        return ['Frontend: React, Next.js, Three.js, Tailwind', 'Backend: Node.js, Express, Prisma', 'AI: OpenAI, Gemini, LangChain'];
      case 'resume':
        onAppSelect?.('resume');
        return ['opening resume app...'];
      case 'contact':
        return [`Email: ${profile.contact.email}`, `Discord: ${profile.contact.discord}`];
      case 'github':
        return [`GitHub: ${profile.contact.github}`];
      case 'youtube':
        return [`YouTube: ${profile.contact.youtube}`];
      case 'stats':
        return [`Projects: ${profile.stats.projects}+`, `Contributions: ${profile.stats.contributions}`, `Tech mastered: ${profile.stats.technologiesMastered}`];
      case 'whoami':
        return ['arhan', profile.name, profile.title];
      case 'date':
        return [dayjs().format('ddd MMM D HH:mm:ss YYYY')];
      case 'uptime':
        return [`up ${getUptime()}`];
      case 'pwd':
        return [getNodePath(cwd).join('/').replace(/^ArhanOS\//, '~ /').replace(/^ArhanOS$/, '~')];
      case 'ls':
        return showList(cwd);
      case 'cd': {
        const next = resolvePath(args[0] || '~');
        const node = getNode(next);
        if (node?.kind === 'folder') {
          setCwd(node.id);
          openFolder(node.id);
          return [];
        }
        return [`cd: no such file or directory: ${args[0] || ''}`];
      }
      case 'mkdir': {
        const name = args.join(' ');
        if (!name) return ['usage: mkdir [name]'];
        createFolder(name, cwd);
        pushNotification({ type: 'terminal', title: 'Folder created', description: name, source: 'terminal' });
        return [`created folder ${name}`];
      }
      case 'touch': {
        const name = args.join(' ');
        if (!name) return ['usage: touch [name]'];
        createTextFile(name, '', cwd);
        pushNotification({ type: 'terminal', title: 'File created', description: name, source: 'terminal' });
        return [`created file ${name}`];
      }
      case 'cat': {
        const target = args.join(' ');
        if (!target) return ['usage: cat [file]'];
        const node = listFolder(cwd).find((item) => item.name.toLowerCase() === target.toLowerCase()) || getNode(resolvePath(target));
        if (!node) return [`cat: ${target}: No such file`];
        return [node.content || '(empty)'];
      }
      case 'open': {
        const target = args.join(' ');
        if (!target) return ['usage: open [app|url]'];
        return [openExternalOrInternal(target)];
      }
      case 'rm': {
        const target = args.join(' ');
        if (!target) return ['usage: rm [name]'];
        const node = listFolder(cwd).find((item) => item.name.toLowerCase() === target.toLowerCase()) || getNode(resolvePath(target));
        if (!node) return [`rm: ${target}: No such file`];
        deleteNode(node.id);
        pushNotification({ type: 'terminal', title: 'Deleted', description: node.name, source: 'terminal' });
        return [`removed ${node.name}`];
      }
      case 'mv': {
        const [source, destination] = args;
        if (!source || !destination) return ['usage: mv [source] [destination-folder]'];
        const sourceNode = listFolder(cwd).find((item) => item.name.toLowerCase() === source.toLowerCase()) || getNode(resolvePath(source));
        const destinationNode = listFolder(cwd).find((item) => item.name.toLowerCase() === destination.toLowerCase()) || getNode(resolvePath(destination));
        if (!sourceNode || destinationNode?.kind !== 'folder') return ['mv: invalid source or destination'];
        moveNode(sourceNode.id, destinationNode.id);
        return [`moved ${sourceNode.name} to ${destinationNode.name}`];
      }
      case 'cp': {
        const [source, destination] = args;
        if (!source || !destination) return ['usage: cp [source] [destination-folder]'];
        const sourceNode = listFolder(cwd).find((item) => item.name.toLowerCase() === source.toLowerCase()) || getNode(resolvePath(source));
        const destinationNode = listFolder(cwd).find((item) => item.name.toLowerCase() === destination.toLowerCase()) || getNode(resolvePath(destination));
        if (!sourceNode || destinationNode?.kind !== 'folder') return ['cp: invalid source or destination'];
        duplicateNode(sourceNode.id, destinationNode.id);
        return [`copied ${sourceNode.name} to ${destinationNode.name}`];
      }
      case 'clear':
        return '__CLEAR__';
      case 'neofetch':
        return [
          '      ___      ArhanOS 5.0',
          '   .-"   "-.   Host: Portfolio Desktop',
          '  /  .-. .-.\\  Kernel: react-vite',
          ' |  /   Y   \\| Shell: arhan-terminal',
          ' |  \\ 0 | 0 /| Uptime: ' + getUptime(),
          '  \\  `---`  /  Theme: glass-cyan',
          '   `-.___.-`   Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
        ];
      default:
        return [`command not found: ${command}`];
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const current = input;
      const result = runCommand(current);
      if (result === '__CLEAR__') {
        setOutput([]);
      } else {
        setOutput((prev) => [...prev, `arhan@arhanos:${cwdPath}$ ${current}`, ...(result || []), '']);
      }
      if (current.trim()) setHistory((prev) => [...prev, current]);
      setHistoryIndex(-1);
      setInput('');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex >= history.length - 1 ? -1 : historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? '' : history[nextIndex]);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const partial = input.split(/\s+/)[0];
      if (!partial) return;
      const candidates = [...APP_ALIASES, 'help', 'about', 'projects', 'skills', 'resume', 'contact', 'github', 'youtube', 'stats', 'whoami', 'uptime', 'ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'clear', 'open', 'rm', 'mv', 'cp', 'date', 'neofetch'].filter((command) => command.startsWith(partial.toLowerCase()));
      if (candidates.length === 1) setInput(`${candidates[0]}${partial === 'open' ? ' ' : ''}`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="border-b border-white/10 bg-neutral-950/95 px-4 py-3 text-xs text-neutral-500">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium text-neutral-200">ArhanOS Terminal</div>
            <div className="text-[11px] text-neutral-500">Filesystem synced with Finder and browser-aware open commands</div>
          </div>
          <div className="text-[11px] text-neutral-500">cwd: {cwdPath}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {output.map((line, index) => (
          <div
            key={`${line}-${index}`}
            className={line.includes('arhan@arhanos') ? 'text-cyan-300' : line.includes('not found') || line.includes('invalid') || line.includes('No such file') ? 'text-red-400' : 'text-green-400'}
          >
            {line}
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>

      <div className="border-t border-neutral-800 bg-neutral-950 p-3">
        <div className="flex items-center font-mono text-sm">
          <span className="mr-2 text-cyan-300">arhan@arhanos:{cwdPath}$</span>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command"
            className="flex-1 bg-transparent text-green-400 outline-none placeholder-neutral-600"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
