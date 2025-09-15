import { Box, styled } from '@mui/system';
import { Badge, BadgeProps, Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import DataTable from '@/components/rest/DataTable';
import { useRestStore } from '@/store/restStore';
import MultilineTextFields from '@/components/rest/MultilineTextField';
import { useTranslations } from 'next-intl';

function TabPanel(props: {
  value: number;
  index: number;
  children: ReactNode;
}) {
  if (props.value !== props.index) return null;
  return <Box>{props.children}</Box>;
}

export default function CustomTabs() {
  const t = useTranslations('Rest');
  const [tabs, setTabs] = useState(1);
  const query = useRestStore((state) => state.query);
  const setQuery = useRestStore((state) => state.setQuery);

  const headers = useRestStore((state) => state.headers);
  const setHeaders = useRestStore((state) => state.setHeaders);

  const method = useRestStore((state) => state.method);

  const body = useRestStore((state) => state.body);
  const bodyTable = useRestStore((state) => state.bodyTable);

  const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
      right: -6,
      top: -4,
      height: '16px',
      minWidth: '16px',
      fontSize: '10px',
      padding: 0,
    },
  }));

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={'pt-4'}>
        <Tabs
          value={tabs}
          onChange={(event, value) => setTabs(value)}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              <StyledBadge
                badgeContent={query.filter((item) => item.select).length}
                color="primary"
              >
                {t('query')}
              </StyledBadge>
            }
            value={1}
          />

          <Tab
            disabled={method === 'get'}
            label={
              <StyledBadge
                badgeContent={
                  body.select === 'form'
                    ? bodyTable.filter((item) => item.select).length
                    : null
                }
                color="primary"
              >
                {t('body')}
              </StyledBadge>
            }
            value={2}
          />
          <Tab
            label={
              <StyledBadge
                badgeContent={headers.filter((item) => item.select).length}
                color="primary"
              >
                {t('headers')}
              </StyledBadge>
            }
            value={3}
          />
          <Tab label={t('authorization')} value={4} />
          <Tab label="BASE64" value={5} />
          <Tab label={t('generated')} value={6} />
        </Tabs>
      </Box>
      <TabPanel value={tabs} index={1}>
        <DataTable rows={query} setRows={setQuery}></DataTable>
      </TabPanel>
      <TabPanel value={tabs} index={2}>
        <MultilineTextFields />
      </TabPanel>
      <TabPanel value={tabs} index={3}>
        <DataTable rows={headers} setRows={setHeaders}></DataTable>
      </TabPanel>
      <TabPanel value={tabs} index={4}>
        {t('authorization')}
      </TabPanel>
      <TabPanel value={tabs} index={5}>
        <div>Base 64</div>
      </TabPanel>
      <TabPanel value={tabs} index={6}>
        <div>Generated request code</div>
      </TabPanel>
    </>
  );
}
