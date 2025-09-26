from fastapi import FastAPI
from app.api import endpoints
from app.db.database import init_db
from app.db import models
from fastapi.middleware.cors import CORSMiddleware

async def lifespan(app: FastAPI):
    #Startup
    print("Initializing database...")
    await init_db()

    #run app
    yield

    #Shutdown
    print("Closing application..")

    #close db
    print("Closing database...")
    await models.db.close()
    print("Database closed.")

origins = [
    "http://localhost:5173"
]

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status":"ok", "service": "started"}