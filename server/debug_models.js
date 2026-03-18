const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function debug() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-1.5-flash"];

  for (const apiKey of apiKeys) {
    console.log(`\n--- Testing Key: ${apiKey.substring(0, 12)}... ---`);
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTry) {
      console.log(`Testing Model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`SUCCESS: ${modelName}`);
      } catch (err) {
        console.error(`FAILURE: ${modelName}`);
        console.error(`Status: ${err.status}`);
        console.error(`Message: ${err.message}`);
        if (err.errorDetails) console.error(`Details:`, JSON.stringify(err.errorDetails, null, 2));
      }
    }
  }
}

debug();
