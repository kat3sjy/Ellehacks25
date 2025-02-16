import React, { useState, useEffect } from "react";
import { Buffer } from 'node:buffer';
const { mongoDB, DexcomData } = require('./mongo');

const CLIENT_ID = "ZYJi0m5nN1AhPX5BIYnDGNLgLn0rqO3N";
const REDIRECT_URI = "http://127.0.0.1:4040";
const DEXCOM_API_URL = "https://api.dexcom.com/v2"; // or sandbox
const CLIENT_SECRET = "F4vKwRHPsQFraF2B";
const MONGODB_URI = "mongodb+srv://lievelyn746:gp3puFBu6M0JcMF7@clusterellehacks.ycvsi.mongodb.net/";

const generateCodeVerifier = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const buffer = Buffer.from(digest);
  const codeChallenge = buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return codeChallenge;
};

function DexcomAPI() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Check if we have an authorization code in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the authorization code for an access token
      exchangeCodeForToken(code);
    } else {
      // If we don't have an access token, redirect to Dexcom for authorization
      redirectToDexcom();
    }
  }, [accessToken]);

  const redirectToDexcom = () => {
    const authorizationUrl = `https://api.dexcom.com/v2/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=offline_access`;
    window.location.href = authorizationUrl;
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch("https://api.dexcom.com/v2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem('dexcom_access_token', data.access_token); // Store access token
      console.log('Access token stored in local storage:', data.access_token);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  const fetchData = async () => {
    try {
      const storedAccessToken = localStorage.getItem('dexcom_access_token');
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        const response = await fetch(`${DEXCOM_API_URL}/users/self/egvs`, {
          headers: {
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });

        const responseData = await response.json();
        setData(responseData);

        // Connect to MongoDB
        await mongoDB(MONGODB_URI);

        // Save the data to MongoDB
        if (responseData.egvs && Array.isArray(responseData.egvs)) {
          for (const egv of responseData.egvs) {
            const dexcomData = new DexcomData({
              value: egv.value,
              trend: egv.trend,
              time: new Date(egv.systemTime), // Use systemTime as time
            });
            await dexcomData.save();
            console.log('Dexcom data saved to MongoDB');
          }
        }
      } else {
        redirectToDexcom();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {accessToken ? (
        <div>
          <p>Access Token: {accessToken}</p>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      ) : (
        <button onClick={redirectToDexcom}>Login with Dexcom</button>
      )}
    </div>
  );
}

export default DexcomAPI;
