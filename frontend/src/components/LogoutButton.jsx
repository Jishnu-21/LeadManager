import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; 
import { toast } from 'sonner'; 

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    dispatch(logout()); 
    toast.success('Logout successful!'); // Show success toast
    navigate('/'); 
  };

  return (
    <Button
      variant="contained"
      color="error" // Change the color to red
      onClick={handleLogout}
      sx={{ mt: 2 }} // Margin top for spacing
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
