import { useRestStore } from '@/store/restStore';
import { sendHistory } from './sendHistory';
import { fetchRequest } from './fetchRequest';

export async function sendRequest(userId: string) {
  const state = useRestStore.getState();
  const url = state.url;
  const method = state.method;
  const headers = state.headers.reduce<Record<string, string>>(
    (acc, header) => {
      if (header.select) {
        acc[header.key] = header.value;
      }
      return acc;
    },
    {}
  );
  let body: string | null = null;
  if (method !== 'GET') {
    switch (state.body.select) {
      case 'text':
        body = state.body.text;
        break;
      case 'json':
        body = state.body.json;
        break;
      case 'form':
        body = JSON.stringify(
          state.bodyTable.reduce<Record<string, string>>((acc, item) => {
            if (item.select) {
              acc[item.key] = item.value;
            }
            return acc;
          }, {})
        );
        break;
    }
  }
  const startTime = performance.now();
  const { response, responseBody, error } = await fetchRequest(url, {
    method,
    headers,
    body,
  });

  const endTime = performance.now();
  const latency = Number((endTime - startTime).toFixed(3));
  const requestSize = body ? new TextEncoder().encode(body).length : 0;
  const responseSize = responseBody
    ? new TextEncoder().encode(responseBody).length
    : 0;
  const statusCode = response?.status || 0;

  const historyItem = {
    timestamp: new Date().toISOString(),
    latency,
    statusCode,
    method,
    requestSize,
    responseSize,
    error,
    endpoint: url,
    query: state.query,
    headers: state.headers,
    body: state.body,
    bodyTable: state.bodyTable,
  };

  await sendHistory(userId, historyItem);

  return { response, responseBody, historyItem };
}
