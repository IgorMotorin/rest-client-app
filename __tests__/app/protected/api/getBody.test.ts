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
    json: <T>(data: T): MockNextResponse<T> => ({
      json: async () => data,
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
    body: { select: 'none', text: '', json: '{}' },
    bodyTable: [
      { id: 1, key: 'exampleKey', value: 'exampleValue', select: true },
    ],
    requestSize: 0,
    responseSize: 0,
    error: null,
    query: [],
    headers: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if userId or timestamp is missing', async () => {
    const req = {
      url: 'http://localhost/api/get-history',
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual({ error: 'Missing userId or timestamp' });
  });

  it('returns 404 if user not found', async () => {
    const mockDoc = { exists: false };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const req = {
      url: 'http://localhost/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
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
      url: 'http://localhost/api/get-history?userId=123&timestamp=2025-09-21T12:00:00Z',
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
      url: `http://localhost/api/get-history?userId=123&timestamp=${mockHistoryItem.timestamp}`,
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual({
      body: mockHistoryItem.body,
      bodyTable: mockHistoryItem.bodyTable,
    });
  });

  it('returns 500 if internal error occurs', async () => {
    (getFirestore as jest.Mock).mockImplementation(() => {
      throw new Error('Firestore failure');
    });

    const req = {
      url: `http://localhost/api/get-history?userId=123&timestamp=${mockHistoryItem.timestamp}`,
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual({ error: 'Internal server error' });
  });
});
