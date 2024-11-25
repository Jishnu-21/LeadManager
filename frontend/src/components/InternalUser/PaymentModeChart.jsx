import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentModeChart = ({ data, title }) => {
  const paymentModes = data.reduce((acc, lead) => {
    acc[lead.paymentMode] = (acc[lead.paymentMode] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(paymentModes),
    datasets: [
      {
        label: 'Payment Modes',
        data: Object.values(paymentModes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default PaymentModeChart;