from pydantic import BaseModel
from typing import List, Optional

class PredictionResult(BaseModel):
    filename: str
    media_type: str  # "audio" or "image"
    predicted_label: str
    confidence: float
    
class BatchPredictionResponse(BaseModel):
    results: List[PredictionResult]
    total_processed: int
    success_count: int
    error_count: int
