import { Box } from '@mui/system';
import { Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import DataTable from '@/components/rest/DataTable';
import { useRestStore } from '@/store/restStore';
import MultilineTextFields from '@/components/rest/MultilineTextField';

function TabPanel(props: {
  value: number;
  index: number;
  children: ReactNode;
}) {
  if (props.value !== props.index) return null;
  return <Box>{props.children}</Box>;
}

export default function CustomTabs() {
  const [tabs, setTabs] = useState(1);
  const query = useRestStore((state) => state.query);
  const setQuery = useRestStore((state) => state.setQuery);

  const headers = useRestStore((state) => state.headers);
  const setHeaders = useRestStore((state) => state.setHeaders);

  const method = useRestStore((state) => state.method);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabs}
          onChange={(event, value) => setTabs(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Query params" value={1} />
          <Tab disabled={method === 'get'} label="Body" value={2} />
          <Tab label="Headers" value={3} />
          <Tab label="Authorization" value={4} />
          <Tab label="Generated request code" value={5} />
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
        Item Fight
      </TabPanel>
      <TabPanel value={tabs} index={5}>
        <div>Generated request code</div>
      </TabPanel>
    </>
  );
}
