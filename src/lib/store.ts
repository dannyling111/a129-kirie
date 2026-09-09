import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comic } from "@/lib/quant/types";
import { TEMPLATES } from "@/lib/quant/comics";

type Store = {
  comics: Comic[];
  save: (comic: Comic) => void;
  remove: (id: string) => void;
};

export const useLibrary = create<Store>()(
  persist(
    (set, get) => ({
      comics: [],
      save: (comic) =>
        set({
          comics: [comic, ...get().comics.filter((c) => c.id !== comic.id)],
        }),
      remove: (id) => set({ comics: get().comics.filter((c) => c.id !== id) }),
    }),
    { name: "kirie-library" },
  ),
);

export function resolveComic(id: string, user: Comic[]): Comic | undefined {
  return user.find((c) => c.id === id) ?? TEMPLATES.find((c) => c.id === id);
}
