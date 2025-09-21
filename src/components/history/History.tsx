import {
  Stack,
  Typography,
  List,
  ListItem,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import { HistoryItem } from '@/lib/sendHistory';
import { getFirestore } from 'firebase-admin/firestore';
import NextLink from 'next/link';
import { buildRestUrl } from '@/lib/urlBuilder';

type HistoryProps = {
  userId: string;
  locale: string;
};

export default async function History({ userId, locale }: HistoryProps) {
  const adminDb = getFirestore();
  const docRef = adminDb.collection('users').doc(userId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          You haven&apos;t executed any requests yet
        </Typography>
        <MuiLink component={NextLink} href={`/${locale}/get`}>
          REST Client
        </MuiLink>
      </Paper>
    );
  }

  const data = docSnap.data();
  const history: HistoryItem[] = (data?.history || []).sort(
    (a: HistoryItem, b: HistoryItem) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h5">History Requests</Typography>
      <List>
        {history.map((item, idx) => (
          <ListItem key={idx}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <MuiLink
                component={NextLink}
                href={buildRestUrl(locale, item)}
                underline="hover"
                sx={{ fontWeight: 'bold' }}
              >
                [{item.method.toUpperCase()}] {item.endpoint}
              </MuiLink>
              <Typography variant="body2" color="text.secondary">
                Status: {item.statusCode} | Latency: {item.latency?.toFixed(1)}
                ms | Date: {new Date(item.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
