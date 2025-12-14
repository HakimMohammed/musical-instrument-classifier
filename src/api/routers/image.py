from fastapi import APIRouter, UploadFile, File, Depends
from src.api.dependencies import get_model_manager, ModelManager
from src.api.services.image_service import predict_image
from src.api.schemas.prediction import PredictionResult

router = APIRouter(
    prefix="/predict/image",
    tags=["Image Prediction"]
)

@router.post("/", response_model=PredictionResult)
async def predict_image_endpoint(
    file: UploadFile = File(...),
    manager: ModelManager = Depends(get_model_manager)
):
    """
    Predict the class of a musical instrument from an image file.
    """
    return await predict_image(file, manager)
