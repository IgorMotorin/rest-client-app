import { create } from 'zustand';

export type tQuery = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];
export type tBody = {
  select: string;
  text: string;
  json: string;
};
export type tBodyTable = {
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
  tabs: number;
  response: Response | null;
  setBase64: (base64: string) => void;
  setMethod: (method: string) => void;
  setUrl: (url: string) => void;
  setQuery: (query: tQuery) => void;
  setBody: (body: tBody) => void;
  setBodyTable: (bodyTable: tBodyTable) => void;
  setHeaders: (headers: tQuery) => void;
  setTabs: (tabs: number) => void;
  setResponse: (response: Response) => void;
}

const arr = new Array(3);
export const queryDefault = arr.fill(1).map((item, index) => ({
  id: index,
  key: '',
  value: '',
  select: false,
}));

export const headersDefault = arr.fill(1).map((item, index) => ({
  id: index,
  key: '',
  value: '',
  select: false,
}));

export const bodyDefault = {
  select: 'none',
  text: '',
  json: '{}',
};

export const bodyTableDefault = [
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
  headers: headersDefault,
  tabs: 1,
  response: null,
  setBase64: (base64) => set({ base64: base64 }),
  setMethod: (method) => set({ method: method }),
  setUrl: (url) => set({ url: url }),
  setQuery: (query: tQuery) => set({ query }),
  setBody: (body: tBody) => set({ body: body }),
  setBodyTable: (bodyTable: tBodyTable) => {
    set({ bodyTable: bodyTable });
  },
  setHeaders: (headers: tQuery) => set({ headers }),
  setTabs: (tabs) => set({ tabs: tabs }),
  setResponse: (response) => set({ response: response }),
}));
