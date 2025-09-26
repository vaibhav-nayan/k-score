export type Offer = {
  name: string;
  value_props: string;
  ideal_use_cases: string;
};

export type Lead = {
  id: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  location?: string;
  linkedin_bio?: string;
};

export type Result = Lead & { 
    offer_id: number;
    intent: Intent;
    score: number;
    reasoning: string;
    rules_score: number;
    ai_points: number;
};

export type Intent = "All" | "High" | "Medium" | "Low";