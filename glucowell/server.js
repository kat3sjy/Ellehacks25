const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "your_secret_key", // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/glucowell", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Dexcom Data Model
const dexcomDataSchema = new mongoose.Schema({
  value: Number,
  trend: Number,
  time: Date,
});

const DexcomData = mongoose.model("DexcomData", dexcomDataSchema);

// Environment Variables (replace with your actual values)
const CLIENT_ID = process.env.DEXCOM_CLIENT_ID || "your_dexcom_client_id";
const CLIENT_SECRET = process.env.DEXCOM_CLIENT_SECRET || "your_dexcom_client_secret";
const REDIRECT_URI = process.env.DEXCOM_REDIRECT_URI || "http://localhost:4000/dexcom/callback";
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "your_cloudflare_api_token";
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "your_cloudflare_account_id";

// API Endpoints
// 1. Dexcom OAuth Login
app.get("/dexcom/login", (req, res) => {
  const authUrl = `https://sandbox-api.dexcom.com/v2/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=offline_access`;
  res.redirect(authUrl);
});

// 2. OAuth Callback
app.get("/dexcom/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      "https://sandbox-api.dexcom.com/v2/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    req.session.accessToken = tokenResponse.data.access_token;
    res.redirect("/"); // Redirect to your frontend
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Failed to authenticate with Dexcom" });
  }
});

// 3. Get Glucose Data (Dexcom API -> MongoDB)
app.get("/dexcom/glucose", async (req, res) => {
  if (!req.session.accessToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const response = await axios.get("https://sandbox-api.dexcom.com/v2/users/self/egvs", {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });

    const glucoseReadings = response.data.egvs.map((entry) => ({
      value: entry.value,
      trend: entry.trend,
      time: new Date(entry.systemTime),
    }));

    await DexcomData.insertMany(glucoseReadings);
    res.json({ success: true, data: glucoseReadings });
  } catch (error) {
    console.error("Error fetching glucose data from Dexcom:", error);
    res.status(500).json({ error: "Failed to fetch glucose data" });
  }
});

// 4. Manual Glucose Entry
app.post("/glucose/manual", async (req, res) => {
  const { value, trend } = req.body;
  const newEntry = new DexcomData({ value, trend, time: new Date() });
  try {
    await newEntry.save();
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error("Error saving manual glucose entry:", error);
    res.status(500).json({ error: "Failed to save glucose entry" });
  }
});

// 5. Analyze Glucose Trends (MongoDB -> Cloudflare AI)
app.get("/glucose/analyze", async (req, res) => {
  try {
    const glucoseData = await DexcomData.find().sort({ time: -1 }).limit(10);
    const glucoseValues = glucoseData.map(entry => entry.value);

    const aiResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/google/gemma-7b-it-lora`,
      { prompt: `Analyze glucose levels: ${glucoseValues}. Predict trends.` },
      { headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` } }
    );

    res.json({ success: true, analysis: aiResponse.data });
  } catch (error) {
    console.error("Error analyzing glucose trends:", error);
    res.status(500).json({ error: "Failed to analyze glucose trends" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
