import { renderToStaticMarkup } from 'react-dom/server';
import History from '@/components/history/History';
import { getFirestore } from 'firebase-admin/firestore';

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
}));

describe('History server component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message when no history', async () => {
    const mockDoc = { data: () => ({ history: [] }), exists: true };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const element = await History({ userId: '123', locale: 'en' });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('noRequests');
  });

  it('renders history items', async () => {
    const historyItem = {
      method: 'get',
      endpoint: '/api/test',
      statusCode: 200,
      latency: 50,
      timestamp: new Date().toISOString(),
    };
    const mockDoc = { data: () => ({ history: [historyItem] }), exists: true };
    const mockCollection = {
      doc: jest
        .fn()
        .mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) }),
    };
    (getFirestore as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });

    const element = await History({ userId: '123', locale: 'en' });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('/api/test');
  });
});
