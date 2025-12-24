from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import image, audio, batch

app = FastAPI(
    title="Musical Instrument Classifier API",
    description="API for classifying musical instruments from images and audio.",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # React default port
    "http://localhost",       # Docker nginx (port 80)
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1",       # Docker nginx (port 80)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(image.router)
app.include_router(audio.router)
app.include_router(batch.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Musical Instrument Classifier API"}
