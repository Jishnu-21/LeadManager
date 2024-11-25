import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  Menu as MenuIcon, 
  LogOut,
  CreditCard,
  Bell as BellIcon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userSlice'; // Update with your actual path
import { toast } from 'sonner'; 
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ drawerOpen, setDrawerOpen, setActiveView, resetFilter, notificationCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    dispatch(logout()); 
    toast.success('Logout successful!'); // Show success toast
    navigate('/'); 
    console.log("User logged out");
  };

  // Function to handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
    setDrawerOpen(false);
    
    // If navigating to Dashboard, reset filters
    if (view === 'dashboard') {
      resetFilter(); // Reset filters when navigating to Dashboard
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 10, width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <ListItemText primary="Back-End Panel" />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Toolbar />
        <List>
          {['Dashboard', 'Payment Dashboard', 'Data Management', 'Notifications'].map((text, index) => (
            <ListItem button key={text} onClick={() => handleViewChange(text.toLowerCase().replace(' ', ''))}>
              <ListItemIcon>
                {index === 0 ? <LayoutDashboard /> : 
                 index === 1 ? <CreditCard /> : 
                 index === 2 ? <TableIcon /> :
                 <Badge badgeContent={notificationCount} color="secondary">
                   <BellIcon />
                 </Badge>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          {/* Logout Button */}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogOut />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;