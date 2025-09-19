import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, ...historyItem } = body;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'No userId provided' });
  }

  try {
    const userDocRef = db.collection('requests').doc(userId);

    await userDocRef.set(
      {
        history: admin.firestore.FieldValue.arrayUnion({
          ...historyItem,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
