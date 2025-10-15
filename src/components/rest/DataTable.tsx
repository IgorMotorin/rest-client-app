import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Box, Stack } from '@mui/system';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';

type tRows = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];

export default function DataTable({
  rows,
  setRows,
}: {
  rows: tRows;
  setRows: (headers: tRows) => void;
}) {
  const t = useTranslations('Rest');
  const handleCheckboxChange = (id: number) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].select = !newRows[index].select;
    setRows(newRows);
  };

  const handleTextChangeKey = (id: number, value: string) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].key = value;
    setRows(newRows);
  };
  const handleTextChangeValue = (id: number, value: string) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].value = value;
    setRows(newRows);
  };
  const handleButtonDel = (id: number) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleButtonAdd = () => {
    const newRows = [...rows];
    const arrId = newRows.map((item) => item.id);
    arrId.sort((a, b) => b - a);
    const nextId = (arrId[0] || 0) + 1;

    newRows.push({ id: nextId, key: '', value: '', select: false });
    setRows(newRows);
  };

  return (
    <Box className={'m-1'}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead></TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={'r' + i}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  width: '100%',
                }}
              >
                <TableCell align="right" size={'small'}>
                  <Checkbox
                    checked={row.select}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </TableCell>
                <TableCell align="right" size={'small'}>
                  <TextField
                    className={`w-full ${row.select ? 'bg-blue-100' : ''}`}
                    id="outlined-basic"
                    label={t('key')}
                    variant="outlined"
                    size="small"
                    value={row.key}
                    onChange={(event) =>
                      handleTextChangeKey(row.id, event.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="right" size={'small'}>
                  <TextField
                    className={`w-full flex-1 ${row.select ? 'bg-blue-100' : ''}`}
                    id="outlined-basic"
                    label={t('value')}
                    variant="outlined"
                    size="small"
                    value={row.value}
                    onChange={(event) =>
                      handleTextChangeValue(row.id, event.target.value)
                    }
                  />
                </TableCell>
                <TableCell size={'small'}>
                  <Button size="small" onClick={() => handleButtonDel(row.id)}>
                    {t('del')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={1} sx={{ mb: 1, width: '100%' }}>
        <Button size="small" onClick={handleButtonAdd}>
          {t('add')}
        </Button>
      </Stack>
    </Box>
  );
}
