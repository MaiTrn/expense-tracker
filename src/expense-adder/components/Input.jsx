import { TextField, MenuItem } from '@mui/material';
import React from 'react';

const Input = ({ placeholder, touched, errors, onChange, value, ...props }) => {
  return (
    <TextField
      label={props.label}
      variant='outlined'
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      sx={{ m: 1, minWidth: 120, width: 500 }}
      error={touched && Boolean(errors)}
      helperText={touched && errors}
      {...props}
    >
      {props.select &&
        props.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default Input;
