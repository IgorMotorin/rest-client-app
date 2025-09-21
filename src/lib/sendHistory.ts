import type { tQuery, tBody, tBodyTable } from '@/store/restStore';

export type HistoryItem = {
  timestamp: string;
  latency: number;
  statusCode: number;
  method: string;
  requestSize: number;
  responseSize: number;
  error: string | null;
  endpoint: string;
  query: tQuery;
  headers: tQuery;
  body: tBody;
  bodyTable: tBodyTable;
};

export async function sendHistory(userId: string, item: HistoryItem) {
  try {
    await fetch('/api/log-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...item }),
    });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
}
