
// import React, { useState, useEffect } from "react";
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";


// // Initialize the Google Generative AI client
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

// const schema = {
//   description: "An array providing feedback and alternative meal suggestions on the user's \n" +
//   "three meals of the day: breakfast, lunch and dinner. Each meal should have its own object with separate feedback and alternatives.",
//   type: SchemaType.ARRAY,
//   minItems: 3,
//   maxItems: 3,
//   items:{
//     type: SchemaType.OBJECT,
//     properties: {
//       meal: {
//         type: SchemaType.STRING,
//         description: "The meal of the day.",
//         enum: [
//           "Breakfast",
//           "Lunch",
//           "Dinner"
//         ],
//       },
//       feedback: {
//         type: SchemaType.STRING,
//         description: "Some criticism on the user's choice for the meal (either breakfast, lunch, or dinner. NOT for all three.)."
//       },
//       alternatives:{
//         type: SchemaType.STRING,
//         description: "Providing alternative healthier meal options for the user. (either breakfast, lunch, or dinner. NOT for all three.)"
//       },
//     },
//     required: ["meal", "feedback", "alternatives"]
//   }
// };


// const model = genAI.getGenerativeModel(
//   { model: "gemini-1.5-flash",
//     generationConfig: {
//       responseMimeType: "application/json",
//       responseSchema: schema,
//     },
//   });


// function MealPlans() {
//   // State variables to store user inputs
//   const [glucoseData, setGlucoseData] = useState("");
//   const [dietaryPreferences, setDietaryPreferences] = useState("");
//   const [userMealPlan, setUserMealPlan] = useState({
//     Breakfast: "",
//     Lunch: "",
//     Dinner: "",
//   });
//   const [responseText, setResponseText] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const glucoseData = [120, 140, 130, 110]; // Mock glucose data
//     const dietaryPreferences = "low-carb"; // Example dietary preference
//     const userMealPlan = {Breakfast: 'bacon and eggs', Lunch: 'salad', Dinner: 'egg fried rice'}

//     const generateMealRecommendations = async (e) => {
//       e.preventDefault(); // Prevent default form behavior

//       // Parse glucose data from string to array
//       const parsedGlucoseData = glucoseData.split(",").map(Number);

//       // Convert user meal plan object to JSON string
//       const userMealPlanString = JSON.stringify(userMealPlan);

//       const prompt = `
//         The user makes the following meal plan for the day: ${userMealPlanString}
//         Based on the following glucose levels: ${parsedGlucoseData.join(", ")} 
//         and dietary preferences: ${dietaryPreferences}, 
//         provide some recommendations and feedback on their meal plan. 
//         `;
//       try {
//         const result = await model.generateContent(prompt);
//         const aiResponseText = result.response.text(); // Get the raw AI response
//         // console.log("AI Response:", aiResponseText);

//         // Store the raw response text in state
//         setResponseText(aiResponseText);
//       } catch (error) {
//         console.error("Error generating meal recommendations:", error.message);
//         setError("Failed to generate meal recommendations.");
//       } finally {
//         setLoading(false); // Stop loading after processing
//       }
//     };

//     generateMealRecommendations();
//   }, []);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (loading) {
//     return <p>Loading meal recommendations...</p>;
//   }

//   return (
//     <div>
//       <h1>Meal Recommendation Generator</h1>
//       <form onSubmit={generateMealRecommendations}>
//         {/* Input for glucose data */}
//         <label>
//           Glucose Data (comma-separated values):<br />
//           <input
//             type="text"
//             value={glucoseData}
//             onChange={(e) => setGlucoseData(e.target.value)}
//             placeholder="e.g., 120, 140, 130, 110"
//             required
//           />
//         </label>
//         <br />

//         {/* Input for dietary preferences */}
//         <label>
//           Dietary Preferences:<br />
//           <input
//             type="text"
//             value={dietaryPreferences}
//             onChange={(e) => setDietaryPreferences(e.target.value)}
//             placeholder="e.g., low-carb, vegetarian"
//             required
//           />
//         </label>
//       <br />

//         {/* Inputs for user meal plan */}
//         <label>
//           Breakfast:<br />
//           <input
//             type="text"
//             value={userMealPlan.Breakfast}
//             onChange={(e) =>
//               setUserMealPlan({ ...userMealPlan, Breakfast: e.target.value })
//             }
//             placeholder="e.g., bacon and eggs"
//             required
//           />
//         </label>
//         <br />
//         <label>
//           Lunch:<br />
//           <input
//             type="text"
//             value={userMealPlan.Lunch}
//             onChange={(e) =>
//               setUserMealPlan({ ...userMealPlan, Lunch: e.target.value })
//             }
//             placeholder="e.g., salad"
//             required
//           />
//         </label>
//         <br />
//         <label>
//           Dinner:<br />
//           <input
//             type="text"
//             value={userMealPlan.Dinner}
//             onChange={(e) =>
//               setUserMealPlan({ ...userMealPlan, Dinner: e.target.value })
//             }
//             placeholder="e.g., egg fried rice"
//             required
//           />
//         </label>
//         <br />

//         {/* Submit button */}
//         <button type="submit">Generate Recommendations</button>
//       </form>

//       {/* Display AI response */}
//       {responseText && (
//         <div>
//           <h2>AI Response:</h2>
//           <pre>{responseText}</pre>
//         </div>
//       )}
//   </div>
//   );
// }

// export default MealPlans;

import React, { useState } from "react";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";


// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const schema = {
  description: "An array providing feedback and alternative meal suggestions on the user's \n" +
  "three meals of the day: breakfast, lunch and dinner. Each meal should have its own object with separate feedback and alternatives.",
  type: SchemaType.ARRAY,
  minItems: 3,
  maxItems: 3,
  items:{
    type: SchemaType.OBJECT,
    properties: {
      meal: {
        type: SchemaType.STRING,
        description: "The meal of the day.",
        enum: [
          "Breakfast",
          "Lunch",
          "Dinner"
        ],
      },
      feedback: {
        type: SchemaType.STRING,
        description: "Some criticism on the user's choice for the meal (either breakfast, lunch, or dinner. NOT for all three.)."
      },
      alternatives:{
        type: SchemaType.STRING,
        description: "Providing alternative healthier meal options for the user. (either breakfast, lunch, or dinner. NOT for all three.)"
      },
    },
    required: ["meal", "feedback", "alternatives"]
  }
};


const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash",
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

  return (
    <div>
      <h1>Meal Recommendation Generator</h1>
      <form onSubmit={generateMealRecommendations}>
        {/* Input for glucose data */}
        <label htmlFor="glucoseData">
          Glucose Data (comma-separated values):<br />
          <input
            id="glucoseData"
            type="text"
            value={glucoseData}
            onChange={(e) => setGlucoseData(e.target.value)}
            placeholder="e.g., 120, 140, 130, 110"
            required
          />
        </label>
        <br />

        {/* Input for dietary preferences */}
        <label htmlFor="dietaryPreferences">
          Dietary Preferences:<br />
          <input
            id="dietaryPreferences"
            type="text"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="e.g., low-carb, vegetarian"
            required
          />
        </label>
        <br />

        {/* Inputs for user meal plan */}
        <label htmlFor="breakfast">
          Breakfast:<br />
          <input
            id="breakfast"
            type="text"
            value={userMealPlan.Breakfast}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Breakfast: e.target.value })
            }
            placeholder="e.g., bacon and eggs"
            required
          />
        </label>
        <br />
        <label htmlFor="lunch">
          Lunch:<br />
          <input
            id="lunch"
            type="text"
            value={userMealPlan.Lunch}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Lunch: e.target.value })
            }
            placeholder="e.g., salad"
            required
          />
        </label>
        <br />
        <label htmlFor="dinner">
          Dinner:<br />
          <input
            id="dinner"
            type="text"
            value={userMealPlan.Dinner}
            onChange={(e) =>
              setUserMealPlan({ ...userMealPlan, Dinner: e.target.value })
            }
            placeholder="e.g., egg fried rice"
            required
          />
        </label>
        <br />

        {/* Submit button */}
        <button type="submit">Generate Recommendations</button>
      </form>

      {/* Display AI response */}
      {responseText && (
        <div>
          <h2>AI Response:</h2>
          <pre>{responseText}</pre>
        </div>
      )}
    </div>
  );
};

export default MealRecommendationComponent;