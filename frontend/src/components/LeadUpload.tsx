import React, { useState} from "react";
import type { Lead } from "../types";
import useAppStore from "../store/useAppStore";
import { apiFetch } from "../utils/api";

export default function LeadUpload() {
  const [message, setMessage] = useState<string | null>(null);
  const setLeads = useAppStore((s: any) => s.setLeads);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const leadsCount = useAppStore(s => (Array.isArray(s.leads) ? s.leads.length : 0));

  const handleUpload = async (file: File) => {

    if (!file || file.type !== "text/csv") {
        setMessage("Please select a valid CSV file.");
        return;
    }

    setFileName(file.name);
    setIsUploading(true);
    
    try {
        const formData = new FormData();
            formData.append("file", file);

            const data = await apiFetch<{ leads: Lead[] }>("/leads/upload", {
                method: "POST",
                body: formData,
            });

            const uploadedLeads = data.leads || [];
            setLeads(uploadedLeads);
            setMessage(`Successfully uploaded ${uploadedLeads.length} leads.`);
    } catch (error) {
        setMessage(`Error during upload: ${error instanceof Error ? error.message : "unknown error"}`);
        console.error(error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
      // Reset file input to allow uploading the same file again if needed
      e.target.value = '';
  };

  const fileInputId = "lead-csv-upload";

  return (
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-yellow-500 flex flex-col gap-4 h-full">
            <h2 className="text-xl font-semibold text-gray-700">2. Upload Leads (CSV)</h2>
            
            {/* Status Badge - Updated to show file name */}
            <div className={`py-2 px-4 rounded-full text-sm font-medium text-center shadow-md border ${
                leadsCount > 0 ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}>
                {leadsCount > 0 && fileName ? 
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-base">{leadsCount} Leads Loaded</span>
                        <span className="truncate text-xs text-gray-600">File: {fileName}</span>
                    </div> : 
                    `${leadsCount} Leads Loaded`}
            </div>
            
            {message && (
                <div className={`p-3 text-sm rounded ${message.startsWith("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Upload Area - uses flex-grow to take up available height */}
            <label htmlFor={fileInputId} className="flex flex-col items-center justify-center w-full flex-grow border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-yellow-50 hover:border-yellow-500 transition duration-200">
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="text-sm text-gray-500 mt-3 font-semibold">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4.973V14a2 2 0 01-2 2h-6l-3-3m0 0l3-3m-3 3h12"></path></svg>
                        <p className="mb-1 text-base text-gray-700 font-semibold"><span className="text-yellow-600">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">CSV file required (Name, Role, Company, etc.)</p>
                    </div>
                )}
                <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
            </label>
        </div>
    );
}
