import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
   const options = {
    plugins: {
      title: {
        display: true,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
   const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data:[100,30,50,60,70,80,40,] ,
        backgroundColor: '#00D26E',
        barThickness: 10,
      },
      {
        label: 'Dataset 2',
        data:[100,30,50,60,70,80,40,] ,
        backgroundColor: '#374151',
        barThickness: 10,
      },
      
    ],
  };
export default function Stackedbar() {
  return (
    <div className='gm'>
      <Bar options={options} data={data} /></div>
  )
}
