const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.parseQuery = async (prompt, columns) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    
    // Extract JSON from response (handling potential markdown blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response as JSON");
    
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("AI Service Error:", err);
    throw err;
  }
};
