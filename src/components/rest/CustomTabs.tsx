import { Box } from '@mui/system';
import { Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import DataTable from '@/components/rest/DataTable';

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
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabs}
          onChange={(event, value) => setTabs(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Query params" value={1} />
          <Tab label="Body" value={2} />
          <Tab label="Headers" value={3} />
          <Tab label="Authorization" value={4} />
        </Tabs>
      </Box>
      <TabPanel value={tabs} index={1}>
        <DataTable></DataTable>
      </TabPanel>
      <TabPanel value={tabs} index={2}>
        <DataTable></DataTable>
      </TabPanel>
      <TabPanel value={tabs} index={3}>
        <DataTable></DataTable>
      </TabPanel>
      <TabPanel value={tabs} index={4}>
        Item Fight
      </TabPanel>
    </>
  );
}
