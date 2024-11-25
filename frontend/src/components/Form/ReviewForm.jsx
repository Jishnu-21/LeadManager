import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem, 
  Checkbox, 
  ListItemText, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ReviewForm = ({ leadData, setLeadData, setActiveStep }) => {
  const [editingSection, setEditingSection] = useState(null);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = () => {
    setEditingSection(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const getFieldType = (key, value) => {
    if (Array.isArray(value)) return 'select';
    if (key.includes('Date')) return 'date';
    if (typeof value === 'number') return 'number';
    return 'text';
  };

  const getOptionsForField = (key) => {
    const options = {
      servicesRequested: ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Ecommerce Listing', 'Quick Commerce', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design'],
      socialMediaManagementRequirement: ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other'],
      brandingRequirement: ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'],
      ecommerceListingPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra'],
      quickCommercePlatforms: ['Zepto', 'Blinkit', 'Dunzo'],
      packages: ['Shuruvat', 'Unnati'],
      packageType: ['Silver', 'Gold', 'Platinum'],
      websiteDevelopmentTime: [30, 45, 60, 90],
      brandingTime: [30, 45, 60, 90],
      socialMediaTime: [30, 45, 60, 90],
    };
    return options[key] || [];
  };

  const renderField = (key, value, section) => {
    const isEditing = editingSection === section;
    const fieldType = getFieldType(key, value);

    return (
      <Grid item xs={12} sm={6} key={key}>
        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
        </Typography>
        {isEditing ? (
          fieldType === 'select' ? (
            <FormControl fullWidth>
              <InputLabel id={`${key}-label`}>{key}</InputLabel>
              <Select
                labelId={`${key}-label`}
                name={key}
                value={value || []}
                onChange={handleChange}
                multiple={Array.isArray(value)}
                renderValue={(selected) => selected.join(', ')}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                }}
              >
                {getOptionsForField(key).map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={value.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              name={key}
              value={value || ''}
              onChange={handleChange}
              fullWidth
              type={fieldType}
              sx={{
                input: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
          )
        ) : (
          <Typography sx={{ color: 'white' }}>
            {Array.isArray(value) ? value.join(', ') : (value?.toString() || 'N/A')}
          </Typography>
        )}
      </Grid>
    );
  };

  const renderSection = (title, data, section) => (
    <Box mb={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" sx={{ color: 'white' }}>{title}</Typography>
        {editingSection === section ? (
          <IconButton onClick={handleSave} sx={{ color: 'white' }}>
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleEdit(section)} sx={{ color: 'white' }}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => renderField(key, value, section))}
      </Grid>
    </Box>
  );

  const renderServiceOrPackageDetails = () => {
    if (leadData.packages && leadData.packages !== 'NA') {
      return renderSection('Package Details', {
        packages: leadData.packages,
        packageType: leadData.packageType,
        quotationFile: leadData.quotationFile ? leadData.quotationFile.name : 'No file uploaded',
      }, 'package');
    } else {
      return renderSection('Service Details', {
        servicesRequested: leadData.servicesRequested || [],
        socialMediaManagementRequirement: leadData.socialMediaManagementRequirement || [],
        websiteDevelopmentRequirement: leadData.websiteDevelopmentRequirement || '',
        brandingRequirement: leadData.brandingRequirement || [],
        ecommerceListingPlatforms: leadData.ecommerceListingPlatforms || [],
        quickCommercePlatforms: leadData.quickCommercePlatforms || [],
        quotationFile: leadData.quotationFile ? leadData.quotationFile.name : 'No file uploaded',
      }, 'service');
    }
  };

  const renderDeadlineInformation = () => {
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

    const getPackageDuration = () => {
      if (leadData.packages && leadData.packages !== 'NA' && leadData.packageType && packageDurations[leadData.packages]) {
        return packageDurations[leadData.packages][leadData.packageType] || null;
      }
      return null;
    };

    const packageDuration = getPackageDuration();

    const deadlineData = {
      tentativeDeadlineByCustomer: leadData.tentativeDeadlineByCustomer || 'Not set',
    };

    if (packageDuration) {
      deadlineData.packageDuration = `${packageDuration} days [after Onboarding]`;
      deadlineData.variations = `Up to ${leadData.packageType === 'Silver' ? '3' : leadData.packageType === 'Gold' ? '4' : '5'} Variations in Each`;
    } else {
      if (leadData.servicesRequested && leadData.servicesRequested.includes('Website Development')) {
        deadlineData.websiteDevelopmentTime = `${leadData.websiteDevelopmentTime || 'Not set'} days`;
      }
      if (leadData.servicesRequested && leadData.servicesRequested.includes('Branding')) {
        deadlineData.brandingTime = `${leadData.brandingTime || 'Not set'} days`;
      }
      if (leadData.servicesRequested && leadData.servicesRequested.includes('Social Media Management')) {
        deadlineData.socialMediaTime = `${leadData.socialMediaTime || 'Not set'} days`;
      }
    }

    return renderSection('Deadline Information', deadlineData, 'deadline');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>Review Your Information</Typography>
      
      {renderSection('Basic Information', {
        email: leadData.email || '',
        bdaName: leadData.bdaName || '',
        companyName: leadData.companyName || '',
        clientName: leadData.clientName || '',
        clientEmail: leadData.clientEmail || '',
        clientDesignation: leadData.clientDesignation || '',
        contactNumber: leadData.contactNumber || '',
        alternateContactNo: leadData.alternateContactNo || '',
        companyOffering: leadData.companyOffering || '',
        companyIndustry: leadData.companyIndustry || '',
      }, 'basic')}

      {renderServiceOrPackageDetails()}

      {renderSection('Payment Details', {
        totalServiceFeesCharged: leadData.totalServiceFeesCharged || '',
        gstBill: leadData.gstBill || '',
        amountWithoutGST: leadData.amountWithoutGST || '',
        paymentDate: leadData.paymentDate || '',
        paymentDone: leadData.paymentDone || '',
        proofOfApprovalForPartialPayment: leadData.proofOfApprovalForPartialPayment ? leadData.proofOfApprovalForPartialPayment.name : 'No file uploaded',
        actualAmountReceived: leadData.actualAmountReceived || '',
        pendingAmount: leadData.pendingAmount || '',
        pendingAmountDueDate: leadData.pendingAmountDueDate || '',
        paymentMode: leadData.paymentMode || '',
      }, 'payment')}

      {renderDeadlineInformation()}

      {renderSection('Final Details', {
        servicePromisedByBDA: leadData.servicePromisedByBDA || '',
        extraServiceRequested: leadData.extraServiceRequested || '',
        importantInformation: leadData.importantInformation || '',
      }, 'final')}
    </Box>
  );
};

export default ReviewForm;