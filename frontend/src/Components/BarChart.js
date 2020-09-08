import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const style = {
  width: '600px',
  margin: '20px auto',
  height: '400px',
};

const BarChart = () => {
  const [chartData, setChartData] = useState({});
  const chart = () => {
    setChartData({
      labels: ['Fortnite', 'Valorant', 'PUBG', 'Overwatch', 'FIFA 20', 'PUBG'],
      datasets: [
        {
          maxBarThickness: 40,
          minBarLength: 20,
          data: [70, 80, 75, 60, 20, 5],
          backgroundColor: '#2e86de',
          label: ['Votes'],
        },
      ],
    });
  };
  useEffect(() => {
    chart();
  }, []);

  return (
    <div style={style}>
      <Bar
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 100,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            animateScale: true,
          },
          title: {
            display: true,
            text: 'Your favorite games',
          },
        }}
        data={chartData}
      />
    </div>
  );
};

export default BarChart;
