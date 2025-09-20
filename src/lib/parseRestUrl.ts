import { HistoryItem } from '@/lib/sendHistory';
import { base64ToText } from '@/accessory/function';
import {
  bodyTableDefault,
  headersDefault,
  queryDefault,
  tBody,
  tQuery,
} from '@/store/restStore';

export function parseRestUrl(url: string): HistoryItem | null {
  try {
    const [pathPart, queryString] = url.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    if (segments.length < 2) return null;

    const method = segments[1];
    const endpoint = segments[2] ? base64ToText(segments[2]) : '';

    let body: tBody = { select: 'none', text: '', json: '{}' };
    if (segments[3]) {
      const raw = base64ToText(segments[3]);
      try {
        JSON.parse(raw);
        body = { select: 'json', text: '', json: raw };
      } catch {
        body = { select: 'text', text: raw, json: '{}' };
      }
    }
    const headers: tQuery = [];
    const query: tQuery = [];
    if (queryString?.length) {
      const params = new URLSearchParams(queryString);

      params.forEach((value, key) => {
        if (key.startsWith('h.')) {
          const name = key.slice(2);
          headers.push({
            id: headers.length + 1,
            key: name,
            value,
            select: true,
          });
        } else {
          query.push({ id: query.length + 2, key, value, select: true });
        }
      });
    }

    let bodyTable = bodyTableDefault;
    if (body.select === 'json' && body.json) {
      try {
        const parsed = JSON.parse(body.json);
        bodyTable = Object.entries(parsed).map(([key, value], idx) => ({
          id: idx,
          key,
          value: String(value),
          select: true,
        }));
      } catch {
        bodyTable = bodyTableDefault;
      }
    }

    return {
      timestamp: new Date().toISOString(),
      latency: 0,
      statusCode: 0,
      method,
      requestSize: 0,
      responseSize: 0,
      error: null,
      endpoint,
      query: query.length ? query : queryDefault,
      headers: headers.length ? headers : headersDefault,
      body,
      bodyTable,
    };
  } catch (e) {
    console.error('parseRestUrl error:', e);
    return null;
  }
}
