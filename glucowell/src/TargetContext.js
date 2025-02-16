import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

// Create the context with a default value
export const TargetContext = createContext({
  targets: [], // Default value for targets
});

// Create the provider component
export const TargetProvider = ({ children }) => {
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    console.log("useEffect Triggered"); // Debugging

    const fetchCSV = async () => {
      try {
        console.log("Fetching CSV file..."); // Debugging
        const response = await fetch('/data.csv'); // Path to the CSV file in the public folder

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const csvText = await response.text(); // Get the CSV content as text
        console.log("Fetched CSV Content:", csvText); // Log the raw CSV content

        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Parsed Data:", result.data); // Log the parsed data
            const sortedData = result.data
              .filter(row => row.Time && row.Target) // Ensure both Time and Target exist
              .sort((a, b) => {
                return new Date(`1970/01/01 ${a.Time}`) - new Date(`1970/01/01 ${b.Time}`);
              });

            console.log("Sorted Data:", sortedData); // Log the sorted data

            const targetValues = sortedData.map(row => row.Target); // Extract Target values
            console.log("Parsed Target Values:", targetValues); // Log the Target values

            setTargets(targetValues);
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
    <TargetContext.Provider value={{ targets }}>
      {children}
    </TargetContext.Provider>
  );
};