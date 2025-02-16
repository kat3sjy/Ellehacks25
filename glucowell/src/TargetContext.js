import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const TargetContext = createContext({
  glucoseData: [], // Default value for glucose data
});

export const TargetProvider = ({ children }) => {
  const [glucoseData, setGlucoseData] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('/data.csv'); // Path to the CSV file in the public folder
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const csvText = await response.text(); // Get the CSV content as text

        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Parsed Data:", result.data); // Log the parsed data

            // Filter out rows with missing or invalid Target values
            const validData = result.data.filter(row => row.Target && !isNaN(Number(row.Target.trim())));

            // Group data by time and calculate the average glucose level
            const groupedData = validData.reduce((acc, row) => {
              const time = row.Time;
              const glucoseLevel = Number(row.Target.trim());

              if (!acc[time]) {
                acc[time] = { sum: 0, count: 0 };
              }
              acc[time].sum += glucoseLevel;
              acc[time].count += 1;

              return acc;
            }, {});

            // Convert grouped data into an array of { time, average } objects
            const processedData = Object.keys(groupedData)
              .map(time => ({
                time,
                average: groupedData[time].sum / groupedData[time].count,
              }))
              .sort((a, b) => {
                return new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`);
              });

            console.log("Processed Glucose Data:", processedData); // Log the processed data
            setGlucoseData(processedData);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV file:', error);
      }
    };

    fetchCSV();
  }, []);

  return (
    <TargetContext.Provider value={{ glucoseData }}>
      {children}
    </TargetContext.Provider>
  );
};