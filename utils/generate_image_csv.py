import os
import shutil
import pandas as pd
from tqdm import tqdm
from pathlib import Path
from config.constants import RAW_IMAGE_DATA_DIR, PROCESSED_IMAGE_DATA_DIR

def generate_image_csv():
    """
    Merges train/test/valid folders into a single directory and generates a master CSV.
    """
    # Source CSV
    RAW_CSV_PATH = RAW_IMAGE_DATA_DIR / "instruments.csv"

    # Destination Directory
    CLEAN_IMAGE_DIR = PROCESSED_IMAGE_DATA_DIR / "clean"
    PROCESSED_CSV_PATH = PROCESSED_IMAGE_DATA_DIR / "instruments.csv"

    print(f"Raw Data Directory: {RAW_IMAGE_DATA_DIR}")
    print(f"Clean Data Directory: {CLEAN_IMAGE_DIR}")

    # Create destination directory if it doesn't exist
    if not os.path.exists(CLEAN_IMAGE_DIR):
        os.makedirs(CLEAN_IMAGE_DIR)
        print(f"Created directory: {CLEAN_IMAGE_DIR}")
    else:
        print(f"Directory already exists: {CLEAN_IMAGE_DIR}")

    # Read the raw CSV
    if not os.path.exists(RAW_CSV_PATH):
        print(f"Error: Raw CSV not found at {RAW_CSV_PATH}")
        return

    df_raw = pd.read_csv(RAW_CSV_PATH)
    print(f"Total files in raw CSV: {len(df_raw)}")

    # Lists to store new metadata
    new_filenames = []
    new_labels = []

    print("Merging files...")
    for index, row in tqdm(df_raw.iterrows(), total=df_raw.shape[0]):
        # Original path components
        relative_path = row['filepaths'] # e.g., train/acordian/001.jpg
        label = row['labels']
        dataset_split = row['data set'] # train, test, or valid
        
        # Construct full source path
        src_path = RAW_IMAGE_DATA_DIR / relative_path
        
        # Construct new unique filename
        # e.g., train_acordian_001.jpg
        original_filename = os.path.basename(relative_path)
        new_filename = f"{dataset_split}_{label}_{original_filename}"
        
        # Construct full destination path
        dst_path = CLEAN_IMAGE_DIR / new_filename
        
        # Copy file
        if os.path.exists(src_path):
            if not os.path.exists(dst_path):
                shutil.copy2(src_path, dst_path)
            
            # Add to lists
            new_filenames.append(new_filename)
            new_labels.append(label)
        else:
            # print(f"Warning: Source file not found: {src_path}")
            pass

    # Create new DataFrame
    df_clean = pd.DataFrame({
        'filename': new_filenames,
        'label': new_labels
    })

    # Save to CSV
    df_clean.to_csv(PROCESSED_CSV_PATH, index=False)
    print(f"\nSuccessfully processed {len(df_clean)} images.")
    print(f"Saved master CSV to: {PROCESSED_CSV_PATH}")

if __name__ == "__main__":
    generate_image_csv()
