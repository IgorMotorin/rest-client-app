import { create } from 'zustand';

export type tVariables = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];

export interface VariablesStore {
  variables: tVariables;
  setVariables: (variables: tVariables) => void;
}

const arr = new Array(3);
const variablesDefault = arr.fill(1).map((item, index) => ({
  id: index,
  key: '',
  value: '',
  select: false,
}));

export const useVariablesStore = create<VariablesStore>((set) => ({
  variables: variablesDefault,
  setVariables: (variables: tVariables) => set({ variables: variables }),
}));
