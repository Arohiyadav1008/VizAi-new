const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });


async function listAll() {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  if (apiKeys.length === 0) return console.error("No keys found");

  const apiKey = apiKeys[apiKeys.length - 1]; // Use newest key
  console.log(`Testing key: ${apiKey.substring(0, 8)}...`);

  try {
    // We'll use the raw fetch if the SDK doesn't have listModels 
    // but the SDK DOES have it in recent versions!
    const genAI = new GoogleGenerativeAI(apiKey);
    // Actually, listing models usually requires an API call that many keys can do.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      const fs = require('fs');
      const modelNames = data.models.map(m => m.name.replace('models/', ''));
      fs.writeFileSync('models.txt', modelNames.join('\n'));
      console.log(`Saved ${modelNames.length} models to models.txt`);
    } else {

      console.error("No models returned in list:", data);
    }
  } catch (err) {
    console.error("List failed:", err.message);
  }
}

listAll();
