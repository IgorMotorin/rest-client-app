import {
  getApps,
  initializeApp,
  applicationDefault,
  cert,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: process.env.FIREBASE_PRIVATE_KEY
        ? cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        : applicationDefault(),
    });

export const adminDb = getFirestore(app);
export const adminAuth = getAdminAuth(app);
export async function verifyIdToken(token: string) {
  return await adminAuth.verifyIdToken(token);
}
