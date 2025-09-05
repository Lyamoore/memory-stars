import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { randomPosition } from "../utils/randomPosition";
import type { Memory } from "../types";

type NewMemory = Omit<Memory, "id" | "position"> & { connections?: string[] };

type Store = {
  memories: Memory[];
  addMemory: (m: NewMemory) => void;
  deleteMemory: (id: string) => void;
  getById: (id: string) => Memory | null;
};

export const useMemoryStore = create<Store>((set, get) => ({
  memories: [],

  addMemory: (m) =>
    set((state) => ({
      memories: [
        ...state.memories,
        {
          ...m,
          connections: m.connections ?? [],
          id: uuidv4(),
          position: randomPosition(),
        } as Memory,
      ],
    })),

  deleteMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    })),

  getById: (id) => {
    const arr = get().memories;
    return arr.find((m) => m.id === id) || null;
  },
}));
