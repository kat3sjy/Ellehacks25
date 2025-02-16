import requests
import sys
import json

API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/a96cb0fc0a7579df120a984bdcf93903/ai/run/"
headers = {"Authorization": "Bearer 1C2cczC4O825AUmVdJQN8Pu9MpjAo-c9QpxjTDzG"}

def run(model, inputs):
    input = { "messages": inputs }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()

def analyze_glucose(glucose_data):
    inputs = [
        { "role": "system", "content": "You are a friendly assistant that helps analyze blood sugar trends" },
        { "role": "user", "content": f"Analyze the following blood sugar data: {glucose_data}" }
    ];
    output = run("@cf/meta/llama-3-8b-instruct", inputs)
    return output

if __name__ == "__main__":
    glucose_values = sys.argv[1]
    analysis = analyze_glucose(glucose_values)
    print(json.dumps(analysis))
