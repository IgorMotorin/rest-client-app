import { HistoryItem } from '@/lib/sendHistory';

export const buildRestUrl = (locale: string, item: HistoryItem) => {
  const base64Endpoint = btoa(item.endpoint);
  return `/${locale}/${item.method}/${base64Endpoint}`;
};
