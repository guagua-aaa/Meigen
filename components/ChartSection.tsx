import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DataEntry } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartSectionProps {
  data: DataEntry[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  // Chart needs data in ascending order (oldest to newest)
  const chartData = [...data].reverse();
  const labels = chartData.map(item => item.date.slice(5)); // "MM-DD"

  // Chart 1: Total Users (p_total)
  const totalUsersData = {
    labels,
    datasets: [
      {
        label: '总人数',
        data: chartData.map(item => item['p_total'] || 0),
        borderColor: '#dc2626', // red-600
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart 2: Active Users (user_active)
  const activeUsersData = {
    labels,
    datasets: [
      {
        label: '使用人数',
        data: chartData.map(item => item['user_active'] || 0),
        borderColor: '#0ea5e9', // sky-500
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Match original configuration
      },
    },
  };
  
  const optionsZeroStart = {
    ...options,
    scales: {
        y: {
            beginAtZero: true
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-[300px] relative">
        <div className="absolute top-3 left-4 text-sm font-bold text-slate-500">📉 平台总人数趋势 (Platform Users)</div>
        <div className="h-full pt-6">
          <Line data={totalUsersData} options={options} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-[300px] relative">
        <div className="absolute top-3 left-4 text-sm font-bold text-slate-500">🚀 核心使用人数趋势 (Active Users)</div>
        <div className="h-full pt-6">
          <Line data={activeUsersData} options={optionsZeroStart} />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;