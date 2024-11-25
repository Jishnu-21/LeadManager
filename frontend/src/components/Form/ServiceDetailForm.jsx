import React, { useState, useEffect } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText,
  Button,
  Typography,
  Box,
} from '@mui/material';

const ServiceDetailsForm = ({ leadData, handleChange, handleFileChange, setLeadData, setErrors }) => {
  const [selectionType, setSelectionType] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [socialMediaRequirements, setSocialMediaRequirements] = useState([]);
  const [websiteDevelopmentRequirement, setWebsiteDevelopmentRequirement] = useState('');
  const [brandingRequirements, setBrandingRequirements] = useState([]);
  const [packageType, setPackageType] = useState('');
  const [ecommerceListingPlatforms, setEcommerceListingPlatforms] = useState([]);
  const [quickCommercePlatforms, setQuickCommercePlatforms] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const services = ['Website Development', 'Social Media Management', 'Branding', 'Ecommerce Listing', 'Quick Commerce'];
  const packages = ['Shuruvat', 'Unnati',];
  const packageTypes = ['Silver', 'Gold', 'Platinum'];
  const socialMediaPlatforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'YouTube'];
  const brandingServices = ['Logo Design', 'Business Card Design', 'Brochure Design', 'Packaging Design'];
  const ecommercePlatforms = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Ajio'];
  const quickCommercePlatformOptions = ['Swiggy Instamart', 'Blinkit', 'Zepto', 'Big Basket'];

  useEffect(() => {
    if (selectionType === 'services') {
      setLeadData(prevData => ({
        ...prevData,
        packages: 'NA',
        packageType: 'NA',
        servicesRequested: [],
        socialMediaManagementRequirement: [],
        websiteDevelopmentRequirement: '',
        brandingRequirement: [],
        ecommerceListingPlatforms: [],
        quickCommercePlatforms: [],
      }));
    } else {
      setLeadData(prevData => ({
        ...prevData,
        packages: '',
        packageType: '',
        servicesRequested: [],
        socialMediaManagementRequirement: [],
        websiteDevelopmentRequirement: '',
        brandingRequirement: [],
        ecommerceListingPlatforms: [],
        quickCommercePlatforms: [],
      }));
    }
    setSelectedServices([]);
    setSocialMediaRequirements([]);
    setWebsiteDevelopmentRequirement('');
    setBrandingRequirements([]);
    setPackageType('');
    setEcommerceListingPlatforms([]);
    setQuickCommercePlatforms([]);
    setFormErrors({});
  }, [selectionType]);

  const handleSelectionTypeChange = (event) => {
    const newSelectionType = event.target.value;
    setSelectionType(newSelectionType);
    if (newSelectionType === 'services') {
      setLeadData(prevData => ({
        ...prevData,
        packages: 'NA',
        packageType: 'NA',
      }));
    }
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setSelectedServices(value);
    setLeadData(prevData => ({
      ...prevData,
      servicesRequested: value,
    }));
  };

  const handleSocialMediaChange = (event) => {
    const { value } = event.target;
    setSocialMediaRequirements(value);
    setLeadData(prevData => ({
      ...prevData,
      socialMediaManagementRequirement: value,
    }));
  };

  const handlePackageChange = (event) => {
    const { name, value } = event.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value,
      packageType: '',
    }));
    setPackageType('');
  };

  const handlePackageTypeChange = (event) => {
    const { value } = event.target;
    setPackageType(value);
    setLeadData(prevData => ({
      ...prevData,
      packageType: value,
    }));
  };

  const handleEcommerceListingChange = (event) => {
    const { value } = event.target;
    setEcommerceListingPlatforms(value);
    setLeadData(prevData => ({
      ...prevData,
      ecommerceListingPlatforms: value,
    }));
  };

  const handleQuickCommerceChange = (event) => {
    const { value } = event.target;
    setQuickCommercePlatforms(value);
    setLeadData(prevData => ({
      ...prevData,
      quickCommercePlatforms: value,
    }));
  };

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

  const menuProps = {
    PaperProps: {
      style: {
        backgroundColor: '#1e1e1e',
      },
    },
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.selectionType}>
          <InputLabel id="selection-type-label">Select Type</InputLabel>
          <Select
            labelId="selection-type-label"
            value={selectionType}
            onChange={handleSelectionTypeChange}
            label="Select Type"
            input={<OutlinedInput label="Select Type" />}
            MenuProps={menuProps}
          >
            <MenuItem value="packages" style={{ color: 'white' }}>Packages</MenuItem>
            <MenuItem value="services" style={{ color: 'white' }}>Services</MenuItem>
          </Select>
          {formErrors.selectionType && <FormHelperText>{formErrors.selectionType}</FormHelperText>}
        </FormControl>
      </Grid>

      {selectionType === 'packages' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.packages}>
              <InputLabel id="package-label">Select Package</InputLabel>
              <Select
                labelId="package-label"
                name="packages"
                value={leadData.packages || ''}
                onChange={handlePackageChange}
                input={<OutlinedInput label="Select Package" />}
                MenuProps={menuProps}
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg} value={pkg} style={{ color: 'white' }}>{pkg}</MenuItem>
                ))}
              </Select>
              {formErrors.packages && <FormHelperText>{formErrors.packages}</FormHelperText>}
            </FormControl>
          </Grid>

          {(leadData.packages === 'Shuruvat' || leadData.packages === 'Unnati') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.packageType}>
                <InputLabel id="package-type-label">Package Type</InputLabel>
                <Select
                  labelId="package-type-label"
                  name="packageType"
                  value={packageType}
                  onChange={handlePackageTypeChange}
                  input={<OutlinedInput label="Package Type" />}
                  MenuProps={menuProps}
                >
                  {packageTypes.map((type) => (
                    <MenuItem key={type} value={type} style={{ color: 'white' }}>{type}</MenuItem>
                  ))}
                </Select>
                {formErrors.packageType && <FormHelperText>{formErrors.packageType}</FormHelperText>}
              </FormControl>
            </Grid>
          )}
        </>
      )}

      {selectionType === 'services' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.servicesRequested}>
              <InputLabel id="services-label">Services Requested</InputLabel>
              <Select
                labelId="services-label"
                multiple
                name="servicesRequested"
                value={selectedServices}
                onChange={handleServiceChange}
                input={<OutlinedInput label="Services Requested" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={menuProps}
              >
                {services.map((service) => (
                  <MenuItem key={service} value={service} style={{ color: 'white' }}>
                    <Checkbox checked={selectedServices.indexOf(service) > -1} />
                    <ListItemText primary={service} />
                  </MenuItem>
                ))}
              </Select>
              {formErrors.servicesRequested && <FormHelperText>{formErrors.servicesRequested}</FormHelperText>}
            </FormControl>
          </Grid>

          {selectedServices.includes('Social Media Management') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.socialMediaManagementRequirement}>
                <InputLabel id="social-media-label">Social Media Platforms</InputLabel>
                <Select
                  labelId="social-media-label"
                  multiple
                  name="socialMediaManagementRequirement"
                  value={socialMediaRequirements}
                  onChange={handleSocialMediaChange}
                  input={<OutlinedInput label="Social Media Platforms" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {socialMediaPlatforms.map((platform) => (
                    <MenuItem key={platform} value={platform} style={{ color: 'white' }}>
                      <Checkbox checked={socialMediaRequirements.indexOf(platform) > -1} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.socialMediaManagementRequirement && <FormHelperText>{formErrors.socialMediaManagementRequirement}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Website Development') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.websiteDevelopmentRequirement}>
                <InputLabel id="website-development-label">Website Development Requirement</InputLabel>
                <Select
                  labelId="website-development-label"
                  name="websiteDevelopmentRequirement"
                  value={websiteDevelopmentRequirement}
                  onChange={(e) => {
                    setWebsiteDevelopmentRequirement(e.target.value);
                    setLeadData(prevData => ({
                      ...prevData,
                      websiteDevelopmentRequirement: e.target.value,
                    }));
                  }}
                  input={<OutlinedInput label="Website Development Requirement" />}
                  MenuProps={menuProps}
                >
                  <MenuItem value="React" style={{ color: 'white' }}>React</MenuItem>
                  <MenuItem value="Wordpress" style={{ color: 'white' }}>Wordpress</MenuItem>
                  <MenuItem value="Other" style={{ color: 'white' }}>Other</MenuItem>
                </Select>
                {formErrors.websiteDevelopmentRequirement && <FormHelperText>{formErrors.websiteDevelopmentRequirement}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Branding') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.brandingRequirement}>
                <InputLabel id="branding-label">Branding Services</InputLabel>
                <Select
                  labelId="branding-label"
                  multiple
                  name="brandingRequirement"
                  value={brandingRequirements}
                  onChange={(e) => {
                    setBrandingRequirements(e.target.value);
                    setLeadData(prevData => ({
                      ...prevData,
                      brandingRequirement: e.target.value,
                    }));
                  }}
                  input={<OutlinedInput label="Branding Services" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {brandingServices.map((service) => (
                    <MenuItem key={service} value={service} style={{ color: 'white' }}>
                      <Checkbox checked={brandingRequirements.indexOf(service) > -1} />
                      <ListItemText primary={service} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.brandingRequirement && <FormHelperText>{formErrors.brandingRequirement}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Ecommerce Listing') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.ecommerceListingPlatforms}>
                <InputLabel id="ecommerce-listing-label">Ecommerce Listing Platforms</InputLabel>
                <Select
                  labelId="ecommerce-listing-label"
                  multiple
                  name="ecommerceListingPlatforms"
                  value={ecommerceListingPlatforms}
                  onChange={handleEcommerceListingChange}
                  input={<OutlinedInput label="Ecommerce Listing Platforms" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {ecommercePlatforms.map((platform) => (
                    <MenuItem key={platform} value={platform} style={{ color: 'white' }}>
                      <Checkbox checked={ecommerceListingPlatforms.indexOf(platform) > -1} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.ecommerceListingPlatforms && <FormHelperText>{formErrors.ecommerceListingPlatforms}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Quick Commerce') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx} error={!!formErrors.quickCommercePlatforms}>
                <InputLabel id="quick-commerce-label">Quick Commerce Platforms</InputLabel>
                <Select
                  labelId="quick-commerce-label"
                  multiple
                  name="quickCommercePlatforms"
                  value={quickCommercePlatforms}
                  onChange={handleQuickCommerceChange}
                  input={<OutlinedInput label="Quick Commerce Platforms" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {quickCommercePlatformOptions.map((platform) => (
                    <MenuItem key={platform} value={platform} style={{ color: 'white' }}>
                      <Checkbox checked={quickCommercePlatforms.indexOf(platform) > -1} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.quickCommercePlatforms && <FormHelperText>{formErrors.quickCommercePlatforms}</FormHelperText>}
              </FormControl>
            </Grid>
          )}
        </>
      )}

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <input
            accept="application/pdf"
            style={{ display: 'none' }}
            id="quotation-file"
            type="file"
            onChange={(e) => handleFileChange(e, 'quotationFile')}
          />
          <label htmlFor="quotation-file">
            <Button 
              variant="contained" 
              component="span" 
              fullWidth
              sx={{
                backgroundColor: leadData.quotationFile ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  backgroundColor: leadData.quotationFile ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {leadData.quotationFile ? 'Quotation File Added' : 'Upload Quotation File'}
            </Button>
          </label>
          {leadData.quotationFile && (
            <Typography variant="body2" sx={{ color: 'white', marginTop: '8px' }}>
              File selected: {leadData.quotationFile.name}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ServiceDetailsForm;