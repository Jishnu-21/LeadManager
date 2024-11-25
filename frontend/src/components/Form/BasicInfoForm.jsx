import React from 'react';
import { 
  Grid, 
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CustomTextField from './CustomTextField';

const BasicInfoForm = ({ leadData, handleChange, errors, disabledFields = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('Lead Data:', leadData);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="BDA Email"
          name="email"
          value={leadData.email}
          onChange={handleChange}
          required
          type="email"
          error={!!errors.email}
          helperText={errors.email}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="BDA Name"
          name="bdaName"
          value={leadData.bdaName}
          onChange={handleChange}
          required
          error={!!errors.bdaName}
          helperText={errors.bdaName}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Company Name"
          name="companyName"
          value={leadData.companyName}
          onChange={handleChange}
          required
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Name"
          name="clientName"
          value={leadData.clientName}
          onChange={handleChange}
          required
          error={!!errors.clientName}
          helperText={errors.clientName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Email"
          name="clientEmail"
          value={leadData.clientEmail}
          onChange={handleChange}
          required
          type="email"
          error={!!errors.clientEmail}
          helperText={errors.clientEmail}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Designation"
          name="clientDesignation"
          value={leadData.clientDesignation}
          onChange={handleChange}
          required
          error={!!errors.clientDesignation}
          helperText={errors.clientDesignation}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Contact Number"
          name="contactNumber"
          value={leadData.contactNumber}
          onChange={handleChange}
          required
          type="tel"
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Alternate Contact"
          name="alternateContactNo"
          value={leadData.alternateContactNo}
          onChange={handleChange}
          type="tel"
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          label="Company's Business"
          name="companyOffering"
          value={leadData.companyOffering}
          onChange={handleChange}
          required
          error={!!errors.companyOffering}
          helperText={errors.companyOffering}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          label="Company's Industry"
          name="companyIndustry"
          value={leadData.companyIndustry}
          onChange={handleChange}
          required
          error={!!errors.companyIndustry}
          helperText={errors.companyIndustry}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoForm;