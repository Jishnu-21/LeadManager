import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const PartnerSelector = ({ uniquePartners, selectedPartner, handlePartnerChange }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="partner-select-label">Channel Partner</InputLabel>
      <Select
        labelId="partner-select-label"
        value={selectedPartner}
        onChange={handlePartnerChange}
        label="Channel Partner"
        renderValue={(selected) => selected || "All Partners"}
      >
        <MenuItem value="">All Partners</MenuItem>
        {uniquePartners.map((partner) => (
          <MenuItem key={partner} value={partner}>
            {partner}
          </MenuItem>
        ))}
      </Select>
      {selectedPartner && (
        <TextField
          value={selectedPartner}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          margin="normal"
          label="Selected Partner"
        />
      )}
    </FormControl>
  );
};

export default PartnerSelector;