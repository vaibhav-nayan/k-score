# 🤖 AI-Powered Lead Scoring App

Welcome to the AI-Powered Lead Scoring App! This project is designed to help sales and marketing teams quickly figure out which leads are truly ready to buy.

Instead of just guessing, we combine smart, rule-based filtering with the power of an LLM (like Gemini) to give every lead an Intent Score and clear, detailed Reasoning.

## ✨ What It Does

- **Define Your Offer**: Easily tell the system about your product—its name, key value propositions, and who your ideal customer is.
- **Upload Your Leads**: Drop in a CSV file with your lead data (Name, Role, Company, etc.).
- **Run the Scoring Engine**: Kick off our two-layer pipeline:
  - **Rules Layer**: The system checks off basic criteria (like job title or industry match).
  - **AI Layer (LLM)**: The model reads the full context and generates a final High, Medium, or Low intent score, backed up by clear reasoning.
- **Check the Dashboard**: Get instant insights with a pie chart showing your intent distribution and a filterable table of all your scored leads.
- **Export Data**: Download all the final results to a CSV file to share with your team.

## 🏗️ How It's Built

The application is built using two separate, cooperating services:

### Backend (/backend)

- **The Brain**: This is the API service, typically running on Python/FastAPI.
- **Job**: It manages defining the offer, processing the CSV file, running the actual hybrid scoring logic, and talking to the LLM (like Gemini).

### Frontend (/frontend)

- **The Interface**: This is a modern single-page application built with React, TypeScript, Vite, and Tailwind CSS.
- **Job**: It gives you a clean UI for inputting data, triggering the scoring, and beautifully displaying the results. We use Zustand for easy state management.

## ⚙️ Getting Started (Setup)

### Prerequisites

You'll need these installed on your machine:

- Node.js (LTS version)
- Python (3.9+)
- An API Key for your LLM (e.g., your Gemini API Key)

---

### 1. Backend Setup

Hop into the backend folder:

```bash
cd backend
```

Set up your Python environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use .\venv\Scripts\activate
```

Install all the necessary Python packages:

```bash
pip install -r requirements.txt
```

Configure Your LLM Key:  
Create a file named `.env` in the `/backend` directory and paste your API key inside.

```env
# .env in /backend
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

Start the server:

```bash
uvicorn main:app --reload
```

It will start running at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

### 2. Frontend Setup

Hop into the frontend folder:

```bash
cd frontend
```

Install the Node packages:

```bash
npm install
```

Configure the Backend Link:  
Create a `.env` file in the `/frontend` directory to tell the app where to find your API.

```env
# .env in /frontend
VITE_API_URL="http://127.0.0.1:8000"
```

> Note: Remember to update this URL before deploying!

Start the local app:

```bash
npm run dev
```

Your app will open in your browser, typically at [http://localhost:5173](http://localhost:5173).

---

## 🔗 Key API Endpoints

The frontend talks to these four main endpoints on the backend:

| Endpoint       | Method | Used By            | Description                                      |
|----------------|--------|--------------------|--------------------------------------------------|
| `/offer`       | POST   | OfferForm.tsx      | Submits the product/offer context.               |
| `/leads/upload`| POST   | LeadUpload.tsx     | Uploads the CSV file containing leads.           |
| `/score`       | POST   | RunScoring.tsx     | Triggers the entire scoring process (rules + AI).|
| `/results`     | GET    | ResultsDashboard.tsx| Fetches the final JSON array of scored leads.   |

---

## 🌐 Live Deployment Links



| Service       | Host                | Live Link                     |
|---------------|---------------------|-------------------------------|
| Frontend      | Vercel      | [Link](https://k-score.vercel.app/)      |
| Backend API   | Render | [Link](https://k-score-backend.onrender.com)  |
