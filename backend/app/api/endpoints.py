import io
from fastapi import APIRouter

router = APIRouter()

# ---- POST /offer -----
@router.post("/offer", status_code=201)
async def set_offer_context():
    return {"message": "set offer endpoint"}

# ---- POST /leads/upload -----
@router.post("/leads/upload", status_code=201)
async def upload_leads_csv():
    return {"message": "leads upload endpoint"}

# ---- POST /score -----
@router.post("/score")
async def process_and_score_leads():
    return {"message" : "score endpoint"}

# ---- GET /results -----
@router.get("/results")
async def get_all_results():
    return {"message" : "results endpoint"}