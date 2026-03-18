const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.parseQuery = async (prompt, columns) => {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  // Based on diagnostic listing, these are the confirmed available models for these keys
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

  if (apiKeys.length === 0) {
    throw new Error("No Gemini API keys found in .env");
  }

  let lastError = null;

  for (const apiKey of apiKeys) {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const systemPrompt = `
          You are an expert Data Scientist and BI Architect. Your task is to convert a user's natural language question into a structured JSON query object for a business dashboard.
          The data has the following columns:
          ${JSON.stringify(columns)}

          Rules:
          1. Use ONLY the columns provided.
          2. Detect if the user wants an aggregation (sum, count, average, min, max).
          3. Recommend the best chart type: "bar", "line", "area", "pie", or "scatter".
          4. If the user asks for a total/overall count (no breakdown), leave "dimensions" as an empty array [].
          5. Output MUST be valid JSON:
          {
            "intent": "aggregation" | "listing",
            "metrics": [
              { "field": "column_name", "op": "sum" | "avg" | "count" | "min" | "max", "label": "Friendly Name" }
            ],
            "dimensions": ["column_to_group_by"], // Empty [] for total/global summary
            "chartType": "bar" | "line" | "area" | "pie",
            "title": "Professional Title",
            "insight": "Analytical insight."
          }
        `;


        const result = await model.generateContent([systemPrompt, prompt]);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error("Could not parse AI response as JSON");
        return JSON.parse(jsonMatch[0]);

      } catch (err) {
        lastError = err;
        const msg = err.message || '';
        const status = err.status || (msg.includes('404') ? 404 : msg.includes('400') ? 400 : 401 ? 401 : 500);

        if (status === 404 || msg.includes('not found')) {
          console.warn(`Model ${modelName} not found for key ${apiKey.substring(0, 8)}..., trying next model...`);
          continue;
        }
        
        if (status === 400 || status === 401 || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
          console.warn(`API Key ${apiKey.substring(0, 8)}... failed, trying next key...`);
          break; // Break model loop to try next key
        }
        
        console.error(`Error with ${modelName} on key ${apiKey.substring(0, 8)}...:`, msg);
        continue; // Try next model or key
      }
    }
  }

  console.error("All AI Service keys/models failed:", lastError);
  throw new Error("AI Assistant unavailable: All provided API keys or models failed. Please check your Gemini API configuration.");
};

exports.generateSuggestions = async (columns) => {
  const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];

  for (const apiKey of apiKeys) {
    const genAI = new GoogleGenerativeAI(apiKey);
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
          Analyze these data columns: ${JSON.stringify(columns)}
          Suggest 4 professional and interesting business questions a non-technical user might ask to get insights from this data.
          Format your response as a valid JSON array of strings.
          Example: ["What is the total sales by region?", "Show me the top 5 products by profit"]
        `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn(`Suggestion generation failed for ${modelName}, trying next...`);
      }
    }
  }
  return ["How many rows are in this dataset?", "Show me a summary of the data"];
};

