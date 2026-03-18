const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function testKeys() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  
  for (const apiKey of apiKeys) {
    console.log(`\nTesting Key: ${apiKey.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
      // In newer SDKs, you can use listModels
      // But let's just try to get a model and see if it fails at the 'get' step or 'generate' step
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing Model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'hello'");
        console.log(`Generation Success with ${modelName}:`, result.response.text());
        return; // Success!
      } catch (e) {
        console.error(`${modelName} failed: ${e.message}`);
      }
    }

    } catch (err) {
      console.error(`Key ${apiKey.substring(0, 5)} totally failed: ${err.message}`);
    }
  }
}

testKeys();
