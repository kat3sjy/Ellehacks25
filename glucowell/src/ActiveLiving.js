
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

const ActiveLivingComponent = () => {
  // State variables to store user inputs
  const [exerciseData, setExerciseData] = useState("");
  const [frequencyData, setFrequencyData] = useState("");
  const [ageData, setAgeData] = useState("");
  const [glucoseData, setGlucoseData] = useState("");
  const [responseText, setResponseText] = useState("");

  // Function to handle form submission
  const generateActiveRoutine = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    try {
      // Parse glucose data from string to array
      const parsedGlucoseData = glucoseData
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => !isNaN(value)); // Filter out invalid numbers

      if (parsedGlucoseData.length === 0) {
        throw new Error("Invalid glucose data. Please enter numeric values.");
      }

      // Construct the prompt for the AI model
      const prompt = `
        The user has the following age: ${ageData}.
        Based on the following glucose levels: ${parsedGlucoseData.join(", ")} 
        and that the user does the following exercise: ${exerciseData}, 
        for this amount of frequency: ${frequencyData},
        provide some recommendations and feedback on their active routine to optimize their healthy active living.
        Do not give suggestions for their diet, or any other aspects of a healthy lifestyle. Only give suggestions on 
        their frequency of exercise, type of exercise, and alternative excercises they could implement in their 
        lifestyle. Limit your response to 5 sentences.
      `;

      // Call the AI model to generate content
      const result = await model.generateContent(prompt);
      console.log(result.response.text())

      // Store the raw response text in state
      setResponseText(result.response.text());
    } catch (error) {
      console.error("Error generating active living recommendations:", error);
      setResponseText(`An error occurred: ${error.message}`);
    }
  };

  // // Parse the AI response into an array of meal objects
  // const parsedResponse = responseText ? JSON.parse(responseText) : [];


  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Active Living Generator
        </Typography>

        {/* Form */}
        <form onSubmit={generateActiveRoutine}>
          {/* Input for glucose data */}
          <TextField
            fullWidth
            label="Glucose Data (comma-separated values)"
            value={glucoseData}
            onChange={(e) => setGlucoseData(e.target.value)}
            placeholder="e.g., 120, 140, 130, 110"
            margin="normal"
            required
          />

          {/* Input for exercise data */}
          <TextField
            fullWidth
            label="Exercise"
            value={exerciseData}
            onChange={(e) => setExerciseData(e.target.value)}
            placeholder="e.g., walking, swimming"
            margin="normal"
            required
          />

          {/* Input for user's age */}
          <TextField
            fullWidth
            label="Age"
            value={ageData}
            onChange={(e) => setAgeData(e.target.value)}
            placeholder="e.g., 72"
            margin="normal"
            required
          />

          {/* Input for frequency of exercise */}
          <TextField
            fullWidth
            label="Frequency"
            value={frequencyData}
            onChange={(e) => setFrequencyData(e.target.value)}
            placeholder="e.g., daily, once a week"
            margin="normal"
            required
          />

              {/* Submit button */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Generate Recommendations
            </Button>
          </Box>
        </form>

        {/* Display AI response */}
        {responseText.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            AI Recommendations
          </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    {responseText}
                  </Typography>
                </Paper>
        </Box>
        )}
      </Box>
    </Container>
  );
};

export default ActiveLivingComponent;