from app.db.models import Lead, Offer

def calculate_rule_score(lead: Lead, offer: Offer) -> float:
    """Calculate the rule-based score (max 50 points)."""
    score = 0

    senior_keywords = ["VP", "Director", "Head of", "Chief", "C-", "Founder"]
    if any(k.lower() in lead.role.lower() for k in senior_keywords):
        score += 20
    
    if lead.industry and lead.industry.lower() in offer.ideal_use_cases.lower():
        score += 20
    
    if lead.linkedin_bio:
        score += 10

    return min(score, 50.0)