
import React, { useState, useEffect } from "react";

const CLIENT_ID = "dVO23Im0ggi6RWjdMs0LokkwLtjwyRwn";
const REDIRECT_URI = "http://172.18.0.1:3000/";
const AUTHORIZATION_URL = "https://sandbox-api.dexcom.com/v2/oauth2/login"; // Use sandbox for testing
const CLIENT_SECRET = "Y42kgQ4aGPpGCeRC";

const DexcomAPI = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    } else {
      const storedAccessToken = localStorage.getItem("dexcom_access_token");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
    }
  }, []);

  const redirectToDexcom = () => {
    const authorizationUrl = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=offline_access`;
    console.log("Redirecting to Dexcom with URL:", authorizationUrl); // Debugging log
    window.location.href = authorizationUrl;
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch("https://sandbox-api.dexcom.com/v2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem("dexcom_access_token", data.access_token);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={redirectToDexcom}>Login with Dexcom</button>
      ) : (
        <p>Access Token: {accessToken}</p>
      )}
    </div>
  );
};

export default DexcomAPI;
