type Options = {
  method: string;
  headers?: Record<string, string>;
  body?: string | null;
};
export async function fetchRequest(url: string, options: Options) {
  let response: Response | null = null;
  let responseBody: string | null = null;
  let error: string | null = null;
  try {
    response = await fetch(url, options);
    responseBody = await response.clone().text();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : 'Network error';
  }
  return { response, responseBody, error };
}
