import { create } from 'zustand';

export type FitnessGoal = 'lose_weight' | 'maintain_weight' | 'gain_muscle' | undefined;

interface FitnessGoalStore {
  fitnessGoal: FitnessGoal;
  setFitnessGoal: (fitnessGoal: FitnessGoal) => void;
}

export const useFitnessGoal = create<FitnessGoalStore>((set) => ({
  fitnessGoal: undefined,
  setFitnessGoal: (fitnessGoal: FitnessGoal) => set({ fitnessGoal }),
}));
