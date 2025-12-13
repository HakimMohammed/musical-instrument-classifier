import numpy as np
from sklearn.utils import class_weight

def calculate_class_weights(y_train_indices):
    """
    Calculates class weights to handle dataset imbalance.
    
    Args:
        y_train_indices (array-like): Array of class indices (integers) for the training set.
        
    Returns:
        dict: A dictionary mapping class index to weight.
    """
    # Get unique classes
    classes = np.unique(y_train_indices)
    
    # Calculate weights using sklearn
    # 'balanced' mode automatically adjusts weights inversely proportional to class frequencies
    weights = class_weight.compute_class_weight(
        class_weight='balanced',
        classes=classes,
        y=y_train_indices
    )
    
    # Convert to dictionary format required by Keras
    class_weight_dict = dict(zip(classes, weights))
    
    return class_weight_dict
