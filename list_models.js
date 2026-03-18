const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "server/.env" });

async function listModels() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  if (apiKeys.length === 0) return console.error("No keys");

  const apiKey = apiKeys[apiKeys.length - 1]; // Try the newest key
  console.log(`Testing key: ${apiKey.substring(0, 8)}...`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There isn't a direct listModels in the high-level SDK easily, 
    // but we can try a few known variations and see which one doesn't 404.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`[OK] ${m}`);
      } catch (e) {
        console.log(`[FAIL] ${m}: ${e.message.substring(0, 100)}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
