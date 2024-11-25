import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Button, Chip } from '@mui/material';
import { toast } from 'sonner';
import { API_URL } from '../../config';

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setNotificationCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications. Please try again.');
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === id ? { ...n, read: true } : n
        )
      );
      setNotificationCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification._id} divider>
            <ListItemText
              primary={
                <>
                  {notification.message}
                  {notification.type === 'payment_due' && (
                    <Chip 
                      label="Payment Due" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </>
              }
              secondary={
                <>
                  {new Date(notification.createdAt).toLocaleString()}
                  {notification.dueDate && (
                    <Typography component="span" sx={{ display: 'block' }}>
                      Due Date: {new Date(notification.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                </>
              }
            />
            {!notification.read && (
              <Button onClick={() => markAsRead(notification._id)}>
                Mark as Read
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Notifications;