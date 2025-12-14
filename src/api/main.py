from fastapi import FastAPI
from src.api.routers import image, audio, batch

app = FastAPI(
    title="Musical Instrument Classifier API",
    description="API for classifying musical instruments from images and audio.",
    version="1.0.0"
)

# Include Routers
app.include_router(image.router)
app.include_router(audio.router)
app.include_router(batch.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Musical Instrument Classifier API"}
