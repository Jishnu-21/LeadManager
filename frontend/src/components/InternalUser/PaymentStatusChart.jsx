import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentStatusChart = ({ data, title }) => {
  const paymentStatus = data.reduce((acc, lead) => {
    acc[lead.paymentDone] = (acc[lead.paymentDone] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(paymentStatus),
    datasets: [
      {
        data: Object.values(paymentStatus),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h2>{title}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PaymentStatusChart;