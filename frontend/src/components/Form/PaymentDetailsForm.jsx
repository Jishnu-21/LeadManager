import React, { useEffect } from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  OutlinedInput,
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CustomTextField from './CustomTextField';

const PaymentDetailsForm = ({ leadData, handleChange, handleFileChange }) => {
  const paymentModes = ['Cash', 'CreditCard', 'Debit Card', 'UPI', 'NEFT', 'RTGS', 'IMPS'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const selectSx = {
    mb: 2,
    '& label': { color: 'white' },
    '& .MuiSelect-select': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&.Mui-focused .MuiSelect-select': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '& .MuiSvgIcon-root': { color: 'white' },
  };

  const dateFieldSx = {
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputBase-input': { color: 'white' },
    '& input::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)',
    },
  };

  useEffect(() => {
    if (leadData.totalServiceFeesCharged) {
      const totalAmount = parseFloat(leadData.totalServiceFeesCharged);
      const amountWithoutGST = totalAmount / 1.18; // Reverse calculate amount without GST
      handleChange({ target: { name: 'amountWithoutGST', value: amountWithoutGST.toFixed(2) } });
    }
  }, [leadData.totalServiceFeesCharged]);

  useEffect(() => {
    if (leadData.totalServiceFeesCharged && leadData.actualAmountReceived) {
      const totalAmount = parseFloat(leadData.totalServiceFeesCharged);
      const receivedAmount = parseFloat(leadData.actualAmountReceived);
      const pendingAmount = totalAmount - receivedAmount;
      handleChange({ target: { name: 'pendingAmount', value: pendingAmount.toFixed(2) } });
    }
  }, [leadData.totalServiceFeesCharged, leadData.actualAmountReceived]);

  const renderField = (field) => (
    <Grid item xs={12} sm={6} key={field.name}>
      {field.type === 'select' ? (
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.name}-label`}
            label={field.label}
            name={field.name}
            value={leadData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            input={<OutlinedInput label={field.label} />}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {field.options.map((option) => (
              <MenuItem key={option} value={option} style={{ color: 'white' }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : field.type === 'date' ? (
        <TextField
          label={field.label}
          name={field.name}
          type="date"
          value={leadData[field.name] || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required={field.required}
          fullWidth
          sx={dateFieldSx}
        />
      ) : (
        <CustomTextField
          label={field.label}
          name={field.name}
          type={field.type}
          value={leadData[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          disabled={field.disabled}
        />
      )}
    </Grid>
  );

  const commonFields = [
    { name: 'totalServiceFeesCharged', label: 'Total Service Fees Charged (Inc. GST)', type: 'number', required: true },
    { name: 'amountWithoutGST', label: 'Amount Without GST', type: 'number', disabled: true },
    { name: 'gstBill', label: 'GST Bill', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'paymentDone', label: 'Payment Done', type: 'select', options: ['Full In Advance', 'Partial Payment', 'Not Done'], required: true },
  ];

  const paymentFields = [
    { name: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
    { name: 'actualAmountReceived', label: 'Actual Amount Received', type: 'number', required: true },
    { name: 'pendingAmount', label: 'Pending Amount', type: 'number', disabled: true },
    { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: paymentModes, required: true },
  ];

  const partialPaymentFields = [
    { name: 'pendingAmountDueDate', label: 'Pending Amount Due Date', type: 'date', required: true },
  ];

  return (
    <Grid container spacing={2}>
      {commonFields.map(renderField)}
      
      {leadData.paymentDone !== 'Not Done' && (
        <>
          {paymentFields.map(renderField)}
          
          {leadData.paymentDone === 'Partial Payment' && partialPaymentFields.map(renderField)}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
              <input
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                id="payment-proof"
                type="file"
                onChange={(e) => handleFileChange(e, 'paymentProof')}
              />
              <label htmlFor="payment-proof">
                <Button 
                  variant="contained" 
                  component="span" 
                  fullWidth
                  sx={{
                    backgroundColor: leadData.paymentProof ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: leadData.paymentProof ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {leadData.paymentProof ? 'Payment Proof Added' : 'Upload Payment Proof'}
                </Button>
              </label>
              {leadData.paymentProof && (
                <Typography variant="body2" sx={{ color: 'white', marginTop: '8px' }}>
                  File selected: {leadData.paymentProof.name}
                </Typography>
              )}
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default PaymentDetailsForm;