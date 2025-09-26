import useAppStore from "../store/useAppStore";
import type { Result} from "../types";

import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function RunScoring() {
    const { offer, leads, isScoring, setIsScoring, setResults } = useAppStore((s: any) => s);
    const [message, setMessage] = useState<string | null>(null);

    const handleScore = async () => {
        if (!offer) {
            setMessage("Error: Please submit the Offer Context first.");
            return;
        }
        if (!Array.isArray(leads) || leads.length === 0) {
            setMessage("Error: Please upload leads first.");
            return;
        }

        setIsScoring(true);
        setMessage("Running scoring pipeline...");
      
        try {
            await apiFetch<{ message: string }>("/score", {
                method: "POST"
            });

            const data = await apiFetch<Result[]>("/results");

            setResults(data || []);
            setMessage(`Scoring complete! ${data.length} results loaded.`);
        } catch (error) {
            setMessage(`Scoring failed: ${error instanceof Error ? error.message : "unknown error"}`);
            console.error(error);
        } finally {
            setIsScoring(false);
        }
    };
    const leadsLoadedCount = Array.isArray(leads) ? leads.length : 0;
    const isOfferLoaded = !!offer;

    // const isReady = !!offer && Array.isArray(leads) && leads.length > 0;
    const isReady = isOfferLoaded && leadsLoadedCount > 0;
    const buttonText = isScoring 
        ? "Processing Scores..." 
        : isReady 
        ? `Run Scoring Pipeline (${leads.length} Leads)` 
        : "Awaiting Offer/Leads...";

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-green-500 flex flex-col gap-4 h-full">
            <h2 className="text-xl font-semibold text-gray-700">3. Calculate Scores</h2>
            
            {/* STATUS INDICATORS */}
            <div className="flex flex-col space-y-2 text-sm p-3 bg-gray-50 rounded-lg border">
                <p className={isOfferLoaded ? 'text-green-600 font-medium flex items-center' : 'text-red-500 flex items-center'}>
                    <span className="mr-2">{isOfferLoaded ? '✅' : '❌'}</span>
                    Offer Status: {isOfferLoaded ? offer.name : 'Missing'}
                </p>
                <p className={leadsLoadedCount > 0 ? 'text-green-600 font-medium flex items-center' : 'text-red-500 flex items-center'}>
                    <span className="mr-2">{leadsLoadedCount > 0 ? '✅' : '❌'}</span>
                    Leads Loaded: {leadsLoadedCount}
                </p>
            </div>
            
            {message && (
                <div className={`p-3 text-sm rounded ${message.startsWith("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            
            {/* The scoring button is now pushed to the bottom to fill remaining height */}
            <div className="flex-grow flex items-end">
                <button
                    onClick={handleScore}
                    disabled={isScoring || !isReady}
                    className={`p-3 text-lg font-bold rounded-lg transition duration-200 shadow-xl w-full ${
                        isScoring
                            ? 'bg-gray-400 cursor-not-allowed flex items-center justify-center'
                            : isReady
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                >
                    {isScoring && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    )}
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
