import pandas as pd
from config.constants import PROCESSED_AUDIO_DATA_DIR

INPUT_CSV = PROCESSED_AUDIO_DATA_DIR / "instruments.csv"
OUTPUT_REMAINING = PROCESSED_AUDIO_DATA_DIR / "remaining.csv"
OUTPUT_SELECTED = PROCESSED_AUDIO_DATA_DIR / "selected.csv"
SAMPLES_PER_LABEL = 2

# Read CSV
df = pd.read_csv(INPUT_CSV)

selected_rows = []
remaining_rows = []

# Group by label
for label, group in df.groupby("label"):
    if len(group) < SAMPLES_PER_LABEL:
        raise ValueError(f"Label '{label}' has less than {SAMPLES_PER_LABEL} rows")

    # Randomly select rows
    selected = group.sample(n=SAMPLES_PER_LABEL, random_state=None)
    remaining = group.drop(selected.index)

    selected_rows.append(selected)
    remaining_rows.append(remaining)

# Concatenate results
df_selected = pd.concat(selected_rows).reset_index(drop=True)
df_remaining = pd.concat(remaining_rows).reset_index(drop=True)

# Save to CSV
df_selected.to_csv(OUTPUT_SELECTED, index=False)
df_remaining.to_csv(OUTPUT_REMAINING, index=False)

print("Done!")
print(f"Selected rows saved to: {OUTPUT_SELECTED}")
print(f"Remaining rows saved to: {OUTPUT_REMAINING}")


