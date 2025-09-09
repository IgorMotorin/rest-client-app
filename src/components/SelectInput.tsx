import React, { useState } from 'react';
import { methods } from '@/accessory/constants';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SelectInput = () => {
  const [age, setAge] = useState('');

  return (
    <FormControl className={'flex-1'}>
      <InputLabel className={'justify-center'} id="demo-simple-select-label">
        Select method
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        label="Select method"
        onChange={(event) => setAge(event.target.value as string)}
        size="small"
      >
        {methods.map((method) => (
          <MenuItem key={method} value={method}>
            {method.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
