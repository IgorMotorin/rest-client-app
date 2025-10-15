import { Box, styled } from '@mui/system';
import { Badge, BadgeProps, Tab, Tabs } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import DataTable from '@/components/rest/DataTable';
import { useRestStore } from '@/store/restStore';
import MultilineTextFields from '@/components/rest/MultilineTextField';
import { useLocale, useTranslations } from 'next-intl';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { usePathname } from '@/i18n/navigation';
import { useVariablesStore } from '@/store/variablesStore';
import { replaceVariables, Vars } from '@/accessory/function';
import { useSearchParams } from 'next/navigation';
import CodeGeneration from '@/components/rest/CodeGeneration';
import { toast, Toaster } from 'sonner';
import Response from '@/components/rest/Response';

function TabPanel(props: {
  value: number;
  index: number;
  children: ReactNode;
}) {
  if (props.value !== props.index) return null;
  return <Box>{props.children}</Box>;
}

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

export default function CustomTabs() {
  const t = useTranslations('Rest');

  const tabs = useRestStore((state) => state.tabs);
  const setTabs = useRestStore((state) => state.setTabs);

  const query = useRestStore((state) => state.query);
  const setQuery = useRestStore((state) => state.setQuery);

  const headers = useRestStore((state) => state.headers);
  const setHeaders = useRestStore((state) => state.setHeaders);

  const method = useRestStore((state) => state.method);

  const body = useRestStore((state) => state.body);
  const bodyTable = useRestStore((state) => state.bodyTable);

  const path = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const variables = useVariablesStore((state) => state.variables);

  const [error, setError] = React.useState('');

  useEffect(() => {
    const obj: Vars = {};
    headers.forEach((item) => {
      if (!item.select || !item.key) return;
      obj[item.key] = item.value;
    });

    const textQuery = JSON.stringify(obj);
    const [vars, onVars] = replaceVariables(textQuery, variables);
    setError(onVars && textQuery === vars ? 'Variable not found: ' : '');
    if (onVars && textQuery === vars) {
      toast.error('Variable not found');
    }

    const finalHeaders = typeof vars === 'string' ? JSON.parse(vars) : {};
    const params = new URLSearchParams();

    Object.keys(finalHeaders).forEach((key) => {
      params.set(`h.${key}`, finalHeaders[key]);
    });

    query.forEach((item) => {
      if (!item.select || !item.key) return;
      params.set(item.key, item.value);
    });

    const url =
      Object.keys(finalHeaders).length === 0 &&
      query.filter((q) => q.select).length === 0
        ? '/' + locale + path
        : '/' + locale + path + '?' + params.toString();

    window.history.replaceState(null, '', `${url}`);
  }, [locale, path, headers, variables]);

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
                color={'primary'}
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
                color={error ? 'error' : 'primary'}
              >
                {t('headers')}
              </StyledBadge>
            }
            value={3}
          />
          <Tab label={t('authorization')} value={4} />
          <Tab label="BASE64" value={5} />
          <Tab label={t('generated')} value={6} />
          <Tab label={t('response')} value={7} />
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
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '98%' } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-multiline-static"
            label={'Base64'}
            multiline
            color={'primary'}
            minRows={4}
            value={path + '?' + searchParams.toString()}
          />
        </Box>
      </TabPanel>
      <TabPanel value={tabs} index={6}>
        <CodeGeneration></CodeGeneration>
      </TabPanel>
      <TabPanel value={tabs} index={7}>
        <Response></Response>
      </TabPanel>
      <Toaster></Toaster>
    </>
  );
}
