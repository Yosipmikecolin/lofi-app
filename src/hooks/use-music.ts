import { create } from "zustand";
import { hookMusic } from "../interfaces/music";



export const useMusic = create<hookMusic>((set) => ({
    music: undefined,
    setMusic: (newMusic) => set({ music: newMusic }),
}));
