import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  TableHead,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Container,
  Chip,
  Tabs,
  Tab,
  TablePagination,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../config';
import LeadDetailsDialog from '../components/Sales/LeadDetailsDialog';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';

const OperationalProfilePage = () => {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [packageFilter, setPackageFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    setUser(userFromStorage);
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterLeads(term, packageFilter, serviceFilter);
    setPage(0);
  };

  const handlePackageFilter = (event) => {
    const packageType = event.target.value;
    setPackageFilter(packageType);
    filterLeads(searchTerm, packageType, serviceFilter);
    setPage(0);
  };

  const handleServiceFilter = (event) => {
    const service = event.target.value;
    setServiceFilter(service);
    filterLeads(searchTerm, packageFilter, service);
    setPage(0);
  };

  const filterLeads = (term, packageType, service) => {
    const filtered = leads.filter(lead => 
      (lead.companyName.toLowerCase().includes(term) ||
       lead.clientName.toLowerCase().includes(term) ||
       lead.clientEmail.toLowerCase().includes(term)) &&
      (packageType === '' || (lead.packages !== 'NA' && lead.packageType === packageType)) &&
      (service === '' || (lead.packages === 'NA' && lead.servicesRequested && lead.servicesRequested.includes(service)))
    );
    setFilteredLeads(filtered);
  };

  const handleDetailsClick = (lead) => {
    setSelectedLead(lead);
    setIsDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedLead(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getPackageDuration = (packageName, packageType) => {
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
    return packageDurations[packageName]?.[packageType] || "NA";
  };

  const renderValue = (value) => value || "NA";

  const renderChips = (items) => {
    if (!items || items.length === 0) return "NA";
    return items.map((item) => (
      <Chip key={item} label={item} size="small" sx={{ m: 0.5 }} />
    ));
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const packageLeads = filteredLeads.filter(lead => lead.packages && lead.packages !== 'NA');
  const serviceLeads = filteredLeads.filter(lead => !lead.packages || lead.packages === 'NA');

  const uniquePackages = [...new Set(leads.filter(lead => lead.packages !== 'NA').map(lead => lead.packageType).filter(Boolean))];
  const uniqueServices = [...new Set(leads.filter(lead => lead.packages === 'NA').flatMap(lead => lead.servicesRequested || []))];

  const currentLeads = tabValue === 0 ? packageLeads : serviceLeads;
  const paginatedLeads = currentLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Operational Profile: {user.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Search leads"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon color="action" />,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Package Type</InputLabel>
              <Select
                value={packageFilter}
                onChange={handlePackageFilter}
                label="Package Type"
              >
                <MenuItem value="">All</MenuItem>
                {uniquePackages.map(pkg => (
                  <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Service</InputLabel>
              <Select
                value={serviceFilter}
                onChange={handleServiceFilter}
                label="Service"
              >
                <MenuItem value="">All</MenuItem>
                {uniqueServices.map(service => (
                  <MenuItem key={service} value={service}>{service}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ overflow: 'auto' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Package " />
            <Tab label="Service " />
          </Tabs>
          {tabValue === 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Package Details</TableCell>
                  <TableCell>Service Start Date</TableCell>
                  <TableCell>Package Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{renderValue(lead.clientName)}</TableCell>
                    <TableCell>{renderValue(lead.companyName)}</TableCell>
                    <TableCell>{renderValue(`${lead.packages} - ${lead.packageType}`)}</TableCell>
                    <TableCell>{lead.tentativeDeadlineByCustomer ? new Date(lead.tentativeDeadlineByCustomer).toLocaleDateString() : "NA"}</TableCell>
                    <TableCell>{lead.packages && lead.packageType ? `${getPackageDuration(lead.packages, lead.packageType)} days` : "NA"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDetailsClick(lead)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {tabValue === 1 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Service Start Date</TableCell>
                  <TableCell>Social Media</TableCell>
                  <TableCell>Website Development</TableCell>
                  <TableCell>Branding</TableCell>
                  <TableCell>Ecommerce Listing</TableCell>
                  <TableCell>Quick Commerce</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{renderValue(lead.clientName)}</TableCell>
                    <TableCell>{renderValue(lead.companyName)}</TableCell>
                    <TableCell>{renderValue(lead.servicesRequested?.join(', '))}</TableCell>
                    <TableCell>{lead.tentativeDeadlineByCustomer ? new Date(lead.tentativeDeadlineByCustomer).toLocaleDateString() : "NA"}</TableCell>
                    <TableCell>
                      {lead.socialMediaManagementRequirement ? (
                        <Box>
                          {renderChips(lead.socialMediaManagementRequirement)}
                          <Typography variant="body2">
                            Time: {renderValue(lead.socialMediaTime)} days
                          </Typography>
                        </Box>
                      ) : "NA"}
                    </TableCell>
                    <TableCell>
                      {lead.websiteDevelopmentRequirement ? (
                        <Box>
                          <Typography variant="body2">
                            {renderValue(lead.websiteDevelopmentRequirement)}
                          </Typography>
                          <Typography variant="body2">
                            Time: {renderValue(lead.websiteDevelopmentTime)} days
                          </Typography>
                        </Box>
                      ) : "NA"}
                    </TableCell>
                    <TableCell>
                      {lead.brandingRequirement ? (
                        <Box>
                          {renderChips(lead.brandingRequirement)}
                          <Typography variant="body2">
                            Time: {renderValue(lead.brandingTime)} days
                          </Typography>
                        </Box>
                      ) : "NA"}
                    </TableCell>
                    <TableCell>
                      {renderChips(lead.ecommerceListingPlatforms)}
                    </TableCell>
                    <TableCell>
                      {renderChips(lead.quickCommercePlatforms)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDetailsClick(lead)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <TablePagination
            component="div"
            count={currentLeads.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      </Container>

      <LeadDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleDetailsClose}
        lead={selectedLead}
      />
    </Box>
  );
};

export default OperationalProfilePage;