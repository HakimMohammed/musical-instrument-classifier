import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(PROJECT_ROOT))

from config.constants import IMAGE_MODELS_DIR, AUDIO_MODELS_DIR

# API Settings
API_HOST = "0.0.0.0"
API_PORT = 8000

# Model Paths
# Image
IMAGE_MODEL_PATH = IMAGE_MODELS_DIR / 'resnet50_instrument_classifier.keras'
IMAGE_INDICES_PATH = IMAGE_MODELS_DIR / 'image_class_indices.pkl'

# Audio
AUDIO_MODEL_PATH = AUDIO_MODELS_DIR / 'instrument_classifier.h5'
AUDIO_LABEL_ENCODER_PATH = AUDIO_MODELS_DIR / 'label_encoder.pkl'
AUDIO_SCALER_PATH = AUDIO_MODELS_DIR / 'scaler.pkl'
