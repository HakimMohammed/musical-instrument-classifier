import librosa
import numpy as np
import tensorflow_hub as hub

yamnet_model_handle = 'https://tfhub.dev/google/yamnet/1'
yamnet_model = hub.load(yamnet_model_handle)

def extract_embedding(wav_file_path):
    # 1. Load audio at 16kHZ (Required by YAMNet)
    # y = audio, sr = sample rate
    try:
        wav_data, sr = librosa.load(wav_file_path, sr=16000)
    except Exception as e:
        print(f"Error loading {wav_file_path}: {e}")
        return None

    # 2. Check for silence/short files
    if len(wav_data) == 0:
        return None

    # 3. Normalization (map values between -1 and 1)
    # YAMNet expects normalized data
    max_val = np.max(np.abs(wav_data))
    if max_val > 0:
        wav_data = wav_data / max_val

    # 4. Run YAMNet
    # The model returns (scores, embeddings, spectrogram)
    # We only care about embeddings.
    scores, embeddings, spectrogram = yamnet_model(wav_data)

    # 5. Handle Lengths via Global Average Pooling
    # embeddings shape is (N, 1024), where N depends on file duration.
    # We take the mean across the N dimension to get one (1024,) vector.
    global_embedding = np.mean(embeddings, axis=0)

    return global_embedding