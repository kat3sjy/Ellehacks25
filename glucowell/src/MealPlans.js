import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// Load environment variables
// dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyCwI_FumTTSyWt7hbvbtlzyzU1UeFx52rQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function MealPlans() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const glucoseData = [120, 140, 130, 110]; // Mock glucose data
    const dietaryPreferences = "low-carb"; // Example dietary preference

    // Generate meal recommendations using the AI model
    const generateMealRecommendations = async () => {
      const prompt = `
        Based on the following glucose levels: ${glucoseData.join(", ")} 
        and dietary preferences: ${dietaryPreferences}, 
        recommend 3 meals that are healthy and suitable for someone with diabetes.
      `;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log(responseText);

        // Parse the AI-generated response (assuming it returns structured text)
        // const parsedMeals = parseAIResponse(responseText);

        // Update the state with the generated meal recommendations
        setMeals(responseText);
      } catch (error) {
        console.error("Error generating meal recommendations:", error.message);
        setError("Failed to generate meal recommendations.");
      }
    };

    generateMealRecommendations();
  }, []);

  // Helper function to parse the AI-generated response
  // const parseAIResponse = (responseText) => {
  //   // Assuming the AI generates a list of meals in plain text format
  //   // Example response: "1. Grilled chicken salad - Low-carb and high-protein. 2. Baked salmon - Rich in omega-3. 3. Vegetable stir-fry - Low-sugar."
  //   const mealRegex = /\d+\.\s*([^-\n]+)\s*-\s*([^\n]+)/g;
  //   const meals = [];
  //   let match;

  //   while ((match = mealRegex.exec(responseText)) !== null) {
  //     meals.push({
  //       name: match[1].trim(),
  //       description: match[2].trim(),
  //     });
  //   }

  //   return meals;
  // };

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div>
      <responseText/>
    </div>
  );
}

export default MealPlans;