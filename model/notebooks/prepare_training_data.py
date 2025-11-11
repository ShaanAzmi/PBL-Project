"""
Prepare training data for improved model
Extracts data from existing files
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

print("📂 Loading processed data...")

# Load the cleaned weekly data
df = pd.read_csv('../data/processed/disease_outbreaks_weekly_clean.csv')
print(f"✅ Loaded {len(df):,} records")
print(f"📋 Columns: {df.columns.tolist()}")

# Create region_disease column
df['region'] = df['state_ut'].astype(str) + '_' + df['district'].astype(str)
df['disease'] = df['disease_clean']

# Sort by date
df['date'] = pd.to_datetime(df['date_final'])
df = df.sort_values('date')

print(f"📊 Unique regions: {df['region'].nunique()}")
print(f"📊 Unique diseases: {df['disease'].nunique()}")

# Encode regions and diseases
region_encoder = LabelEncoder()
disease_encoder = LabelEncoder()

df['region_idx'] = region_encoder.fit_transform(df['region'])
df['disease_idx'] = disease_encoder.fit_transform(df['disease'])

# Log transform cases
df['cases_log'] = np.log1p(df['num_cases'].fillna(0))

print("\n🔧 Creating sequences...")

# Create sequences
sequence_length = 14
sequences = []
targets = []
regions = []
diseases = []
temporal_features = []

# Group by region and disease
grouped = df.groupby(['region_idx', 'disease_idx'])

for (region_idx, disease_idx), group in grouped:
    group = group.sort_values('date')
    cases_values = group['cases_log'].values
    dates = group['date'].values
    
    # Skip if too few data points
    if len(cases_values) < sequence_length + 1:
        continue
    
    # Create sliding windows
    for i in range(len(cases_values) - sequence_length):
        seq = cases_values[i:i+sequence_length]
        target = cases_values[i+sequence_length]
        
        # Filter: skip if all zeros in sequence AND target is zero
        if np.sum(seq) == 0 and target == 0:
            continue
        
        # Extract temporal features from target date
        target_date = pd.Timestamp(dates[i+sequence_length])
        
        month = target_date.month
        day_of_year = target_date.dayofyear
        year = target_date.year
        
        # Cyclical encoding
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        day_sin = np.sin(2 * np.pi * day_of_year / 365)
        day_cos = np.cos(2 * np.pi * day_of_year / 365)
        year_norm = (year - 2009) / 16  # Normalize to 0-1
        
        temporal = np.array([month_sin, month_cos, day_sin, day_cos, year_norm])
        
        sequences.append(seq)
        targets.append(target)
        regions.append(region_idx)
        diseases.append(disease_idx)
        temporal_features.append(temporal)

# Convert to arrays
X = np.array(sequences, dtype=np.float32)
y = np.array(targets, dtype=np.float32)
region_idx_arr = np.array(regions, dtype=np.int64)
disease_idx_arr = np.array(diseases, dtype=np.int64)
temporal_arr = np.array(temporal_features, dtype=np.float32)

print(f"✅ Created {len(X):,} sequences")
print(f"   Sequence shape: {X.shape}")
print(f"   Target shape: {y.shape}")
print(f"   Non-zero targets: {np.sum(y > 0):,} ({np.sum(y > 0)/len(y)*100:.1f}%)")

# Train/validation split (80/20 time-based)
split_idx = int(len(X) * 0.8)

X_train = X[:split_idx]
X_val = X[split_idx:]
y_train = y[:split_idx]
y_val = y[split_idx:]
region_train = region_idx_arr[:split_idx]
region_val = region_idx_arr[split_idx:]
disease_train = disease_idx_arr[:split_idx]
disease_val = disease_idx_arr[split_idx:]
temporal_train = temporal_arr[:split_idx]
temporal_val = temporal_arr[split_idx:]

print(f"\n📊 Train/Val Split:")
print(f"   Train: {len(X_train):,} sequences")
print(f"   Val: {len(X_val):,} sequences")

# Save training data
print("\n💾 Saving training data...")

training_data = {
    'X_train': X_train,
    'X_val': X_val,
    'y_train': y_train,
    'y_val': y_val,
    'region_train': region_train,
    'region_val': region_val,
    'disease_train': disease_train,
    'disease_val': disease_val,
    'temporal_train': temporal_train,
    'temporal_val': temporal_val
}

with open('../models/training_data.pkl', 'wb') as f:
    pickle.dump(training_data, f)

print("✅ Saved to models/training_data.pkl")

# Save encoders
print("\n💾 Updating encoders...")

encoders = {
    'region': region_encoder,
    'disease': disease_encoder
}

with open('../models/feature_encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)

print("✅ Saved to models/feature_encoders.pkl")

print("\n🎉 Data preparation complete!")
print(f"📊 Summary:")
print(f"   Total sequences: {len(X):,}")
print(f"   Training: {len(X_train):,}")
print(f"   Validation: {len(X_val):,}")
print(f"   Regions: {len(region_encoder.classes_)}")
print(f"   Diseases: {len(disease_encoder.classes_)}")
print(f"\n✅ Ready to train! Run: python train_improved_model.py")
