from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent

DATA_DIR = ROOT_DIR / "data"
# -- Audio
AUDIO_DATA_DIR = DATA_DIR / "audio"
SEPARATED_AUDIO_DATA_DIR = AUDIO_DATA_DIR / "separated"
RAW_AUDIO_DATA_DIR = AUDIO_DATA_DIR / "raw"
PROCESSED_AUDIO_DATA_DIR = AUDIO_DATA_DIR / "processed"
CLEANED_AUDIO_DATA_DIR = PROCESSED_AUDIO_DATA_DIR / "clean"



MODELS_DIR = ROOT_DIR / "models"

# -- Data Cleaning
THRESHOLD= 0.03