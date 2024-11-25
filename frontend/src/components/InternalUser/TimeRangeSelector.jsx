import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TimeRangeSelector = ({ timeRange, setTimeRange }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="time-range-label">Time Range</InputLabel>
      <Select
        labelId="time-range-label"
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        label="Time Range"
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TimeRangeSelector;
