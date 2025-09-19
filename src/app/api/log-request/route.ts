import { NextResponse, NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, ...historyItem } = body;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'No userId provided' });
  }

  try {
    try {
      const ref = adminDb.doc(`users/${userId}`);
      await ref.set(
        {
          history: FieldValue.arrayUnion({ ...historyItem }),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
