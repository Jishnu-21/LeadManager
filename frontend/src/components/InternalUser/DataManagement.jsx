import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LeadDetailsDialog from '../Sales/LeadDetailsDialog';
import EditLeadDialog from '../Sales/EditLeadDIalog';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'sonner';

const DataManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterLeads(term, packageFilter, companyFilter);
  };

  const handlePackageFilter = (event) => {
    const packageType = event.target.value;
    setPackageFilter(packageType);
    filterLeads(searchTerm, packageType, companyFilter);
  };

  const handleCompanyFilter = (event) => {
    const company = event.target.value;
    setCompanyFilter(company);
    filterLeads(searchTerm, packageFilter, company);
  };

  const filterLeads = (term, packageType, company) => {
    let filtered = leads.filter(lead => 
      (lead.companyName.toLowerCase().includes(term) ||
       lead.clientName.toLowerCase().includes(term) ||
       lead.clientEmail.toLowerCase().includes(term)) &&
      (packageType === '' || 
       (lead.packages !== 'NA' && lead.packageType === packageType) ||
       (lead.packages === 'NA' && lead.servicesRequested?.includes(packageType))) &&
      (company === '' || lead.companyName === company)
    );
    setFilteredLeads(filtered);
  };

  const handleDetailsClick = (lead) => {
    setSelectedLead(lead);
    setIsDetailsDialogOpen(true);
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedLead(null);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedLead(null);
  };

  const handleEditSave = async (updatedLead) => {
    try {
      await axios.put(`${API_URL}/leads/${updatedLead._id}`, updatedLead);
      toast.success('Lead updated successfully');
      fetchLeads();
      handleEditClose();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const renderValue = (value) => value || "NA";

  const uniquePackages = [
    ...new Set([
      ...leads.filter(lead => lead.packages !== 'NA').map(lead => lead.packageType),
      ...leads.filter(lead => lead.packages === 'NA').flatMap(lead => lead.servicesRequested || [])
    ].filter(Boolean))
  ];
  const uniqueCompanies = [...new Set(leads.map(lead => lead.companyName))];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Order Management</Typography>
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
            <InputLabel>Company</InputLabel>
            <Select
              value={companyFilter}
              onChange={handleCompanyFilter}
              label="Company"
            >
              <MenuItem value="">All</MenuItem>
              {uniqueCompanies.map(company => (
                <MenuItem key={company} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Package/Services</TableCell>
                <TableCell>Payment Done</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{renderValue(lead.clientName)}</TableCell>
                    <TableCell>{renderValue(lead.companyName)}</TableCell>
                    <TableCell>
                      {lead.packages === 'NA' 
                        ? renderValue(lead.servicesRequested?.join(', '))
                        : renderValue(`${lead.packages} - ${lead.packageType}`)}
                    </TableCell>
                    <TableCell>{renderValue(lead.paymentDone)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDetailsClick(lead)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(lead)} color="secondary">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredLeads.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <LeadDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleDetailsClose}
        lead={selectedLead}
      />

      <EditLeadDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        lead={selectedLead}
        onSave={handleEditSave}
      />
    </Container>
  );
};

export default DataManagement;