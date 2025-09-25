from sqlalchemy import select, delete
from app.db.models import Offer, Lead, Result
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.rule_engine import calculate_rule_score
from app.services.ai_service import get_ai_score

async def run_scoring_pipeline(db : AsyncSession) -> int:
    """Fetches leads and offer, applies scoring, and saves results."""

    offer_stmt = select(Offer).limit(1)
    offer = (await db.execute(offer_stmt)).scalars().first()

    if not offer:
        raise ValueError("Offer context must be set before scoring.")
    
    leads_stmt = select(Lead)
    leads = (await db.execute(leads_stmt)).scalars().all()

    if not leads:
        return 0
    
    await db.execute(delete(Result))

    new_results = []
    for lead in leads:

        rules_score = calculate_rule_score(lead, offer)
        ai_points, intent, reasoning = get_ai_score(lead, offer)

        final_score = rules_score + ai_points

        new_results.append(Result(
            lead_id = lead.id,
            offer_id = offer.id,
            name = lead.name,
            role = lead.role,
            company = lead.company,
            industry = lead.industry,
            intent = intent,
            score = round(final_score, 2),
            reasoning = reasoning,
            rules_score = rules_score,
            ai_points = ai_points
        ))

    try:
        db.add_all(new_results)
        await db.flush()
        await db.commit()
    except Exception as e:
        await db.rollback()
        print(f"DB insert failed: {e}")
        raise

    return len(new_results)
        