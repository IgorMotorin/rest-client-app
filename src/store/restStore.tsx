import { create } from 'zustand';

export interface UserRequest {
  base64: string;
  method: string;
  url: string;
  query: [];
  setBase64: (base64: string) => void;
  setMethod: (method: string) => void;
  setUrl: (url: string) => void;
  setQuery: (query: []) => void;
}

export const useRestStore = create<UserRequest>((set) => ({
  base64: '',
  method: 'get',
  url: '',
  query: [],
  setBase64: (base64) => set({ base64: base64 }),
  setMethod: (method) => set({ method: method }),
  setUrl: (url) => set({ url: url }),
  setQuery: (query: []) => set({ query: query }),
}));
