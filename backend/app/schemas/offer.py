from pydantic import BaseModel

class OfferCreate(BaseModel):
    name: str
    value_props: str
    ideal_use_cases: str
