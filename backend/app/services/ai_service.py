from app.db.models import Offer, Lead
from google import genai
from google.genai import types
from google.genai.errors import APIError
import json
import os
from dotenv import load_dotenv
from pydantic import BaseModel

class Res(BaseModel):
    intent: str
    reasoning: str

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

INTENT_MAP = {"High" : 50.0, "Medium" : 30.0, "Low": 10.0}

def get_ai_score(lead: Lead, offer: Offer) -> tuple[float, str, str]:

    default_intent = "Low"
    default_points = INTENT_MAP[default_intent]
    default_reasoning = "AI scoring failed or response was invalid."
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        prompt = f"""
        Analyze the following lead data against the product offer context. Your goal is to determine the highest possible buying intent based on the fit.

        PRODUCT OFFER CONTEXT:
        - Product Name: {offer.name}
        - Value Proposition: {offer.value_props}
        - Ideal Use Cases/Industry: {offer.ideal_use_cases}

        PROSPECT LEAD DATA:
        - Name: {lead.name}, Role: {lead.role}, Company: {lead.company}
        - Industry: {lead.industry}, Location: {lead.location}
        - LinkedIn Bio/Summary: {lead.linkedin_bio if lead.linkedin_bio else 'N/A'}
        
        Determine the prospect's buying intent as 'High', 'Medium', or 'Low' based on the fit between the PROSPECT DATA and the PRODUCT OFFER.
        
        If the ROLE or INDUSTRY is a strong match to the 'Ideal Use Cases', select 'High'.
        If there is a partial match, select 'Medium'.
        If there is no discernible match, select 'Low'.
        
        Provide a concise reasoning (max 2 sentences) that explicitly states the alignment or misalignment.

        RESPOND IN JSON FORMAT ONLY. Do not include any other text or markdown:
        {{"intent" : "[High/Medium/Low]", "reasoning" : "[Short justification]"}}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type" : "application/json",
                "response_schema" : Res
            }
        )

        raw_text = response.text.strip().replace('```json', '').replace('```', '')
        
        try:
            parsed_json = json.loads(raw_text)
        except json.JSONDecodeError:
            print(f"AI Response was not valid JSON: {raw_text}")
            return default_points, default_intent, f"AI JSON Decode Error: {raw_text[:50]}..."
        
        intent_raw = parsed_json.get("intent", "").strip()
        intent = intent_raw if intent_raw in INTENT_MAP else default_intent
        reasoning = parsed_json.get("reasoning", default_reasoning)
        ai_points = INTENT_MAP.get(intent, default_points)

        return ai_points, intent, reasoning
    except APIError as e:
        print(f"AI API Call failed for lead {lead.id}: {e}")
        return default_points, default_intent, f"AI API Error: {type(e).__name__}"
    except Exception as e:
        print(f"Unexpected error in AI service: {e}")
        return default_points, default_intent, f"AI Unexpected Error: {type(e).__name__}"