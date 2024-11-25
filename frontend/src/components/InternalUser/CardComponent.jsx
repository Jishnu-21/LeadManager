import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const CompaniesCard = ({ companies }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Companies
        </Typography>
        <List dense>
          {companies.slice(0, 5).map((company, index) => (
            <ListItem key={index}>
              <ListItemText primary={company} />
            </ListItem>
          ))}
        </List>
        {companies.length > 5 && (
          <Typography variant="body2" color="text.secondary">
            And {companies.length - 5} more...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CompaniesCard;