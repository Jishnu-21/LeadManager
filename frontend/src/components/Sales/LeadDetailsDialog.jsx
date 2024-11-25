import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Box,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../../config';

const LeadDetailsDialog = ({ open, onClose, lead }) => {
  if (!lead) return null;

  const formatValue = (key, value) => {
    if (value == null || value === '') return null;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    if (key === 'totalServiceFeesCharged' || key === 'actualAmountReceived') return `₹${value}`;
    if (key === 'paymentDone') return value ? 'Yes' : 'No';
    if (key === 'createdAt' || key === 'updatedAt' || key === 'pendingAmountDueDate') {
      return new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return value.toString();
  };

  const formatFieldName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const relevantFields = Object.entries(lead).filter(([key, value]) => 
    key !== '_id' && 
    key !== '__v' && 
    key !== 'quotationFile' &&
    value != null && 
    value !== '' &&
    value !== 'NA'
  );

  const handleViewQuotation = () => {
    if (lead.quotationFile) {
      window.open(`${API_URL}/leads/download-quotation/${lead._id}`, '_blank');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Lead Details
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom color="primary">
          {lead.companyName} - {lead.clientName}
        </Typography>
        <Table>
          <TableBody>
            {relevantFields.map(([key, value]) => {
              const formattedValue = formatValue(key, value);
              if (formattedValue === null) return null;
              return (
                <TableRow key={key} hover>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                    {formatFieldName(key)}
                  </TableCell>
                  <TableCell>{formattedValue}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {lead.quotationFile && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewQuotation}
            >
              View Quotation
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsDialog;