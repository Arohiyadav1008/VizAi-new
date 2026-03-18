const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY.split(',')[0].trim();
  console.log("Using key:", apiKey.substring(0, 10) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try models from the list
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
  
  for (const m of models) {
    try {
      console.log(`\n--- Testing ${m} ---`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      console.log("Response:", result.response.text());
      console.log("SUCCESS");
    } catch (err) {
      console.error("FAILED:", err.message);
      if (err.status) console.error("Status:", err.status);
    }
  }
}

main();
