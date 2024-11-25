import React, { useState } from 'react';
import { logout } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'sonner'; 
import { API_URL } from '../../config.jsx';
import BasicInfoForm from './BasicInfoForm';
import ServiceDetailsForm from './ServiceDetailForm.jsx';
import DeadlineForm from './DeadlineForm.jsx';
import PaymentDetailsForm from './PaymentDetailsForm.jsx';
import FinalDetailsForm from './FinalDetailsForm.jsx';
import ReviewForm from './ReviewForm.jsx';
import { useSelector, useDispatch } from 'react-redux';

const WhiteStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: 'white',
    fontWeight: 'bold',
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiStepIcon-root': {
    color: 'rgba(255, 255, 255, 0.5)',
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
}));

const WhiteStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.success.main,
  },
}));

const LeadForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [leadData, setLeadData] = useState({
    contactNumber: '',
    email: user.email || '', // Prefill with user's email
    bdaName: user.username || '', // Prefill with user's username (assuming it's the BDA name)
    companyName: '',
    clientName: '',
    clientEmail: '',
    clientDesignation: '',
    alternateContactNo: '',
    companyOffering: '',
    servicesRequested: [],
    socialMediaManagementRequirement: [],
    websiteDevelopmentRequirement: '',
    brandingRequirement: [],
    quotationFile: null,
    tentativeDeadlineByCustomer: '',
    tentativeDateGivenByBDAToCustomer: '',
    totalServiceFeesCharged: '',
    gstBill: '',
    amountWithoutGST: '',
    paymentDate: '',
    paymentDone: '',
    proofOfApprovalForPartialPayment: null,
    actualAmountReceived: '',
    pendingAmount: '',
    pendingAmountDueDate: '',
    paymentMode: '',
    servicePromisedByBDA: '',
    extraServiceRequested: '',
    importantInformation: '',
    packages: '',
    packageType: '',
    websiteDevelopmentTime: '',
    brandingTime: '',
    socialMediaTime: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      const updatedArray = checked
        ? [...leadData[name], value]
        : leadData[name].filter(item => item !== value);
      setLeadData({ ...leadData, [name]: updatedArray });
    } else if (type === 'file') {
      setLeadData({ ...leadData, [name]: files[0] });
    } else {
      setLeadData({ ...leadData, [name]: value });
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setLeadData(prevData => ({
      ...prevData,
      [fieldName]: file
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!leadData.email) newErrors.email = 'Email is required';
        if (!leadData.bdaName) newErrors.bdaName = 'BDA Name is required';
        if (!leadData.companyName) newErrors.companyName = 'Company Name is required';
        if (!leadData.clientName) newErrors.clientName = 'Client Name is required';
        if (!leadData.clientEmail) newErrors.clientEmail = 'Client Email is required';
        if (!leadData.clientDesignation) newErrors.clientDesignation = 'Client Designation is required';
        if (!leadData.contactNumber) newErrors.contactNumber = 'Contact Number is required';
        if (!leadData.companyOffering) newErrors.companyOffering = "Company's Business is required";
        break;
      case 1:
        if (errors.serviceDetails && Object.keys(errors.serviceDetails).length > 0) {
          newErrors.serviceDetails = errors.serviceDetails;
        }
        break;
      case 2:
        if (!leadData.totalServiceFeesCharged) newErrors.totalServiceFeesCharged = 'Total Service Fees is required';
        if (!leadData.paymentDone) newErrors.paymentDone = 'Payment Status is required';
        break;
      case 3:
        if (!leadData.tentativeDeadlineByCustomer) {
          newErrors.tentativeDeadlineByCustomer = 'Start Date By Customer is required';
        }
        if (!leadData.packages) {
          if (leadData.servicesRequested.includes('Website Development') && !leadData.websiteDevelopmentTime) {
            newErrors.websiteDevelopmentTime = 'Website Development Time Period is required';
          }
          if (leadData.servicesRequested.includes('Branding') && !leadData.brandingTime) {
            newErrors.brandingTime = 'Branding Time Period is required';
          }
          if (leadData.servicesRequested.includes('Social Media Management') && !leadData.socialMediaTime) {
            newErrors.socialMediaTime = 'Social Media Marketing Time Period is required';
          }
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1 && errors.serviceDetails && Object.keys(errors.serviceDetails).length > 0) {
        toast.error('Please fill in all required fields in Service Details before proceeding.');
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      setActiveStep(steps.length - 1); // Move to the review step
    } else {
      toast.error('Please fill in all required fields before reviewing.');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const formData = new FormData();
      
      for (const key in leadData) {
        if (leadData[key] instanceof File) {
          formData.append(key, leadData[key], leadData[key].name);
        } else if (Array.isArray(leadData[key])) {
          formData.append(key, JSON.stringify(leadData[key]));
        } else if (leadData[key] !== null && leadData[key] !== undefined) {
          formData.append(key, leadData[key]);
        }
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${API_URL}/leads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Lead submitted successfully!');
        setLeadData({
          contactNumber: '',
          email: '',
          bdaName: '',
          companyName: '',
          clientName: '',
          clientEmail: '',
          clientDesignation: '',
          alternateContactNo: '',
          companyOffering: '',
          companyIndustry: '',
          servicesRequested: [],
          socialMediaManagementRequirement: [],
          websiteDevelopmentRequirement: '',
          brandingRequirement: [],
          quotationFile: null,
          tentativeDeadlineByCustomer: '',
          tentativeDateGivenByBDAToCustomer: '',
          totalServiceFeesCharged: '',
          gstBill: '',
          amountWithoutGST: '',
          paymentDate: '',
          paymentDone: '',
          proofOfApprovalForPartialPayment: null,
          actualAmountReceived: '',
          pendingAmount: '',
          pendingAmountDueDate: '',
          paymentMode: '',
          servicePromisedByBDA: '',
          extraServiceRequested: '',
          importantInformation: '',
          packages: '',
          packageType: '',
          websiteDevelopmentTime: '',
          brandingTime: '',
          socialMediaTime: '',
        });
        setActiveStep(0);
      } else {
        toast.error('Failed to submit lead. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'An error occurred while submitting the lead.'}`);
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        toast.error('Network error. Please check your internet connection and try again.');
        console.error('Error request:', error.request);
      } else {
        toast.error('An error occurred while submitting the lead.');
        console.error('Error message:', error.message);
      }
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/sales/profile')
    handleMenuClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfoForm leadData={leadData} handleChange={handleChange} errors={errors}   disabledFields={['bdaName', 'email']}  />;
      case 1:
        return (
          <ServiceDetailsForm 
            leadData={leadData} 
            handleChange={handleChange} 
            setLeadData={setLeadData}
            handleFileChange={handleFileChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return <PaymentDetailsForm leadData={leadData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />;
      case 3:
        return <DeadlineForm leadData={leadData} handleChange={handleChange} selectedServices={leadData.servicesRequested} errors={errors} />;
      case 4:
        return <FinalDetailsForm leadData={leadData} handleChange={handleChange} errors={errors} />;
      case 5:
        return <ReviewForm leadData={leadData} setLeadData={setLeadData} setActiveStep={setActiveStep} />
      default:
        return 'Unknown step';
    }
  };

  const steps = ['Basic Information', 'Service Details', 'Payment Details', 'Deadline information', 'Final Details', 'Review'];

  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'transparent',
        position: 'relative',
        paddingTop: '70px', // Increased top padding to account for the fixed header
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
          zIndex: 1000,
        }}
      >
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            color: 'white', 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            flexGrow: 1,
            textAlign: 'center',
          }}
        >
          Order Punching Form
        </Typography>
        <IconButton
          onClick={handleMenuOpen}
          sx={{ 
            color: 'white',
            position: 'absolute',
            right: 16,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
      
      <Container maxWidth="md" sx={{ pt: 3, pb: 4 }}>
        {isMobile ? (
          <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
        ) : (
          <WhiteStepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <WhiteStepLabel>{label}</WhiteStepLabel>
              </Step>
            ))}
          </WhiteStepper>
        )}
        <form onSubmit={handleSubmit} style={{ color: 'white' }}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: 'white' }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinalSubmit}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  backgroundColor: 'white', 
                  color: 'black' 
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  backgroundColor: 'white', 
                  color: 'black' 
                }}
              >
                {activeStep === steps.length - 2 ? 'Review' : 'Next'}
              </Button>
            )}
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default LeadForm;