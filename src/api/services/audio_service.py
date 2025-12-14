import os
import tempfile
import numpy as np
import shutil
from fastapi import UploadFile, HTTPException
from src.api.dependencies import ModelManager
from src.api.schemas.prediction import PredictionResult
from utils.embedding_extraction import extract_embedding

async def predict_audio(file: UploadFile, manager: ModelManager) -> PredictionResult:
    if not manager.audio_model:
        raise HTTPException(status_code=503, detail="Audio model not loaded")

    # Create a temporary file to save the uploaded audio
    # extract_embedding requires a file path
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # Extract embedding (YAMNet)
        embedding = extract_embedding(tmp_path)
        
        if embedding is None:
            raise HTTPException(status_code=400, detail="Could not extract features from audio file")
            
        # Reshape and Scale
        # Embedding is (1024,), need (1, 1024) for scaler and model
        embedding_reshaped = embedding.reshape(1, -1)
        
        if manager.audio_scaler:
            embedding_scaled = manager.audio_scaler.transform(embedding_reshaped)
        else:
            embedding_scaled = embedding_reshaped
            
        # Predict
        predictions = manager.audio_model.predict(embedding_scaled)
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions))
        
        # Decode label
        if manager.audio_label_encoder:
            label = manager.audio_label_encoder.inverse_transform([predicted_index])[0]
        else:
            label = str(predicted_index)
            
        return PredictionResult(
            filename=file.filename,
            media_type="audio",
            predicted_label=label,
            confidence=confidence
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
        
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
