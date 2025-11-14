"""
Quick Test: Compare Old vs New Model Predictions
Run this after training the improved model
"""

import torch
import numpy as np
import pandas as pd
import pickle
import sys
sys.path.append('..')

# Import both models
from notebooks.improved_model_v2 import ImprovedDiseaseLSTM

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load encoders and scalers
with open('../models/feature_encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

with open('../models/scaler_advanced.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Load old model (current)
print("📦 Loading OLD model...")
from api.app import AdvancedDiseaseLSTM

old_model = AdvancedDiseaseLSTM(
    num_regions=843,
    num_diseases=89,
    embedding_dim=32,
    hidden_size=128,
    num_layers=3,
    dropout=0.3
).to(device)

checkpoint = torch.load('../models/lstm_advanced_best.pt')
old_model.load_state_dict(checkpoint['model_state_dict'])
old_model.eval()
print(f"✅ Old model loaded (params: {sum(p.numel() for p in old_model.parameters()):,})")

# Load new model (improved) - Model 5 is the best
print("\n📦 Loading NEW model (Model 5 - Best)...")
new_model = ImprovedDiseaseLSTM(
    num_regions=985,  # Updated based on actual data
    num_diseases=129,  # Updated based on actual data
    embedding_dim=64,
    hidden_size=256,
    num_layers=5,
    num_heads=4,
    dropout=0.3
).to(device)

try:
    checkpoint = torch.load('../models/improved_lstm_v2_model5_best.pt')
    new_model.load_state_dict(checkpoint['model_state_dict'])
    new_model.eval()
    print(f"✅ New model loaded (params: {sum(p.numel() for p in new_model.parameters()):,})")
    print(f"📊 Best validation loss: 0.2355")
    print(f"📊 MAE: 6.62 cases, Median Error: 87.5%")
    new_model_available = True
except FileNotFoundError:
    print("⚠️  New model not found. Run train_improved_model.py first!")
    new_model_available = False


def predict_case(model, region, disease, last_14_days, date_str):
    """Make a prediction."""
    
    # Encode region and disease
    region_idx = encoders['region'].transform([region])[0]
    disease_idx = encoders['disease'].transform([disease])[0]
    
    # Parse date for temporal features
    date = pd.to_datetime(date_str)
    month = date.month
    day_of_year = date.dayofyear
    year = date.year
    
    # Temporal encoding
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    day_sin = np.sin(2 * np.pi * day_of_year / 365)
    day_cos = np.cos(2 * np.pi * day_of_year / 365)
    year_norm = (year - 2009) / 16  # Normalize years
    
    temporal = np.array([month_sin, month_cos, day_sin, day_cos, year_norm])
    
    # Log transform
    cases_log = np.log1p(last_14_days)
    
    # To tensors
    x = torch.FloatTensor(cases_log).unsqueeze(0).to(device)
    region_t = torch.LongTensor([region_idx]).to(device)
    disease_t = torch.LongTensor([disease_idx]).to(device)
    temporal_t = torch.FloatTensor(temporal).unsqueeze(0).to(device)
    
    # Predict
    with torch.no_grad():
        pred_log = model(x, region_t, disease_t, temporal_t)
        pred = np.expm1(pred_log.cpu().numpy()[0, 0])
    
    return pred


# Test cases
test_cases = [
    {
        'region': 'Andhra Pradesh_Alluri Sitharama Raju',
        'disease': 'Food Poisoning',
        'last_14_days': [0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        'actual': 8.0,
        'date': '2025-11-15'
    },
    {
        'region': 'Maharashtra_Mumbai',
        'disease': 'Dengue',
        'last_14_days': [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        'actual': 70.0,
        'date': '2025-11-15'
    },
    {
        'region': 'Karnataka_Bangalore',
        'disease': 'Chickenpox',
        'last_14_days': [5, 5, 6, 7, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30],
        'actual': 32.0,
        'date': '2025-11-15'
    },
    {
        'region': 'Tamil Nadu_Chennai',
        'disease': 'Acute Diarrheal Disease',
        'last_14_days': [20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0],
        'actual': 0.0,
        'date': '2025-11-15'
    }
]

print("\n" + "="*80)
print("🧪 COMPARISON: Old Model vs New Model")
print("="*80)

for i, case in enumerate(test_cases, 1):
    print(f"\n📋 Test Case {i}:")
    print(f"   Region: {case['region']}")
    print(f"   Disease: {case['disease']}")
    print(f"   Last 14 days: {case['last_14_days'][-5:]}... (showing last 5)")
    print(f"   Actual: {case['actual']:.1f} cases")
    
    # Old model prediction
    old_pred = predict_case(
        old_model,
        case['region'],
        case['disease'],
        case['last_14_days'],
        case['date']
    )
    old_error = abs(old_pred - case['actual']) / (case['actual'] + 1e-6) * 100
    
    print(f"\n   📊 OLD Model:")
    print(f"      Predicted: {old_pred:.1f} cases")
    print(f"      Error: {old_error:.1f}%")
    
    # New model prediction
    if new_model_available:
        new_pred = predict_case(
            new_model,
            case['region'],
            case['disease'],
            case['last_14_days'],
            case['date']
        )
        new_error = abs(new_pred - case['actual']) / (case['actual'] + 1e-6) * 100
        
        print(f"\n   ✨ NEW Model:")
        print(f"      Predicted: {new_pred:.1f} cases")
        print(f"      Error: {new_error:.1f}%")
        
        # Improvement
        improvement = old_error - new_error
        if improvement > 0:
            print(f"\n   ✅ Improvement: {improvement:.1f}% reduction")
        else:
            print(f"\n   ⚠️  Degradation: {abs(improvement):.1f}% increase")
    
    print("-" * 80)

if new_model_available:
    print("\n🎉 Comparison complete!")
    print("💡 If new model shows <50% error, it's ready for production!")
else:
    print("\n⚠️  Train the new model first:")
    print("   cd notebooks")
    print("   python train_improved_model.py")
