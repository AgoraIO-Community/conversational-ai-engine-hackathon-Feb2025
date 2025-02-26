"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DiagnosisGraph = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Diagnosis Probability",
        color: "white",
        font: {
          size: 16,
        },
        padding: {
          bottom: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          callback: function (value) {
            return value + "%";
          },
          padding: 8,
        },
        title: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
          maxRotation: 45,
          minRotation: 45,
          padding: 8,
          font: {
            size: 11,
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 15,
      },
    },
  };

  // Transform the data for bar chart
  const latestData = data[data.length - 1] || {};
  const chartData = {
    labels: Object.keys(latestData),
    datasets: [
      {
        data: Object.values(latestData).map((v) => v * 100),
        backgroundColor: Object.keys(latestData).map(
          (_, i) =>
            `hsl(${(i * 360) / Object.keys(latestData).length}, 70%, 50%)`
        ),
        borderColor: Object.keys(latestData).map(
          (_, i) =>
            `hsl(${(i * 360) / Object.keys(latestData).length}, 70%, 40%)`
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg" style={{ height: "250px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default DiagnosisGraph;
