import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomDateField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: 'white',
    '&.Mui-focused': {
      color: 'white',
    },
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& input::-webkit-calendar-picker-indicator': {
    filter: 'invert(1)',
  },
});

const selectSx = {
  mb: 2,
  '& label': { color: 'white' },
  '& .MuiSelect-select': {
    color: 'white',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&.Mui-focused .MuiSelect-select': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiSvgIcon-root': { color: 'white' },
};

const timePeriods = [30, 45, 60, 90];

const packageDurations = {
  Unnati: {
    Silver: 30,
    Gold: 30,
    Platinum: 30
  },
  Shuruvat: {
    Silver: 30,
    Gold: 45,
    Platinum: 60
  }
};

const DeadlineForm = ({ leadData, handleChange, selectedServices }) => {
  const getPackageDuration = () => {
    if (leadData.packages && leadData.packages !== 'NA' && leadData.packageType) {
      return packageDurations[leadData.packages][leadData.packageType];
    }
    return null;
  };

  const packageDuration = getPackageDuration();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomDateField
          label="Start Date By Customer"
          name="tentativeDeadlineByCustomer"
          type="date"
          value={leadData.tentativeDeadlineByCustomer || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid>

      {packageDuration ? (
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Package Duration: {packageDuration} days  [after Onboarding]
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
            Up to {leadData.packageType === 'Silver' ? '3' : leadData.packageType === 'Gold' ? '4' : '5'} Variations in Each
          </Typography>
        </Grid>
      ) : (
        <>
          {(selectedServices.includes('Website Development') || leadData.packages === 'NA') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="website-development-time-label">Website Development Time Period</InputLabel>
                <Select
                  labelId="website-development-time-label"
                  name="websiteDevelopmentTime"
                  value={leadData.websiteDevelopmentTime || ''}
                  onChange={handleChange}
                  label="Website Development Time Period"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#1e1e1e',
                      },
                    },
                  }}
                >
                  {timePeriods.map((period) => (
                    <MenuItem key={period} value={period} style={{ color: 'white' }}>
                      {period} days
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {(selectedServices.includes('Branding') || leadData.packages === 'NA') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="branding-time-label">Branding Time Period</InputLabel>
                <Select
                  labelId="branding-time-label"
                  name="brandingTime"
                  value={leadData.brandingTime || ''}
                  onChange={handleChange}
                  label="Branding Time Period"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#1e1e1e',
                      },
                    },
                  }}
                >
                  {timePeriods.map((period) => (
                    <MenuItem key={period} value={period} style={{ color: 'white' }}>
                      {period} days
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {(selectedServices.includes('Social Media Management') || leadData.packages === 'NA') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="social-media-time-label">Social Media Marketing Time Period</InputLabel>
                <Select
                  labelId="social-media-time-label"
                  name="socialMediaTime"
                  value={leadData.socialMediaTime || ''}
                  onChange={handleChange}
                  label="Social Media Marketing Time Period"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#1e1e1e',
                      },
                    },
                  }}
                >
                  {timePeriods.map((period) => (
                    <MenuItem key={period} value={period} style={{ color: 'white' }}>
                      {period} days
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default DeadlineForm;