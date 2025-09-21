import { POST } from '@/app/api/log-request/route';
import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

interface MockNextResponse<T> {
  json: () => Promise<T>;
}

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    doc: jest.fn(),
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: <T>(data: T): MockNextResponse<T> => ({
      json: async () => data,
    }),
  },
}));

describe('POST /api/log-request', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if no userId', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ foo: 'bar' }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = await res.json();
    expect(data).toEqual({ success: false, error: 'No userId provided' });
  });

  it('returns success if userId exists', async () => {
    const mockSet = jest.fn().mockResolvedValue(undefined);
    (adminDb.doc as jest.Mock).mockReturnValue({
      set: mockSet,
    });

    const req = {
      json: jest.fn().mockResolvedValue({ userId: '123', foo: 'bar' }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = await res.json();
    expect(data).toEqual({ success: true });
    expect(adminDb.doc).toHaveBeenCalledWith('users/123');
    expect(mockSet).toHaveBeenCalledWith(
      {
        history: FieldValue.arrayUnion({ foo: 'bar' }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  it('returns success even if inner set throws', async () => {
    const mockSet = jest.fn().mockRejectedValue(new Error('inner error'));
    (adminDb.doc as jest.Mock).mockReturnValue({
      set: mockSet,
    });

    const req = {
      json: jest.fn().mockResolvedValue({ userId: '123', foo: 'bar' }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = await res.json();
    expect(data).toEqual({ success: true });
    expect(mockSet).toHaveBeenCalled();
  });
});
