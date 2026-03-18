# VizAi-new - Conversational BI Dashboard

VizAI is a modern, intelligent business intelligence platform that allows anyone to generate interactive dashboards using natural language. No SQL, no complex BI tools—just ask your data questions in plain English.

## Features

- **Natural Language Querying**: Powered by Google Gemini AI to interpret complex business questions.
- **Instant Visualization**: Automatically selects the best chart type (Bar, Line, Area, Pie) for your data.
- **CSV Data Upload**: Dynamic schema detection for any CSV dataset.
- **Premium UI/UX**: Built with React, Tailwind CSS v4, and Framer Motion for a state-of-the-art experience.
- **Interactive Charts**: Responsive visualizations with tooltips, legends, and animations.

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Recharts, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Google Gemini 1.5 Flash.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Google Gemini API Key

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bi_dashboard
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser (usually `http://localhost:5173`).
2. Click **Start Analyzing**.
3. Use the **Upload CSV** button in the sidebar to upload the provided `sample_sales_data.csv`.
4. Ask questions in the chat box, such as:
   - "Show me total sales by region."
   - "What is the monthly sales trend?"
   - "Compare profit across different product categories."

## Project Structure

- `client/`: React frontend source code.
- `server/`: Express backend and AI integration logic.
- `sample_sales_data.csv`: A sample dataset to get you started.


