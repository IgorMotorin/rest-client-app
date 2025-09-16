import * as React from 'react';
import { useTranslations } from 'next-intl';
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

export type tRows = {
  id: number;
  key: string;
  value: string;
  select: boolean;
}[];

export default function VariablesTable({
  rows,
  setRows,
  setLocalStorage,
}: {
  rows: tRows;
  setRows: (headers: tRows) => void;
  setLocalStorage: (rows: tRows) => void;
}) {
  const t = useTranslations('VariablesPage');
  const handleCheckboxChange = (id: number) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].select = !newRows[index].select;
    setRows(newRows);
    setLocalStorage(newRows);
  };

  const handleTextChangeKey = (id: number, value: string) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].key = value;
    setRows(newRows);
    setLocalStorage(newRows);
  };
  const handleTextChangeValue = (id: number, value: string) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows[index].value = value;
    setRows(newRows);
    setLocalStorage(newRows);
  };
  const handleButtonDel = (id: number) => {
    const newRows = [...rows];
    const index = newRows.findIndex((x) => x.id === id);
    newRows.splice(index, 1);
    setRows(newRows);
    setLocalStorage(newRows);
  };
  const handleButtonAdd = () => {
    const newRows = [...rows];
    const arrId = newRows.map((item) => item.id);
    arrId.sort((a, b) => b - a);

    const nextId = (arrId[0] || 0) + 1;

    newRows.push({ id: nextId, key: '', value: '', select: false });
    setRows(newRows);
    setLocalStorage(newRows);
  };

  return (
    <Box className={'m-1'}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">{t('turn')}</TableCell>
              <TableCell align="center">{t('variables')}</TableCell>
              <TableCell align="center">{t('values')}</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
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
                    label={t('variable')}
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
