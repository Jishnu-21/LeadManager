import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import axios from 'axios';
import { Button, TextField, Typography, Container, Paper, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users/login`, { email });
      const { accessToken, refreshToken, user } = response.data;

      dispatch(login({ user, accessToken, refreshToken }));
      toast.success('Login successful!');

      setLoading(false);

      switch (user.role) {
        case 'Operational':
          navigate('/operational/profile');
          break;
        case 'Management':
          navigate('/internal-user');
          break;
        case 'Sales':
          navigate('/');
          break;
        default:
          toast.error('Unknown user role');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      if (error.response) {
        console.error('Error response:', error.response);
        toast.error(error.response.data.message || 'Login failed. Please check your email.');
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('No response received from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        toast.error('Login failed. Please try again later.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
    }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'blue' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;