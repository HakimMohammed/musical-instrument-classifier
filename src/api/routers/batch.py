from typing import List
from fastapi import APIRouter, UploadFile, File, Depends
from src.api.dependencies import get_model_manager, ModelManager
from src.api.services.image_service import predict_image
from src.api.services.audio_service import predict_audio
from src.api.schemas.prediction import BatchPredictionResponse, PredictionResult

router = APIRouter(
    prefix="/predict/batch",
    tags=["Batch Prediction"]
)

@router.post("/image", response_model=BatchPredictionResponse)
async def batch_predict_image(
    files: List[UploadFile] = File(...),
    manager: ModelManager = Depends(get_model_manager)
):
    results = []
    success_count = 0
    error_count = 0
    
    for file in files:
        try:
            result = await predict_image(file, manager)
            results.append(result)
            success_count += 1
        except Exception:
            # Log error if needed
            results.append(PredictionResult(
                filename=file.filename,
                media_type="image",
                predicted_label="Error",
                confidence=0.0
            ))
            error_count += 1
            
    return BatchPredictionResponse(
        results=results,
        total_processed=len(files),
        success_count=success_count,
        error_count=error_count
    )

@router.post("/audio", response_model=BatchPredictionResponse)
async def batch_predict_audio(
    files: List[UploadFile] = File(...),
    manager: ModelManager = Depends(get_model_manager)
):
    results = []
    success_count = 0
    error_count = 0
    
    for file in files:
        try:
            result = await predict_audio(file, manager)
            results.append(result)
            success_count += 1
        except Exception:
            results.append(PredictionResult(
                filename=file.filename,
                media_type="audio",
                predicted_label="Error",
                confidence=0.0
            ))
            error_count += 1
            
    return BatchPredictionResponse(
        results=results,
        total_processed=len(files),
        success_count=success_count,
        error_count=error_count
    )
