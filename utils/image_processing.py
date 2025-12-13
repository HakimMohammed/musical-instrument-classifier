import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input

def preprocess_image(image_path, target_size=(224, 224)):
    """
    Loads an image, resizes it, and applies ResNet50 preprocessing.
    This function is suitable for single image prediction (deployment).
    
    Args:
        image_path (str or Path): Path to the image file.
        target_size (tuple): Target size (height, width).
        
    Returns:
        np.array: Preprocessed image tensor with batch dimension (1, 224, 224, 3).
    """
    try:
        # Load image
        img = image.load_img(image_path, target_size=target_size)
        
        # Convert to array
        img_array = image.img_to_array(img)
        
        # Expand dimensions to match batch shape (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Apply ResNet50 preprocessing (zero-centering, etc.)
        img_preprocessed = preprocess_input(img_array)
        
        return img_preprocessed
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None

def get_image_generator(preprocessing_function=preprocess_input, validation_split=None):
    """
    Returns an ImageDataGenerator configured for the model.
    """
    return tf.keras.preprocessing.image.ImageDataGenerator(
        preprocessing_function=preprocessing_function,
        validation_split=validation_split
    )
