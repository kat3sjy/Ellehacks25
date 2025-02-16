import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/analyze-glucose';
const GLUCOSE_DATA_ENDPOINT = process.env.REACT_APP_GLUCOSE_DATA_ENDPOINT || 'https://fakeapi.platzi.com/en/rest/pretend-data';

export default function GlucoseMonitor() {
  const [trend, setTrend] = useState("");
  const [bloodSugarData, setBloodSugarData] = useState([]);

  useEffect(() => {
    async function fetchGlucoseData() {
      try {
        const response = await fetch(GLUCOSE_DATA_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Failed to fetch glucose data: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array of glucose data
        setBloodSugarData(data);
      } catch (error) {
        console.error("Could not fetch glucose data", error);
        setTrend(`Error fetching glucose data: ${error.message}`);
      }
    }

    fetchGlucoseData();
  }, []);

  async function analyzeData() {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ glucose: bloodSugarData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setTrend(`AI Analysis: ${JSON.stringify(json)}`);
    } catch (error) {
      console.error("Could not get blood sugar analysis", error);
      setTrend(`Error: ${error.message}`);
    }
  }

  const chartData = {
    labels: bloodSugarData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Blood Sugar Level',
        data: bloodSugarData.map(item => item.value),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Sugar Levels Over Time',
      },
    },
  };

  return (
    <div>
      <h2>📊 AI Blood Sugar Analysis</h2>
      <button onClick={analyzeData}>Analyze Trends</button>
      <p>{trend}</p>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
