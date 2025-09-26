import React, { useState } from "react";
import useAppStore from "../store/useAppStore";
import { apiFetch } from "../utils/api";
import type { Offer } from "../types.ts";

export default function OfferForm() {
  const setOffer = useAppStore((s: any) => s.setOffer);
  const currentOffer = useAppStore((s: any) => s.offer);
  const [message, setMessage] = useState<string | null>(null);
  
  const [form, setForm] = useState<Offer>(currentOffer || {
    name: "",
    value_props: "",
    ideal_use_cases: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await apiFetch("/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOffer(form);

    console.log("Offer submitted:", form);
  };

  return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-xl shadow-2xl border-t-4 border-purple-500 flex flex-col gap-6"
        >
            <h2 className="text-xl font-semibold text-gray-700">1. Define Product Offer </h2>
            
            {message && (
                <div className={`p-3 text-sm rounded ${message.startsWith("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Product Name Input Group */}
            <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                </label>
                <input
                    id="product-name"
                    className="w-full border-gray-300 border p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 hover:border-purple-300"
                    placeholder="e.g., Automated Insight Platform"
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </div>
            
            {/* Value Propositions Input Group */}
            <div>
                <label htmlFor="value-props" className="block text-sm font-medium text-gray-700 mb-1">
                    Value Propositions
                </label>
                <textarea
                    id="value-props"
                    className="w-full border-gray-300 border p-3 rounded-lg resize-none h-28 shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 hover:border-purple-300"
                    placeholder="Describe key benefits (e.g., automated reporting, 24/7 support, 99.9% uptime guarantee)"
                    value={form.value_props}
                    required
                    onChange={(e) => setForm({ ...form, value_props: e.target.value })}
                />
            </div>

            {/* Ideal Use Cases Input Group */}
            <div>
                <label htmlFor="use-cases" className="block text-sm font-medium text-gray-700 mb-1">
                    Ideal Use Cases / Industry
                </label>
                <textarea
                    id="use-cases"
                    className="w-full border-gray-300 border p-3 rounded-lg resize-none h-28 shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 hover:border-purple-300"
                    placeholder="Specify ideal customers (e.g., highly regulated finance sector, mid-market SaaS companies, companies with 500+ employees)"
                    value={form.ideal_use_cases}
                    required
                    onChange={(e) => setForm({ ...form, ideal_use_cases: e.target.value })}
                />
            </div>

            <button
                type="submit"
                className="bg-purple-600 text-white font-medium rounded-lg p-3 hover:bg-purple-700 transition duration-200 shadow-xl mt-2"
            >
                Submit Offer Context
            </button>
        </form>
    );
}
