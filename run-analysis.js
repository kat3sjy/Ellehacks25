async function runAnalysis(data) {
  // Placeholder for Cloudflare API deployment using wrangler
  const apiKey = "a96cb0fc0a7579df120a984bdcf93903"; // User provided API key/Account ID
  const accountId = "a96cb0fc0a7579df120a984bdcf93903"; // User provided API key/Account ID
  const model = "@cf/google/gemma-7b-it-lora";

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ messages: data }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Could not run Cloudflare Workers AI", error);
    return { error: error.message };
  }
}
