
import React, { useState } from "react";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const schema = {
  description:
    "An array providing feedback and alternative meal suggestions on the user's three meals of the day: breakfast, lunch, and dinner. Each meal should have its own object with separate feedback and alternatives.",
  type: SchemaType.ARRAY,
  minItems: 3,
  maxItems: 3,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      meal: {
        type: SchemaType.STRING,
        description: "The meal of the day.",
        enum: ["Breakfast", "Lunch", "Dinner"],
      },
      feedback: {
        type: SchemaType.STRING,
        description:
          "Some criticism on the user's choice for the meal (either breakfast, lunch, or dinner. NOT for all three.)",
      },
      alternatives: {
        type: SchemaType.STRING,
        description:
          "Providing alternative healthier meal options for the user. (either breakfast, lunch, or dinner. NOT for all three.)",
      },
    },
    required: ["meal", "feedback", "alternatives"],
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

const MealRecommendationComponent = () => {
  // State variables to store user inputs
  const [glucoseData, setGlucoseData] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [userMealPlan, setUserMealPlan] = useState({
    Breakfast: "",
    Lunch: "",
    Dinner: "",
  });
  const [responseText, setResponseText] = useState("");

  // Function to handle form submission
  const generateMealRecommendations = async (e) => {
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

      // Convert user meal plan object to JSON string
      const userMealPlanString = JSON.stringify(userMealPlan);

      // Construct the prompt for the AI model
      const prompt = `
        The user makes the following meal plan for the day: ${userMealPlanString}.
        Based on the following glucose levels: ${parsedGlucoseData.join(", ")} 
        and dietary preferences: ${dietaryPreferences}, 
        provide some recommendations and feedback on their meal plan.
      `;

      // Call the AI model to generate content
      const result = await model.generateContent(prompt);
      const aiResponseText = result.response.text(); // Get the raw AI response

      // Store the raw response text in state
      setResponseText(aiResponseText);
    } catch (error) {
      console.error("Error generating meal recommendations:", error);
      setResponseText(`An error occurred: ${error.message}`);
    }
  };

  // Parse the AI response into an array of meal objects
  const parsedResponse = responseText ? JSON.parse(responseText) : [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Meal Recommendation Generator
        </Typography>

        {/* Form */}
        <form onSubmit={generateMealRecommendations}>
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

          {/* Input for dietary preferences */}
          <TextField
            fullWidth
            label="Dietary Preferences"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="e.g., low-carb, vegetarian"
            margin="normal"
            required
          />

          {/* Inputs for user meal plan */}
          <TextField
            fullWidth
            label="Breakfast"
            value={userMealPlan.Breakfast}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Breakfast: e.target.value })
            }
            placeholder="e.g., bacon and eggs"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Lunch"
            value={userMealPlan.Lunch}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Lunch: e.target.value })
            }
            placeholder="e.g., salad"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Dinner"
            value={userMealPlan.Dinner}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Dinner: e.target.value })
            }
            placeholder="e.g., egg fried rice"
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
        {parsedResponse.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
              AI Recommendations
            </Typography>
            <Grid container spacing={3}>
              {parsedResponse.map((meal, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      {meal.meal}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Feedback:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {meal.feedback || "No feedback available."}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Alternatives:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {meal.alternatives || "No alternatives suggested."}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MealRecommendationComponent;