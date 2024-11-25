import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({
  label,
  name,
  value,
  onChange,
  multiline = false,
  rows,
  required = false,
  type = 'text',
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      fullWidth
      multiline={multiline}
      rows={multiline ? rows : undefined}
      sx={{
        mb: 2,
        '& label': { color: 'white' },
        '& input, & textarea': {
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'white' },
          '&:hover fieldset': { borderColor: 'white' },
          '&.Mui-focused fieldset': { borderColor: 'white' },
          '&.Mui-focused input, &.Mui-focused textarea': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          // Autofill styles
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 30px #1e1e1e inset !important',
            WebkitTextFillColor: 'white !important',
          },
          '& textarea:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 30px #1e1e1e inset !important',
            WebkitTextFillColor: 'white !important',
          },
        },
      }}
    />
  );
};

export default CustomTextField;
