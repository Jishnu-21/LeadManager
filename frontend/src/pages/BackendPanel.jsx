import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Badge, IconButton, Snackbar, Alert, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Pusher from 'pusher-js';
import Sidebar from '../components/InternalUser/Sidebar';
import Dashboard from '../components/InternalUser/Dashboard';
import PaymentDashboard from '../components/InternalUser/PaymentDashboard';
import DataManagement from '../components/InternalUser/DataManagement';
import Notifications from '../components/InternalUser/Notifications.jsx';
import { API_URL } from '../config';
import { toast } from 'sonner';

const BackendPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState({
    channelPartnerCode: '',
    leadSource: '',
    leadInterest: '',
    timeframe: ''
  });
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channelPartners, setChannelPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [paymentAlerts, setPaymentAlerts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [partnerStats, setPartnerStats] = useState({
    incentive: 0,
    revenueWithGST: 0,
    revenueWithoutGST: 0
  });

  useEffect(() => {
    const pusher = new Pusher('818ffa62d3c676b1072b', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('payment-alerts');
    channel.bind('payment-due-soon', data => {
      setPaymentAlerts(prevAlerts => [...prevAlerts, data]);
      setCurrentAlert(data);
      setShowAlert(true);
    });

    return () => {
      pusher.unsubscribe('payment-alerts');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [leadsResponse, notificationsResponse] = await Promise.all([
          fetch(`${API_URL}/leads`).catch(() => ({ ok: false })),
          fetch(`${API_URL}/notifications`).catch(() => ({ ok: false }))
        ]);
        
        if (!leadsResponse.ok) throw new Error('Failed to fetch leads');
        if (!notificationsResponse.ok) throw new Error('Failed to fetch notifications');

        const leadsData = await leadsResponse.json();
        const notificationsData = await notificationsResponse.json();

        setLeads(leadsData);
        setFilteredLeads(leadsData);
        setNotifications(notificationsData);
        setNotificationCount(notificationsData.filter(n => !n.read).length);

        // Extract unique channel partner codes from leads
        const uniquePartners = [...new Set(leadsData.map(lead => lead.channelPartnerCode))];
        setChannelPartners(uniquePartners.map(code => ({ channelPartnerCode: code })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const applyFilters = (customFilter = filter) => {
    if (!Array.isArray(leads)) {
      console.error('Leads is not an array:', leads);
      return;
    }

    const filtered = leads.filter(lead => {
      const date = new Date(lead.date);
      const currentDate = new Date();
      
      const timeframeCondition = customFilter.timeframe ? 
        (customFilter.timeframe === 'daily' ? date.toDateString() === currentDate.toDateString() :
        customFilter.timeframe === 'weekly' ? 
          (currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7 :
        customFilter.timeframe === 'monthly' ? date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear() : true) 
      : true;

      return (
        (customFilter.channelPartnerCode === '' || lead.channelPartnerCode === customFilter.channelPartnerCode) &&
        (customFilter.leadSource === '' || lead.leadSource === customFilter.leadSource) &&
        (customFilter.leadInterest === '' || lead.leadInterest === customFilter.leadInterest) &&
        timeframeCondition
      );
    });
    setFilteredLeads(filtered);
  };

  const resetFilter = () => {
    setFilter({
      channelPartnerCode: '',
      leadSource: '',
      leadInterest: '',
      timeframe: ''
    });
    setFilteredLeads(leads);
    setSelectedPartners([]); 
  };

  const handlePartnerChange = (event) => {
    const value = event.target.value;
    setSelectedPartners(value === "" ? [] : value);

    // Calculate stats for the selected partner
    if (value !== "") {
      const partnerLeads = leads.filter(lead => lead.channelPartnerCode === value);
      const totalRevenue = partnerLeads.reduce((sum, lead) => sum + lead.totalServiceFeesCharged, 0);
      const revenueWithoutGST = totalRevenue / 1.18; // Assuming 18% GST
      const incentive = revenueWithoutGST * 0.1; // Assuming 10% incentive

      setPartnerStats({
        incentive: incentive.toFixed(2),
        revenueWithGST: totalRevenue.toFixed(2),
        revenueWithoutGST: revenueWithoutGST.toFixed(2)
      });
    } else {
      setPartnerStats({
        incentive: 0,
        revenueWithGST: 0,
        revenueWithoutGST: 0
      });
    }
  };

  const selectedLeads = selectedPartners.length > 0
    ? filteredLeads.filter(lead => selectedPartners.includes(lead.channelPartnerCode))
    : filteredLeads;

  const uniquePartners = channelPartners.map(partner => partner.channelPartnerCode);

  useEffect(() => {
    if (leads.length > 0) {
      applyFilters();
    }
  }, [filter, leads]);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setActiveView={setActiveView} 
        resetFilter={resetFilter}
        notificationCount={notificationCount + paymentAlerts.length}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeView === 'dashboard' && (
          <Dashboard 
            selectedLeads={selectedLeads} 
            uniquePartners={uniquePartners} 
            selectedPartners={selectedPartners} 
            handlePartnerChange={handlePartnerChange} 
            filter={filter}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            filteredLeads={filteredLeads}
            partnerStats={partnerStats}
          />
        )}
        {activeView === 'paymentdashboard' && (
          <PaymentDashboard 
            selectedLeads={selectedLeads}
            uniquePartners={uniquePartners}
          />
        )}
        {activeView === 'datamanagement' && (
          <DataManagement 
            leads={leads}
            filteredLeads={filteredLeads}
            setFilteredLeads={setFilteredLeads}
            filter={filter}
            setFilter={setFilter}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilter={resetFilter}
          />
        )}
        {activeView === 'notifications' && (
          <Notifications 
            notifications={[...notifications, ...paymentAlerts]}
            setNotifications={setNotifications}
            setNotificationCount={setNotificationCount}
          />
        )}
        <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%' }}>
            {currentAlert?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default BackendPanel;