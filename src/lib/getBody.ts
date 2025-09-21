export async function getBody(userId: string, timestamp: string) {
  try {
    const res = await fetch(
      `/api/getBody?userId=${userId}&timestamp=${timestamp}`
    );
    if (!res.ok) throw new Error('Failed to fetch body');

    return await res.json();
  } catch (err) {
    console.error('Error fetching body:', err);
    throw err;
  }
}
