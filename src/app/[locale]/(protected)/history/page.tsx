import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import History from '@/components/history/History';

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <div>Please sign in to view your history.</div>;
  }

  try {
    const decoded = await verifyIdToken(token);
    const userId = decoded.uid;

    return <History userId={userId} locale={locale} />;
  } catch (err) {
    console.error(err);
    return <div>Unauthorized</div>;
  }
}
