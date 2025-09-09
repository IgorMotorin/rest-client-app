import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Stack } from '@mui/system';
import { Button } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'key', headerName: 'Key', width: 300, editable: true },
  { field: 'value', headerName: 'Value', width: 300, editable: true },
];

const arr = new Array(10);
const rowsDefault = arr.fill(1).map((item, index) => ({
  id: index + 1,
  key: '',
  value: '',
}));
console.log(rowsDefault);

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  const [nbRows, setNbRows] = React.useState(3);
  const [rows] = React.useState(rowsDefault);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1, width: '100%' }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows.slice(0, nbRows)}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
