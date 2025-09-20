import { HistoryItem } from '@/lib/sendHistory';

export const buildRestUrl = (locale: string, item: HistoryItem) => {
  const base64Endpoint = btoa(item.endpoint ?? '');
  const url = `/${locale}/${item.method}/${base64Endpoint}`;

  const params = new URLSearchParams();

  const appendRows = (
    rows?: Array<{ key: string; value: string; select?: boolean }>
  ) => {
    (rows ?? []).forEach((r) => {
      if (!r || !r.key) return;
      params.append(r.key, r.value ?? '');
    });
  };

  appendRows(item.headers);
  appendRows(item.query);

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};
