import OfferForm from "./components/OfferForm.tsx";
import LeadUpload from "./components/LeadUpload.tsx";
import RunScoring from "./components/RunScoring";
import ResultsDashboard from "./components/ResultsDashboard.tsx";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl pb-2 md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                    AI-Powered Lead Scoring App
                </h1>
                <p className="mt-2 text-lg text-gray-500">Evaluate lead fit using rules and AI (Made for Kuvaka)</p>
            </header>

            <main className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* 1. Offer Form (Full Width Row) */}
                <div>
                    <OfferForm />
                </div>
                
                {/* 2. Lead Upload and Scoring Trigger (Two-Column Row) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LeadUpload />
                    <RunScoring />
                </div>
                
                {/* 3. Results Dashboard (Full Width Row) */}
                <ResultsDashboard />
            </main>
        </div>
  );
}

export default App;