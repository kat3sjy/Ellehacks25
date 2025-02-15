import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// Load environment variables
// dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyCwI_FumTTSyWt7hbvbtlzyzU1UeFx52rQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

async function generateResponse() {
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

generateResponse();