import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid/non-secure";

const ROOT_IDS = {
  root: "root",
  desktop: "desktop",
  documents: "documents",
  projects: "projects",
  media: "media",
  downloads: "downloads",
};

const createFileNode = ({
  name,
  kind = "file",
  content = "",
  appId = null,
  icon = null,
  parentId = null,
}) => ({
  id: nanoid(),
  name,
  kind,
  content,
  appId,
  icon,
  parentId,
  children: kind === "folder" ? [] : undefined,
  updatedAt: Date.now(),
});

const createInitialState = () => ({
  rootId: ROOT_IDS.root,
  nodes: {
    [ROOT_IDS.root]: {
      id: ROOT_IDS.root,
      name: "ArhanOS",
      kind: "folder",
      parentId: null,
      children: [
        ROOT_IDS.desktop,
        ROOT_IDS.documents,
        ROOT_IDS.projects,
        ROOT_IDS.media,
        ROOT_IDS.downloads,
      ],
      updatedAt: Date.now(),
    },
    [ROOT_IDS.desktop]: {
      id: ROOT_IDS.desktop,
      name: "Desktop",
      kind: "folder",
      parentId: ROOT_IDS.root,
      children: [],
      updatedAt: Date.now(),
    },
    [ROOT_IDS.documents]: {
      id: ROOT_IDS.documents,
      name: "Documents",
      kind: "folder",
      parentId: ROOT_IDS.root,
      children: [],
      updatedAt: Date.now(),
    },
    [ROOT_IDS.projects]: {
      id: ROOT_IDS.projects,
      name: "Projects",
      kind: "folder",
      parentId: ROOT_IDS.root,
      children: [],
      updatedAt: Date.now(),
    },
    [ROOT_IDS.media]: {
      id: ROOT_IDS.media,
      name: "Media",
      kind: "folder",
      parentId: ROOT_IDS.root,
      children: [],
      updatedAt: Date.now(),
    },
    [ROOT_IDS.downloads]: {
      id: ROOT_IDS.downloads,
      name: "Downloads",
      kind: "folder",
      parentId: ROOT_IDS.root,
      children: [],
      updatedAt: Date.now(),
    },
  },
  currentFolderId: ROOT_IDS.desktop,
  previewId: null,
});

const seedNodes = (state) => {
  const desktop = state.nodes[ROOT_IDS.desktop];
  const documents = state.nodes[ROOT_IDS.documents];
  const projects = state.nodes[ROOT_IDS.projects];
  const media = state.nodes[ROOT_IDS.media];
  const downloads = state.nodes[ROOT_IDS.downloads];

  if (!desktop || !documents || !projects || !media || !downloads) {
    return createInitialState();
  }

  if (desktop.children.length === 0) {
    const projectShortcut = createFileNode({
      name: "Projects",
      kind: "shortcut",
      appId: "projects",
      parentId: ROOT_IDS.desktop,
    });
    const notesShortcut = createFileNode({
      name: "Notes",
      kind: "shortcut",
      appId: "notes",
      parentId: ROOT_IDS.desktop,
    });
    const safariShortcut = createFileNode({
      name: "Safari",
      kind: "shortcut",
      appId: "safari",
      parentId: ROOT_IDS.desktop,
    });
    const resumeFile = createFileNode({
      name: "Resume.pdf",
      kind: "file",
      content: "Arhan Ansari Resume",
      parentId: ROOT_IDS.desktop,
      icon: "/images/pdf.png",
    });

    desktop.children = [
      projectShortcut.id,
      notesShortcut.id,
      safariShortcut.id,
      resumeFile.id,
    ];
    state.nodes[projectShortcut.id] = projectShortcut;
    state.nodes[notesShortcut.id] = notesShortcut;
    state.nodes[safariShortcut.id] = safariShortcut;
    state.nodes[resumeFile.id] = resumeFile;
  }

  if (documents.children.length === 0) {
    const notesFile = createFileNode({
      name: "Ideas.md",
      kind: "text",
      content: "# Ideas\n- Ship Safari reality layer\n- Add mission control",
      parentId: ROOT_IDS.documents,
    });
    const contactFile = createFileNode({
      name: "Contact.txt",
      kind: "text",
      content: "arhanansari2009@gmail.com",
      parentId: ROOT_IDS.documents,
    });
    documents.children = [notesFile.id, contactFile.id];
    state.nodes[notesFile.id] = notesFile;
    state.nodes[contactFile.id] = contactFile;
  }

  if (projects.children.length === 0) {
    const safariProject = createFileNode({
      name: "Safari Reality Layer",
      kind: "project",
      content: "Native Safari simulation",
      parentId: ROOT_IDS.projects,
      appId: "safari",
    });
    const finderProject = createFileNode({
      name: "Finder Filesystem",
      kind: "project",
      content: "Finder filesystem engine",
      parentId: ROOT_IDS.projects,
      appId: "finder",
    });
    projects.children = [safariProject.id, finderProject.id];
    state.nodes[safariProject.id] = safariProject;
    state.nodes[finderProject.id] = finderProject;
  }

  if (media.children.length === 0) {
    const wallpaperFile = createFileNode({
      name: "Wallpaper Preview",
      kind: "image",
      icon: "/wallpapers/iClarified-macOS-Tahoe-Wallpaper/iClarified-macOS-Tahoe-Wallpaper/iClarified-macOS-Tahoe-Default-Light.jpg",
      parentId: ROOT_IDS.media,
    });
    media.children = [wallpaperFile.id];
    state.nodes[wallpaperFile.id] = wallpaperFile;
  }

  if (downloads.children.length === 0) {
    const downloadFile = createFileNode({
      name: "README.md",
      kind: "text",
      content: "Downloaded file content",
      parentId: ROOT_IDS.downloads,
    });
    downloads.children = [downloadFile.id];
    state.nodes[downloadFile.id] = downloadFile;
  }
};

const getNodePath = (state, nodeId) => {
  const path = [];
  let currentId = nodeId;
  while (currentId && state.nodes[currentId]) {
    const current = state.nodes[currentId];
    path.unshift(current.name);
    currentId = current.parentId;
  }
  return path;
};

const getDescendants = (state, nodeId) => {
  const node = state.nodes[nodeId];
  if (!node || node.kind !== "folder") return [];

  const result = [];
  const stack = [...(node.children || [])];
  while (stack.length) {
    const currentId = stack.shift();
    const current = state.nodes[currentId];
    if (!current) continue;
    result.push(current);
    if (current.kind === "folder" && current.children) {
      stack.push(...current.children);
    }
  }
  return result;
};

const cloneNode = (state, nodeId, newParentId) => {
  const node = state.nodes[nodeId];
  if (!node) return null;
  const cloned = {
    ...node,
    id: nanoid(),
    name: `${node.name} copy`,
    parentId: newParentId,
    updatedAt: Date.now(),
    children: node.kind === "folder" ? [] : undefined,
  };
  state.nodes[cloned.id] = cloned;
  if (newParentId && state.nodes[newParentId]?.children) {
    state.nodes[newParentId].children.push(cloned.id);
  }
  if (node.kind === "folder" && node.children) {
    node.children.forEach((childId) => cloneNode(state, childId, cloned.id));
  }
  return cloned;
};

export const useFilesystemStore = create(
  persist(
    (set, get) => ({
      ...createInitialState(),

      initialize: () =>
        set((state) => {
          const seededState = seedNodes(state);
          return seededState || { ...state };
        }),

      getCurrentFolder: () => get().nodes[get().currentFolderId] || null,
      getNode: (nodeId) => get().nodes[nodeId] || null,

      listFolder: (folderId) => {
        const state = get();
        const folder = state.nodes[folderId];
        if (!folder || folder.kind !== "folder") return [];
        return (folder.children || [])
          .map((childId) => state.nodes[childId])
          .filter(Boolean);
      },

      openFolder: (folderId) => {
        const folder = get().nodes[folderId];
        if (!folder || folder.kind !== "folder") return;
        set({ currentFolderId: folderId });
      },

      goUp: () => {
        const state = get();
        const current = state.nodes[state.currentFolderId];
        if (current?.parentId && state.nodes[current.parentId]) {
          set({ currentFolderId: current.parentId });
        }
      },

      createFolder: (name = "New Folder", parentId = get().currentFolderId) =>
        set((state) => {
          const parent = state.nodes[parentId];
          if (!parent || parent.kind !== "folder") return state;
          const folder = createFileNode({ name, kind: "folder", parentId });
          parent.children.push(folder.id);
          state.nodes[folder.id] = folder;
          return { nodes: { ...state.nodes } };
        }),

      createTextFile: (
        name = "Untitled.txt",
        content = "",
        parentId = get().currentFolderId,
      ) =>
        set((state) => {
          const parent = state.nodes[parentId];
          if (!parent || parent.kind !== "folder") return state;
          const file = createFileNode({
            name,
            kind: "text",
            content,
            parentId,
          });
          parent.children.push(file.id);
          state.nodes[file.id] = file;
          return { nodes: { ...state.nodes } };
        }),

      renameNode: (nodeId, name) =>
        set((state) => {
          const node = state.nodes[nodeId];
          if (!node) return state;
          state.nodes[nodeId] = { ...node, name, updatedAt: Date.now() };
          return { nodes: { ...state.nodes } };
        }),

      deleteNode: (nodeId) =>
        set((state) => {
          const node = state.nodes[nodeId];
          if (!node) return state;

          const parent = node.parentId ? state.nodes[node.parentId] : null;
          if (parent?.children) {
            parent.children = parent.children.filter(
              (childId) => childId !== nodeId,
            );
          }

          const nodes = { ...state.nodes };
          delete nodes[nodeId];

          getDescendants({ ...state, nodes }, nodeId).forEach((child) => {
            delete nodes[child.id];
          });

          return {
            nodes,
            currentFolderId:
              state.currentFolderId === nodeId
                ? ROOT_IDS.desktop
                : state.currentFolderId,
          };
        }),

      restoreSnapshot: (snapshot) =>
        set((state) => {
          const rawNodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
          if (rawNodes.length === 0) return state;

          const nodes = { ...state.nodes };
          const snapshotMap = new Map();

          rawNodes.forEach((node) => {
            if (!node?.id) return;
            snapshotMap.set(node.id, {
              ...node,
              children: Array.isArray(node.children)
                ? [...node.children]
                : node.children,
              updatedAt: Date.now(),
            });
          });

          if (snapshotMap.size === 0) return state;

          const fallbackParentId = ROOT_IDS.desktop;
          const rootId = snapshot?.rootId || rawNodes[0]?.id;

          snapshotMap.forEach((node) => {
            if (!node.parentId) return;
            const parentExistsInCurrent = Boolean(nodes[node.parentId]);
            const parentExistsInSnapshot = snapshotMap.has(node.parentId);

            if (!parentExistsInCurrent && !parentExistsInSnapshot) {
              node.parentId = node.id === rootId ? fallbackParentId : rootId;
            }
          });

          snapshotMap.forEach((node) => {
            nodes[node.id] = node;
          });

          const rootNode = nodes[rootId];
          const rootParent = rootNode?.parentId
            ? nodes[rootNode.parentId]
            : null;
          if (rootNode && rootParent && rootParent.kind === "folder") {
            const children = Array.isArray(rootParent.children)
              ? rootParent.children
              : [];
            if (!children.includes(rootId)) {
              rootParent.children = [...children, rootId];
            }
          }

          return { nodes };
        }),

      moveNode: (nodeId, targetFolderId) =>
        set((state) => {
          const node = state.nodes[nodeId];
          const target = state.nodes[targetFolderId];
          if (!node || !target || target.kind !== "folder") return state;

          if (node.parentId && state.nodes[node.parentId]?.children) {
            state.nodes[node.parentId].children = state.nodes[
              node.parentId
            ].children.filter((childId) => childId !== nodeId);
          }

          node.parentId = targetFolderId;
          target.children = [...(target.children || []), nodeId];
          node.updatedAt = Date.now();

          return { nodes: { ...state.nodes } };
        }),

      duplicateNode: (nodeId, targetFolderId = get().currentFolderId) =>
        set((state) => {
          const target = state.nodes[targetFolderId];
          if (!target || target.kind !== "folder") return state;
          const cloned = cloneNode(state, nodeId, targetFolderId);
          if (!cloned) return state;
          return { nodes: { ...state.nodes } };
        }),

      previewNode: (nodeId) => set({ previewId: nodeId }),
      closePreview: () => set({ previewId: null }),
      getNodePath: (nodeId) => getNodePath(get(), nodeId),
      getDescendants: (nodeId) => getDescendants(get(), nodeId),
    }),
    {
      name: "arhanos-filesystem-store",
      version: 2,
      migrate: () => createInitialState(),
      partialize: (state) => ({
        nodes: state.nodes,
        currentFolderId: state.currentFolderId,
      }),
    },
  ),
);

export default useFilesystemStore;
