import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { HistoryItem } from '@/lib/sendHistory';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const timestamp = url.searchParams.get('timestamp');

    if (!userId || !timestamp) {
      return NextResponse.json(
        { error: 'Missing userId or timestamp' },
        { status: 400 }
      );
    }

    const adminDb = getFirestore();
    const docRef = adminDb.collection('users').doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = docSnap.data();
    const history: HistoryItem[] = data?.history || [];

    const item = history.find((h) => h.timestamp === timestamp);

    if (!item) {
      return NextResponse.json(
        { error: 'History item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      body: item.body || { select: 'none', text: '', json: '{}' },
      bodyTable: item.bodyTable || [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
