

import React, { useState, useContext} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { TargetContext } from './TargetContext';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

const ActiveLivingComponent = () => {
  // Access the targets from the context
  const { targets } = useContext(TargetContext);

  // State variables to store user inputs
  const [exerciseData, setExerciseData] = useState("");
  const [frequencyData, setFrequencyData] = useState("");
  const [ageData, setAgeData] = useState("");

  console.log("Targets array:", targets);
  const glucoseData = targets.map(value => Number(value.trim())).filter(value => !isNaN(value));
  console.log("Glucose data:", glucoseData);

  const [responseText, setResponseText] = useState("");

  // Function to handle form submission
  const generateActiveRoutine = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    try {
      if (glucoseData.length === 0) {
        throw new Error("No valid glucose data available. Please upload a CSV file.");
      }
      // Construct the prompt for the AI model
      const prompt = `
        Based on the following glucose levels: ${glucoseData.join(", ")} of the user
        and that the user does the following exercise: ${exerciseData}, 
        for this amount of frequency: ${frequencyData},
        provide some recommendations and feedback on their active routine to optimize their healthy active living.
        Do not give suggestions for their diet, or any other aspects of a healthy lifestyle. Only give suggestions on 
        their frequency of exercise, type of exercise, and alternative exercises they could implement in their 
        lifestyle. Also, estimate the age of the user. Limit your response to 5 sentences.
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Active Living Generator
        </Typography>
        {/* Form */}
        <form onSubmit={generateActiveRoutine}>
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
              disabled={glucoseData.length === 0} // Disable button if no glucose data
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


// import React, { useContext } from "react";
// import { TargetContext } from './TargetContext';

// const ActiveLivingComponent = () => {
//   const context = useContext(TargetContext);

//   console.log("Context:", context); // Debugging

//   if (!context || !context.targets) {
//     console.error("Context or targets is undefined. Check if TargetProvider is wrapping this component.");
//     return <p>Error: Context is undefined.</p>;
//   }

//   const { targets } = context;

//   console.log("Targets:", targets); // Debugging

//   return (
//     <div>
//       <h2>Glucose Data</h2>
//       <p>{targets && targets.length > 0 ? targets.join(", ") : "No valid glucose data"}</p>
//     </div>
//   );
// };

// export default ActiveLivingComponent;
