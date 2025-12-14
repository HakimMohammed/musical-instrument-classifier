from fastapi import APIRouter, UploadFile, File, Depends
from src.api.dependencies import get_model_manager, ModelManager
from src.api.services.audio_service import predict_audio
from src.api.schemas.prediction import PredictionResult

router = APIRouter(
    prefix="/predict/audio",
    tags=["Audio Prediction"]
)

@router.post("/", response_model=PredictionResult)
async def predict_audio_endpoint(
    file: UploadFile = File(...),
    manager: ModelManager = Depends(get_model_manager)
):
    """
    Predict the class of a musical instrument from an audio file (WAV).
    """
    return await predict_audio(file, manager)
