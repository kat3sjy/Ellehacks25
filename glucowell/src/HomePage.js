import React, { useState } from "react";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Container, Paper, Typography, Button } from "@mui/material";
import LineChartComponent from "./LineChartComponent";
import DexcomAPI from "./DexcomAPI"


// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const schema = {
    description:
        "A list of achievable 1-week goals for a senior with diabetes to benefit their health and lifestyle.",
    type: SchemaType.ARRAY,
    minItems: 5,
    maxItems: 5,
    items: {
        type: SchemaType.STRING,
        description: "a one sentence description of the goal",
    },
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});

const HomePageComponent = () => {
    // State to hold the AI-generated goals
    const [goals, setGoals] = useState([]);

    // Function to generate goals using the AI model
    const generateGoals = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        try {
            const prompt =
                "A list of achievable 1-week goals for a senior with diabetes to benefit their health and lifestyle.";
            const result = await model.generateContent(prompt);
            const aiResponseText = result.response.text(); // Get the raw AI response

            // Parse the AI response into an array of goals
            const parsedGoals = JSON.parse(aiResponseText);
            setGoals(parsedGoals); // Store the parsed goals in state
        } catch (error) {
            console.error("Error generating goals:", error);
            setGoals([`An error occurred: ${error.message}`]);
        }
    };

    return (
        <Container>
            <DexcomAPI/>
            <LineChartComponent />
            <div style={{ marginTop: "20px" }}>
                <Button variant="contained" onClick={generateGoals}>
                    Generate 1-Week Glucose Goals
                </Button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                    <Typography variant="h5" gutterBottom>
                        1-Week Glucose Goals
                    </Typography>
                    {goals.length > 0 ? (
                        <ul>
                            {goals.map((goal, index) => (
                                <li key={index}>
                                    <Typography>{goal}</Typography>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography>No goals generated yet.</Typography>
                    )}
                </Paper>
            </div>
        </Container>
    );
};

export default HomePageComponent;