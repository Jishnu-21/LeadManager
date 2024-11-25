import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  styled
} from '@mui/material';
import ServiceDetailForm from '../Form/ServiceDetailForm';
import PaymentDetailsForm from '../Form/PaymentDetailsForm';
import DeadlineForm from '../Form/DeadlineForm';
import FinalDetailsForm from '../Form/FinalDetailsForm';
import BasicInfoForm from '../Form/BasicInfoForm';

const steps = ['Basic Info', 'Service Details', 'Payment Details', 'Deadlines', 'Final Details'];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      paper: '#1e1e1e',
      default: '#121212',
    },
  },
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.main,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: theme.palette.text.primary,
  },
  '& .MuiStepIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const EditLeadDialog = ({ open, onClose, lead, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [editedLead, setEditedLead] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    }
  }, [lead]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedLead(prevLead => ({
      ...prevLead,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEditedLead(prevLead => ({
      ...prevLead,
      [event.target.name]: file
    }));
  };

  const handleSave = () => {
    onSave(editedLead);
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            leadData={editedLead}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <ServiceDetailForm
            leadData={editedLead}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            setLeadData={setEditedLead}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <PaymentDetailsForm
            leadData={editedLead}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        );
      case 3:
        return (
          <DeadlineForm
            leadData={editedLead}
            handleChange={handleChange}
            selectedServices={editedLead.servicesRequested || []}
          />
        );
      case 4:
        return (
          <FinalDetailsForm
            leadData={editedLead}
            handleChange={handleChange}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (!lead) {
    return null;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <StyledDialogTitle>Edit Lead</StyledDialogTitle>
        <StyledDialogContent>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          <Box mt={4}>
            {renderStepContent(activeStep)}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            color="primary"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleSave} variant="contained" color="primary">
              Save Changes
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          )}
        </StyledDialogActions>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default EditLeadDialog;