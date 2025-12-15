import tensorflow as tf
import pickle
from src.api.config import (
    IMAGE_MODEL_PATH, IMAGE_INDICES_PATH,
    AUDIO_MODEL_PATH, AUDIO_LABEL_ENCODER_PATH, AUDIO_SCALER_PATH
)

class ModelManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance.load_models()
        return cls._instance
    
    def load_models(self):
        print("Loading models...")
        
        # 1. Load Image Model & Indices
        try:
            self.image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH, compile=False)
            with open(IMAGE_INDICES_PATH, 'rb') as f:
                self.image_indices = pickle.load(f)
            
            # Invert indices to map Model Output Index -> Class Name
            # Loaded: {'guitar': 0, 'piano': 1}
            # Needed: {0: 'guitar', 1: 'piano'}
            self.image_labels = {v: k for k, v in self.image_indices.items()}
            print("✅ Image model loaded.")
        except Exception as e:
            print(f"❌ Failed to load image model: {e}")
            self.image_model = None

        # 2. Load Audio Model, Label Encoder, Scaler
        try:
            self.audio_model = tf.keras.models.load_model(AUDIO_MODEL_PATH, compile=False)
            
            with open(AUDIO_LABEL_ENCODER_PATH, 'rb') as f:
                self.audio_label_encoder = pickle.load(f)
                
            with open(AUDIO_SCALER_PATH, 'rb') as f:
                self.audio_scaler = pickle.load(f)
                
            print("✅ Audio model loaded.")
        except Exception as e:
            print(f"❌ Failed to load audio model: {e}")
            self.audio_model = None

model_manager = ModelManager()

def get_model_manager():
    return model_manager
