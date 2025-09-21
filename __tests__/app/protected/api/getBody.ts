import { GET } from '@/app/api/getBody/route';
import { NextRequest } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { HistoryItem } from '@/lib/sendHistory';

interface MockNextResponse<T> {
  json: () => Promise<T>;
}

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: <T>(data: T, init?: { status?: number }): MockNextResponse<T> => ({
      json: async () => ({
        ...data,
        status: init?.status ?? 200,
      }),
    }),
  },
}));

describe('GET /api/get-history', () => {
  const mockHistoryItem: HistoryItem = {
    timestamp: '2025-09-21T12:00:00Z',
    method: 'GET',
    endpoint: '/api/test',
    statusCode: 200,
    latency: 10,
    requestSize: 123,
    responseSize: 456,
    error: null,
    query: [
      { id: 1, key: 'param1', value: 'value1', select: true },
      { id: 2, key: 'param2', value: 'value2', select: false },
    ],
    headers: [
      { id: 1, key: 'Authorization', value: 'Bearer token', select: true },
      { id: 2, key: 'Content-Type', value: 'application/json', select: true },
    ],
    body: { select: 'none', text: '', json: '{}' },
    bodyTable: [
      {
        id: 1,
        key: 'exampleKey',
        value: 'exampleValue',
        select: true,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if userId or timestamp is missing', async () => {
    const req = {
      url: 'https://example.com/api/get-history',
    } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({ error: 'Missing userId or timestamp' });
  });

  it('returns 404 if user not found', async () => {
    const mockDoc = { exists: false, data: () => null };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const req = {
      url: 'https://example.com/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({ error: 'User not found' });
  });

  it('returns 404 if history item not found', async () => {
    const mockDoc = { exists: true, data: () => ({ history: [] }) };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const req = {
      url: 'https://example.com/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({ error: 'History item not found' });
  });

  it('returns 200 with the history item if found', async () => {
    const mockDoc = {
      exists: true,
      data: () => ({ history: [mockHistoryItem] }),
    };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const req = {
      url: 'https://example.com/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({
      body: { test: 'data' },
      bodyTable: [{ key: 'value' }],
    });
  });

  it('returns 500 if internal error occurs', async () => {
    (getFirestore as jest.Mock).mockImplementation(() => {
      throw new Error('Firestore failure');
    });

    const req = {
      url: 'https://example.com/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({ error: 'Internal server error' });
  });
});
