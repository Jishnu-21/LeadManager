import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  TextField, 
  CircularProgress, 
  Chip,
  Tooltip,
  Paper
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatsCard from './StatsCard';
import PartnerSelector from './PartnerSelector';
import LeadsByPartnerChart from './LeadsByPartnerChart';
import OrdersByIndustryChart from './OrdersByIndustryChart';
import ServiceDistributionChart from './ServiceDistributionChart';
import PackageDistributionChart from './PackageDistributionChart';
import { downloadCSV } from './utils';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../../config';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [uniquePartners, setUniquePartners] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    console.log('API_URL:', API_URL);
    fetchLeads().catch(error => {
      console.error('Error in useEffect:', error);
      toast.error('Failed to load dashboard data.');
    });
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching leads from:', `${API_URL}/leads/`);
      const response = await axios.get(`${API_URL}/leads/`);
      console.log('API Response:', response);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response data structure');
      }

      const leads = response.data;
      if (leads.length === 0) {
        toast.warning('No Orders found.');
        setSelectedLeads([]);
        setUniquePartners([]);
        setCompanies([]);
      } else {
        setSelectedLeads(leads);
        const partners = [...new Set(leads.map(lead => lead.bdaName).filter(Boolean))];
        setUniquePartners(partners);
        const uniqueCompanies = [...new Set(leads.map(lead => lead.companyName).filter(Boolean))];
        setCompanies(uniqueCompanies);
        processData(leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        toast.error(`Failed to fetch leads: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.log('Error request:', error.request);
        toast.error('Network error. Please check your connection and API_URL configuration.');
      } else {
        console.log('Error message:', error.message);
        toast.error(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (leads) => {
    const filteredLeads = filterLeadsByDateRangeAndPartner(leads);
    const processedChannelData = processDataByKey(filteredLeads, 'bdaName');
    setChannelPartnerData(processedChannelData);
  };

  const processDataByKey = (data, key) => {
    const counts = {};
    data.forEach((lead) => {
      const date = new Date(lead.createdAt);
      if (!isNaN(date.getTime())) {
        const dateKey = date.toISOString().split('T')[0]; // Use YYYY-MM-DD format
        const partnerKey = lead[key];
        if (!counts[dateKey]) counts[dateKey] = {};
        counts[dateKey][partnerKey] = (counts[dateKey][partnerKey] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filterLeadsByDateRangeAndPartner = (leads, partner = selectedPartner) => {
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (startDate && leadDate < startDate) return false;
      if (endDate && leadDate > endDate) return false;
      if (partner && lead.bdaName !== partner) return false;
      return true;
    });
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      toast.error("End date cannot be less than start date.");
    } else {
      setEndDate(date);
      processData(selectedLeads);
    }
  };

  const handlePartnerChange = (event) => {
    const newSelectedPartner = event.target.value;
    setSelectedPartner(newSelectedPartner);
    const filteredLeads = filterLeadsByDateRangeAndPartner(selectedLeads, newSelectedPartner);
    const processedChannelData = processDataByKey(filteredLeads, 'bdaName');
    setChannelPartnerData(processedChannelData);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    processData(selectedLeads);
  };

  const getTotalLeads = (leads) => leads.length;
  const getShuruvat = (leads) => leads.filter(lead => lead.packages === 'Shuruvat').length;
  const getUnnati = (leads) => leads.filter(lead => lead.packages === 'Unnati').length;
  const getServices = (leads) => leads.filter(lead => 
    lead.packages === 'NA' && lead.servicesRequested && lead.servicesRequested.length > 0
  ).length;

  const getPackageCompanies = (packageType, leads) => {
    return leads
      .filter(lead => lead.packages === packageType)
      .map(lead => lead.companyName)
      .filter(Boolean);
  };

  const getServicesCompanies = (leads) => {
    return leads
      .filter(lead => 
        lead.packages === 'NA' && lead.servicesRequested && lead.servicesRequested.length > 0
      )
      .map(lead => lead.companyName)
      .filter(Boolean);
  };

  const getServiceDistribution = (leads) => {
    const distribution = {};
    const companyNames = {};
    leads.forEach(lead => {
      if (lead.packages === 'NA' && lead.servicesRequested) {
        lead.servicesRequested.forEach(service => {
          distribution[service] = (distribution[service] || 0) + 1;
          if (!companyNames[service]) companyNames[service] = new Set();
          companyNames[service].add(lead.companyName);
        });
      }
    });
    return { 
      distribution, 
      companyNames: Object.fromEntries(Object.entries(companyNames).map(([k, v]) => [k, Array.from(v)]))
    };
  };

  const getPackageDistribution = (leads) => {
    const distribution = {
      Shuruvat: getShuruvat(leads),
      Unnati: getUnnati(leads),
      Services: getServices(leads)
    };
    const companyNames = {
      Shuruvat: getPackageCompanies('Shuruvat', leads),
      Unnati: getPackageCompanies('Unnati', leads),
      Services: getServicesCompanies(leads)
    };
    return { distribution, companyNames };
  };
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (selectedLeads.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="body1">No Orders found. Please add some leads to view the dashboard.</Typography>
      </Container>
    );
  }

  const filteredLeads = filterLeadsByDateRangeAndPartner(selectedLeads);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <PartnerSelector 
              uniquePartners={uniquePartners} 
              selectedPartner={selectedPartner} 
              handlePartnerChange={handlePartnerChange} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              customInput={<TextField fullWidth label="Start Date" />}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select Start Date"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              customInput={<TextField fullWidth label="End Date" />}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select End Date"
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Orders" value={getTotalLeads(filteredLeads)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title={getPackageCompanies('Shuruvat', filteredLeads).join(', ')} arrow>
            <div>
              <StatsCard title="Shuruvat Packages" value={getShuruvat(filteredLeads)} />
            </div>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title={getPackageCompanies('Unnati', filteredLeads).join(', ')} arrow>
            <div>
              <StatsCard title="Unnati Packages" value={getUnnati(filteredLeads)} />
            </div>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title={getServicesCompanies(filteredLeads).join(', ')} arrow>
            <div>
              <StatsCard title="Services" value={getServices(filteredLeads)} />
            </div>
          </Tooltip>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Companies</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {companies.map((company, index) => (
            <Chip key={index} label={company} size="small" />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <LeadsByPartnerChart 
              data={channelPartnerData} 
              title="Orders by BDA" 
              selectedPartner={selectedPartner}
              uniquePartners={uniquePartners}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <PackageDistributionChart 
              data={getPackageDistribution(filteredLeads).distribution} 
              companyNames={getPackageDistribution(filteredLeads).companyNames}
              title="Package Distribution" 
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '350px' }}>
            <OrdersByIndustryChart data={filteredLeads} title="Orders by Industry" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '350px' }}>
            <ServiceDistributionChart 
              data={getServiceDistribution(filteredLeads).distribution} 
              companyNames={getServiceDistribution(filteredLeads).companyNames}
              title="Service Distribution" 
            />
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3} textAlign="right">
        <Button variant="contained" color="primary" size="small" onClick={() => downloadCSV(channelPartnerData)}>
          Download CSV
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;