import numpy as np
import io
from fastapi import UploadFile, HTTPException
from src.api.dependencies import ModelManager
from src.api.schemas.prediction import PredictionResult
from utils.image_processing import preprocess_image

async def predict_image(file: UploadFile, manager: ModelManager) -> PredictionResult:
    if not manager.image_model:
        raise HTTPException(status_code=503, detail="Image model not loaded")

    try:
        # Read image
        contents = await file.read()
        
        # Use the shared preprocessing function
        # We pass a BytesIO object which acts like a file, compatible with load_img (via PIL)
        img_array = preprocess_image(io.BytesIO(contents))
        
        if img_array is None:
             raise HTTPException(status_code=400, detail="Failed to preprocess image")
        
        # Predict
        predictions = manager.image_model.predict(img_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions))
        
        # Get label
        label = manager.image_labels.get(predicted_index, "Unknown")
        
        return PredictionResult(
            filename=file.filename,
            media_type="image",
            predicted_label=label,
            confidence=confidence
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
