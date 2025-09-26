from fastapi import FastAPI
from app.api import endpoints
from app.db.database import init_db
from app.db import models
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

allowed_origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(',') if origin.strip()]

async def lifespan(app: FastAPI):
    #Startup
    print("Initializing database...")
    await init_db()

    #run app
    yield

    #Shutdown
    print("Closing application..")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status":"ok", "service": "started"}
