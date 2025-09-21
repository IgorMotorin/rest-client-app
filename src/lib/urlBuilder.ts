import { HistoryItem } from '@/lib/sendHistory';

export const buildRestUrl = (locale: string, item: HistoryItem) => {
  const base64Endpoint = btoa(item.endpoint ?? '');
  let url = `/${locale}/${item.method}`;

  if (base64Endpoint) {
    const base64Ts = item.timestamp ? btoa(item.timestamp) : '';
    url += `/${base64Endpoint}${base64Ts ? `/${base64Ts}` : ''}`;
  }

  const params = new URLSearchParams();

  const appendRows = (
    rows?: Array<{ key: string; value: string; select?: boolean }>,
    isHeader = false
  ) => {
    (rows ?? []).forEach((r) => {
      if (!r || !r.key) return;
      const key = isHeader ? `h.${r.key}` : r.key;
      params.append(key, r.value ?? '');
    });
  };

  appendRows(item.headers, true);
  appendRows(item.query);

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};
