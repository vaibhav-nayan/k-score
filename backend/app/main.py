from fastapi import FastAPI
from app.api import endpoints
from app.db.database import init_db
from app.db import models

async def lifespan(app: FastAPI):
    #Startup
    print("Initializing database...")
    await init_db()

    #run app
    yield

    #Shutdown
    print("Closing application..")

app = FastAPI(lifespan=lifespan)

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status":"ok", "service": "started"}