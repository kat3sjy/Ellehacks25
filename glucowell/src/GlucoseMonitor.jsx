import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      <h2>📊 AI Blood Sugar Analysis</h2>
      <button onClick={analyzeData}>Analyze Trends</button>
      <p>{trend}</p>
    </div>
  );
}
