import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from sqlalchemy import select, delete
from app.schemas.offer import OfferCreate
from app.db.models import Offer, Lead, Result
import pandas as pd

router = APIRouter()

# ---- POST /offer -----
@router.post("/offer", status_code=201)
async def set_offer_context(offer_data: OfferCreate, db: AsyncSession = Depends(get_db)):

    await db.execute(delete(Offer))

    new_offer = Offer(**offer_data.model_dump())
    db.add(new_offer)
    await db.commit()
    return {"message": "Offer context saved successfully", "offer_id" : new_offer.id}

# ---- POST /leads/upload -----
@router.post("/leads/upload", status_code=201)
async def upload_leads_csv(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):

    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Must be a CSV file.")
    
    try:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))

        required_cols = {'name', 'role', 'company', 'industry', 'location', 'linkedin_bio'}
        if not required_cols.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"CSV must contain: {', '.join(required_cols)}")

        await db.execute(delete(Lead))

        leads_to_insert = []
        for index, row in df.iterrows():
            leads_to_insert.append(Lead(
                name=row['name'],
                role=row['role'],
                company=row['company'],
                industry=row['industry'],
                location=row['location'],
                linkedin_bio=row['linkedin_bio']
            ))

        db.add_all(leads_to_insert)
        await db.commit()

        return {"message" : f"Successfully uploaded and stored {len(leads_to_insert)} leads"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lead upload failed: {e}")
    

# ---- POST /score -----
@router.post("/score")
async def process_and_score_leads(db: AsyncSession = Depends(get_db)):

    try:
        # count = await run_scoring_pipeline(db)
        count = 1
        return {"message": f"Scoring complete. {count} leads processed.", "processed_count": count}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {e}")

# ---- GET /results -----
@router.get("/results")
async def get_all_results(db: AsyncSession = Depends(get_db)):
    stmt = select(Result)
    results = (await db.execute(stmt)).scalars().all()
    return results