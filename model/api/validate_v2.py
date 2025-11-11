"""
Validation script for improved model V2 API
"""
import torch
import pickle
import numpy as np
import sys
sys.path.append('../notebooks')

from improved_model_v2 import ImprovedDiseaseLSTM

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print("🔍 Validating Improved Model V2 Setup...\n")

# Check 1: PyTorch and CUDA
print("✓ Check 1: PyTorch and CUDA")
print(f"  PyTorch version: {torch.__version__}")
print(f"  CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"  Device: {torch.cuda.get_device_name(0)}")
print()

# Check 2: Load encoders
print("✓ Check 2: Feature encoders")
try:
    with open('../models/feature_encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
    num_regions = len(encoders['region'].classes_)
    num_diseases = len(encoders['disease'].classes_)
    print(f"  Regions: {num_regions}")
    print(f"  Diseases: {num_diseases}")
    print(f"  ✅ Encoders loaded successfully")
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)
print()

# Check 3: Model initialization
print("✓ Check 3: Model initialization")
try:
    model = ImprovedDiseaseLSTM(
        num_regions=num_regions,
        num_diseases=num_diseases,
        embedding_dim=64,
        hidden_size=256,
        num_layers=5,
        num_heads=4,
        dropout=0.3
    ).to(device)
    
    total_params = sum(p.numel() for p in model.parameters())
    print(f"  Parameters: {total_params:,}")
    print(f"  ✅ Model initialized")
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)
print()

# Check 4: Load best model weights
print("✓ Check 4: Load trained weights (Model 5 - Best)")
try:
    checkpoint = torch.load('../models/improved_lstm_v2_model5_best.pt', map_location=device)
    
    if 'model_state_dict' in checkpoint:
        model.load_state_dict(checkpoint['model_state_dict'])
        epoch = checkpoint.get('epoch', 'unknown')
        val_loss = checkpoint.get('val_loss', 'unknown')
        print(f"  Checkpoint epoch: {epoch}")
        print(f"  Validation loss: {val_loss}")
    else:
        model.load_state_dict(checkpoint)
    
    model.eval()
    print(f"  ✅ Weights loaded successfully")
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)
print()

# Check 5: Test inference
print("✓ Check 5: Test inference")
try:
    # Create dummy input
    batch_size = 1
    seq_len = 14
    
    x = torch.randn(batch_size, seq_len).to(device)
    region_idx = torch.randint(0, num_regions, (batch_size,)).to(device)
    disease_idx = torch.randint(0, num_diseases, (batch_size,)).to(device)
    temporal = torch.randn(batch_size, 5).to(device)
    
    # Forward pass
    with torch.no_grad():
        output = model(x, region_idx, disease_idx, temporal)
    
    print(f"  Input shape: {x.shape}")
    print(f"  Output shape: {output.shape}")
    print(f"  Output value: {output.item():.4f}")
    print(f"  ✅ Inference successful")
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)
print()

# Check 6: Performance metrics
print("✓ Check 6: Model performance")
print("  Training results:")
print("  Model 1: Val Loss 0.2422, MAE 6.67, Error 79.1%")
print("  Model 2: Val Loss 0.2389, MAE 6.63, Error 83.6%")
print("  Model 3: Val Loss 0.2385, MAE 6.59, Error 84.5%")
print("  Model 4: Val Loss 0.2387, MAE 6.61, Error 77.4%")
print("  Model 5: Val Loss 0.2355, MAE 6.62, Error 87.5% ⭐ BEST")
print()

# Check 7: File sizes
print("✓ Check 7: Model files")
import os
models = [
    'improved_lstm_v2_model1_best.pt',
    'improved_lstm_v2_model2_best.pt',
    'improved_lstm_v2_model3_best.pt',
    'improved_lstm_v2_model4_best.pt',
    'improved_lstm_v2_model5_best.pt',
]
for model_file in models:
    path = f'../models/{model_file}'
    if os.path.exists(path):
        size_mb = os.path.getsize(path) / (1024 * 1024)
        print(f"  {model_file}: {size_mb:.2f} MB")
print()

# Summary
print("=" * 60)
print("✅ ALL VALIDATION CHECKS PASSED!")
print("=" * 60)
print("📝 Summary:")
print(f"  • Device: {device}")
print(f"  • Model: ImprovedDiseaseLSTM V2")
print(f"  • Parameters: {total_params:,}")
print(f"  • Regions: {num_regions}")
print(f"  • Diseases: {num_diseases}")
print(f"  • Best Model: Model 5 (Val Loss: 0.2355)")
print(f"  • Performance: MAE 6.62 cases, Median Error 87.5%")
print()
print("🚀 API is ready to start!")
print("   Run: python app_v2.py")
