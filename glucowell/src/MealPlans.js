import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyCwI_FumTTSyWt7hbvbtlzyzU1UeFx52rQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function MealPlans() {
  const [responseText, setResponseText] = useState(""); // State for raw AI response
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const glucoseData = [120, 140, 130, 110]; // Mock glucose data
    const dietaryPreferences = "low-carb"; // Example dietary preference

    const generateMealRecommendations = async () => {
      const prompt = `
        Based on the following glucose levels: ${glucoseData.join(", ")} 
        and dietary preferences: ${dietaryPreferences}, 
        recommend 3 meals that are healthy and suitable for someone with diabetes.
      `;

      try {
        const result = await model.generateContent(prompt);
        const aiResponseText = result.response.text(); // Get the raw AI response
        console.log("AI Response:", aiResponseText);

        // Store the raw response text in state
        setResponseText(aiResponseText);
      } catch (error) {
        console.error("Error generating meal recommendations:", error.message);
        setError("Failed to generate meal recommendations.");
      } finally {
        setLoading(false); // Stop loading after processing
      }
    };

    generateMealRecommendations();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <p>Loading meal recommendations...</p>;
  }

  return (
    <div>
      {/* Display the raw AI response */}
      <pre>{responseText}</pre> {/* Use <pre> to preserve formatting */}
    </div>
  );
}

export default MealPlans;