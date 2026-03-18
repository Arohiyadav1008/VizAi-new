const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "server/.env" });

async function testKeys() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"];

  console.log(`Testing ${apiKeys.length} keys...`);

  for (const apiKey of apiKeys) {
    console.log(`\nKey: ${apiKey.substring(0, 8)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'key works'");
        console.log(`  - Model ${modelName}: SUCCESS - ${result.response.text().trim()}`);
      } catch (err) {
        console.log(`  - Model ${modelName}: FAILED - ${err.message}`);
      }
    }
  }
}

testKeys();
