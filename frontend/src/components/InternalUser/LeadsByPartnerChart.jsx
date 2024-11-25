import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeadsByPartnerChart = ({ data, title, selectedPartner, uniquePartners }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const partnersToShow = useMemo(() => 
    selectedPartner ? [selectedPartner] : uniquePartners,
    [selectedPartner, uniquePartners]
  );

  const completeData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(entry => {
      const newEntry = { date: entry.date };
      partnersToShow.forEach(partner => {
        newEntry[partner] = entry[partner] || 0;
      });
      return newEntry;
    });
  }, [data, partnersToShow]);

  if (completeData.length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '0 0 auto' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      </CardContent>
      <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={completeData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              tick={{ fontSize: 10 }}
              interval={'preserveStartEnd'}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
              }}
              formatter={(value, name) => [value, `Partner: ${name}`]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {partnersToShow.map((partner, index) => (
              <Line
                key={partner}
                type="monotone"
                dataKey={partner}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 6 }}
                connectNulls={true}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default LeadsByPartnerChart;