import { create } from "zustand";
import type { Offer, Lead, Result } from "../types";

type AppState = {
  // Data States
  offer: Offer | null;
  leads: Lead[];
  results: Result[];
  filter: "All" | "High" | "Medium" | "Low";
  
  isScoring: boolean; 

  setOffer: (offer: Offer) => void;
  setLeads: (leads: Lead[]) => void;
  setResults: (results: Result[]) => void;
  setFilter: (filter: "All" | "High" | "Medium" | "Low") => void;

  setIsScoring: (isScoring: boolean) => void; 
};

const useAppStore = create<AppState>((set) => ({
  offer: null,
  leads: [],
  results: [],
  filter: "All",
  
  isScoring: false, 

  setOffer: (offer) => set({ offer }),
  setLeads: (leads) => set({ leads }),
  setResults: (results) => set({ results }),
  setFilter: (filter) => set({ filter }),
  setIsScoring: (isScoring) => set({ isScoring }),
}));

export default useAppStore;
