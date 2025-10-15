import { Stack, Typography, List, ListItem, Paper } from '@mui/material';
import { HistoryItem } from '@/lib/sendHistory';
import { getFirestore } from 'firebase-admin/firestore';
import { buildRestUrl } from '@/lib/urlBuilder';
import HistoryLink from './HistoryLink';
import { getTranslations } from 'next-intl/server';

type HistoryProps = {
  userId: string;
  locale: string;
};

export default async function History({ userId, locale }: HistoryProps) {
  const t = await getTranslations('HistoryRequests');
  const adminDb = getFirestore();
  const docRef = adminDb.collection('users').doc(userId);
  const docSnap = await docRef.get();
  const data = docSnap.data();
  const history: HistoryItem[] = (data?.history || []).sort(
    (a: HistoryItem, b: HistoryItem) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (!docSnap.exists || history.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {t('noRequests')}
        </Typography>
        <HistoryLink href={`/${locale}/get`}>{t('goToRestClient')}</HistoryLink>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" align="center">
        {t('title')}
      </Typography>
      <List>
        {history.map((item, idx) => (
          <ListItem key={idx}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <HistoryLink href={buildRestUrl(locale, item)}>
                [{item.method.toUpperCase()}] {item.endpoint}
              </HistoryLink>

              <Typography variant="body2" color="text.secondary">
                {t('status', { status: item.statusCode })} |{' '}
                {t('latency', { latency: item.latency })} |{' '}
                {t('date', { date: new Date(item.timestamp).toLocaleString() })}
              </Typography>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
