import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras import layers, models, optimizers

def build_resnet50_model(num_classes, input_shape=(224, 224, 3)):
    """
    Builds a transfer learning model using ResNet50 as the base.
    
    Args:
        num_classes (int): Number of output classes.
        input_shape (tuple): Input image shape.
        
    Returns:
        tf.keras.Model: Compiled Keras model.
    """
    # 1. Load the ResNet50 base model (pre-trained on ImageNet)
    # include_top=False removes the final classification layer (1000 classes)
    base_model = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=input_shape
    )
    
    # 2. Freeze the base model weights
    # We don't want to update these weights during the initial training
    base_model.trainable = False
    
    # 3. Create the new model on top
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.2), # Regularization to prevent overfitting
        layers.Dense(num_classes, activation='softmax')
    ])
    
    # 4. Compile the model
    model.compile(
        optimizer=optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model
