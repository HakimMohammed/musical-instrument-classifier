import json
import pandas as pd
from config.constants import RAW_AUDIO_DATA_DIR, PROCESSED_AUDIO_DATA_DIR


def generate_instrument_csv():
    output_csv_path = PROCESSED_AUDIO_DATA_DIR / "instruments.csv"

    # Ensure the output directory exists
    PROCESSED_AUDIO_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # List to store the extracted data
    data_records = []

    # The folders to iterate over
    folders = ['train', 'test', 'valid']

    print(f"Scanning directories in {RAW_AUDIO_DATA_DIR}...")

    for folder in folders:
        json_path = RAW_AUDIO_DATA_DIR / folder / "examples.json"

        if not json_path.exists():
            print(f"Warning: {json_path} not found. Skipping.")
            continue

        print(f"Processing {folder}...")

        try:
            with open(json_path, 'r') as f:
                content = json.load(f)

            for filename_key, metadata in content.items():
                source = metadata.get("instrument_source_str", "unknown")
                family = metadata.get("instrument_family_str", "unknown")
                class_name = f"{source} {family}"

                data_records.append({
                    "filename": filename_key,
                    "class": class_name
                })

        except json.JSONDecodeError:
            print(f"Error: Failed to decode JSON in {folder}")

    df = pd.DataFrame(data_records)

    df.to_csv(output_csv_path, index=True, index_label='index')

    print(f"Successfully generated {output_csv_path}")
    print(f"Total records: {len(df)}")
    print("\nPreview:")
    print(df.head())