import React, { useState } from 'react';
import LeadForm from '../components/Form/LeadForm';
// import LogoutButton from '../components/LogoutButton'; // Removed unused import
import { useTheme, useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const backgroundStyle = {
    backgroundImage: 'url("sl_0210121_40570_43.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={backgroundStyle}>
      <LeadForm />
      {isMobile ? (
        <div style={buttonStyle}>
          <IconButton onClick={handleClick} color="primary">
            <LogoutIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              {/* Logout functionality can be added here */}
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div style={buttonStyle}>
          <IconButton onClick={handleClose} color="primary">
            <LogoutIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Homepage;