const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAIModel = (apiKey) => {

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

exports.parseQuery = async (prompt, columns) => {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  
  if (apiKeys.length === 0) {
    throw new Error("No Gemini API keys found in .env");
  }

  let lastError = null;
  
  for (const apiKey of apiKeys) {
    try {
      const model = getAIModel(apiKey);

      const systemPrompt = `

      You are an expert Data Scientist and BI Architect. Your task is to convert a user's natural language question into a structured JSON query object for a business dashboard.
      The data has the following columns:
      ${JSON.stringify(columns)}

      Rules:
      1. Use ONLY the columns provided.
      2. Detect if the user wants an aggregation (sum, count, average, min, max) or a trend/distribution.
      3. Recommend the best chart type:
         - "line" or "area" for time-series/trends.
         - "bar" for categorical comparisons.
         - "pie" for proportions of a whole (max 6-8 slices).
         - "scatter" for correlation between two numeric variables.
      4. title: Create a professional, punchy business title (e.g., "Monthly Revenue Breakdown by Region").
      5. intent: "aggregation" (grouping) or "listing" (raw data).
      6. metrics: Column names to perform math on.
      7. dimensions: Column names to group by.

      Output MUST be valid JSON:
      {
        "intent": "aggregation" | "listing",
        "metrics": ["col1", "col2"],
        "dimensions": ["col_dimension"],
        "chartType": "bar" | "line" | "area" | "pie",
        "title": "Title String",
        "filters": { "col": "value" },
        "insight": "A brief 1-sentence analytical insight about what this query will show."
      }
    `;

      const result = await model.generateContent([systemPrompt, prompt]);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse AI response as JSON");
      
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      lastError = err;
      // If it's an API key error, continue to next key
      if (err.message?.includes('API_KEY_INVALID') || err.status === 400 || err.status === 401) {
        console.warn(`API Key ${apiKey.substring(0, 8)}... failed, trying next...`);
        continue;
      }
      // If it's another type of error, throw it immediately
      throw err;
    }
  }

  console.error("All AI Service keys failed:", lastError);
  throw new Error("All provided Gemini API keys are invalid or failed. Please check your .env file.");
};

