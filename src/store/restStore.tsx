import { create } from 'zustand';

type tQuery = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];
type tBody = {
  select: string;
  text: string;
  json: string;
};
type tBodyTable = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];

export interface UserRequest {
  base64: string;
  method: string;
  url: string;
  query: tQuery;
  body: tBody;
  bodyTable: tBodyTable;
  headers: tQuery;
  setBase64: (base64: string) => void;
  setMethod: (method: string) => void;
  setUrl: (url: string) => void;
  setQuery: (query: tQuery) => void;
  setBody: (body: tBody) => void;
  setBodyTable: (bodyTable: tBodyTable) => void;
  setHeaders: (headers: tQuery) => void;
}

const arr = new Array(3);
const queryDefault = arr.fill(1).map((item, index) => ({
  id: index,
  key: '',
  value: '',
  select: false,
}));

const bodyDefault = {
  select: 'none',
  text: '',
  json: '{}',
};

const bodyTableDefault = [
  {
    id: 0,
    key: '',
    value: '',
    select: false,
  },
  {
    id: 1,
    key: '',
    value: '',
    select: false,
  },
  {
    id: 2,
    key: '',
    value: '',
    select: false,
  },
];

export const useRestStore = create<UserRequest>((set) => ({
  base64: '',
  method: 'get',
  url: '',
  query: queryDefault,
  body: bodyDefault,
  bodyTable: bodyTableDefault,
  headers: queryDefault,
  setBase64: (base64) => set({ base64: base64 }),
  setMethod: (method) => set({ method: method }),
  setUrl: (url) => set({ url: url }),
  setQuery: (query: tQuery) => set({ query: query }),
  setBody: (body: tBody) => set({ body: body }),
  setBodyTable: (bodyTable: tBodyTable) => set({ bodyTable: bodyTable }),
  setHeaders: (headers: tQuery) => set({ headers: headers }),
}));
