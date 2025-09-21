import { auth } from '@/lib/firebase';

export async function saveTokenCookie() {
  const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken();

  document.cookie = `token=${token}; path=/; samesite=lax`;
}
