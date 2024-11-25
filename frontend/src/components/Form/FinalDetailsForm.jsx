import React from 'react';
import { Grid } from '@mui/material';
import CustomTextField from './CustomTextField';

const FinalDetailsForm = ({ leadData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomTextField
          label="Service Promised By BDA To Customer in Meeting"
          name="servicePromisedByBDA"
          value={leadData.servicePromisedByBDA || ''}
          onChange={handleChange}
          multiline
          rows={4}
          required
          helperText="Mention all the services BDA has promised to customer in meeting. Give detailed remarks."
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          label="Important Information Missed Out In Form"
          name="importantInformation"
          value={leadData.importantInformation || ''}
          onChange={handleChange}
          multiline
          rows={4}
          helperText="Mention any important information that was missed out in the form."
        />
      </Grid>
    </Grid>
  );
};

export default FinalDetailsForm;