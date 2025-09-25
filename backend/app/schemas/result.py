from pydantic import BaseModel

class ResultDisplay(BaseModel):
    name: str
    role: str
    company: str
    industry : str
    intent: str
    score: float
    reasoning: str
    rules_score: float
    ai_points: float

    class Config:
        from_attributes = True