import matplotlib.pyplot as plt
import cv2
import pandas as pd
from pathlib import Path

def plot_class_distribution(df):
    """
    Plots the distribution of classes in the dataframe.
    """
    class_counts = df['label'].value_counts()

    plt.figure(figsize=(15, 6))
    class_counts.plot(kind='bar')
    plt.title('Distribution of Instrument Classes')
    plt.xlabel('Instrument')
    plt.ylabel('Number of Images')
    plt.xticks(rotation=45)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()

    print("\nClass Counts:")
    print(class_counts)

def plot_sample_images(df, image_dir, num_samples=1):
    """
    Plots sample images from each class.
    """
    classes = df['label'].unique()
    num_classes = len(classes)
    
    # Calculate grid size
    cols = 5
    rows = (num_classes + cols - 1) // cols
    
    plt.figure(figsize=(20, 4 * rows))
    
    for i, class_name in enumerate(classes):
        # Get a random image for this class
        sample_row = df[df['label'] == class_name].sample(1).iloc[0]
        img_path = image_dir / sample_row['filename']
        
        # Read image
        if img_path.exists():
            img = cv2.imread(str(img_path))
            if img is not None:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                
                plt.subplot(rows, cols, i + 1)
                plt.imshow(img)
                plt.title(class_name)
                plt.axis('off')
            else:
                print(f"Could not read image: {img_path}")
        else:
            print(f"Image path does not exist: {img_path}")
        
    plt.tight_layout()
    plt.show()
