/** Client only UI state. Server data lives in TanStack Query, never here. */

import type { Project } from "@repo/validators";
import { create } from "zustand";

type ProjectDialog = { open: false } | { open: true; project: Project | null };

type UiState = {
  projectDialog: ProjectDialog;
  openProjectDialog: (project?: Project) => void;
  closeProjectDialog: () => void;
};

export const useUiStore = create<UiState>()((set) => ({
  projectDialog: { open: false },
  openProjectDialog: (project) => set({ projectDialog: { open: true, project: project ?? null } }),
  closeProjectDialog: () => set({ projectDialog: { open: false } }),
}));
