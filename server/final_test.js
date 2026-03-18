const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  
  for (const key of apiKeys) {
    console.log(`\n=== Testing Key: ${key.substring(0, 10)}... ===`);
    const genAI = new GoogleGenerativeAI(key);
    for (const m of models) {
      try {
        console.log(`Testing ${m}...`);
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("hello");
        console.log(`SUCCESS with ${m}:`, result.response.text());
        return; // Success!
      } catch (err) {
        console.error(`FAILED ${m}: Status ${err.status} - ${err.message}`);
      }
    }
  }
}

main();
