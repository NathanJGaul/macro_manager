import { create } from 'zustand';

type MacroDistribution = {
  protein: number;
  carbs: number;
  fat: number;
};

type MacroDistributionStore = MacroDistribution & {
  setMacroDistribution: (macroDistribution: Partial<MacroDistribution>) => void;
};

export const useMacroDistribution = create<MacroDistributionStore>((set) => ({
  protein: 40,
  carbs: 30,
  fat: 30,
  setMacroDistribution: (macroDistribution) => set((state) => ({ ...state, ...macroDistribution })),
}));
