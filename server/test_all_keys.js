const { GoogleGenerativeAI } = require("@google/generative-ai");

const keys = [
  "AIzaSyAOuPBsNa5tpYIWo-bGrPuoPnri_SImB30",
  "AIzaSyAPfjrkjd-p9TkMB_FYnVmYUXpjwjh06Bg",
  "AIzaSyAaV8GTH_Y6Oh096b6di2M-1fcXUe9WYDM",
  "AIzaSyCKScGn39jaC2sJxHLVI8hCxK5cWIjQaAk",
  "AIzaSyBsAJMIloi-VWY0fNdJqwS2pvnuowTnpWI",
  "AIzaSyD_sYHFGbF0-rx1qiqBlykDPyYzTY9uv6E"
];

const modelName = "gemini-2.5-flash"; // Year 2026 standard

async function test() {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`\nTesting Key ${i+1}: ${key.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(key);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("hi");
      console.log(`SUCCESS with Key ${i+1}:`, result.response.text().substring(0, 20));
    } catch (err) {
      console.error(`FAILED Key ${i+1}: ${err.status} - ${err.message}`);
    }
  }
}

test();
