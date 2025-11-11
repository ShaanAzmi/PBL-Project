"""
Training Script for Improved Model V2
Target: Reduce prediction error from 157% to 20-50%

Usage:
    cd notebooks
    python train_improved_model.py
"""

import sys
sys.path.append('..')

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
import pickle
from tqdm import tqdm
from improved_model_v2 import (
    ImprovedDiseaseLSTM,
    EnhancedHuberLoss,
    create_rolling_features,
    EnsembleModel,
    train_with_curriculum,
    IMPROVED_TRAINING_CONFIG
)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"🚀 Using device: {device}")


class DiseaseDataset(Dataset):
    """Dataset with rolling features."""
    
    def __init__(self, sequences, regions, diseases, temporal, targets):
        self.sequences = torch.FloatTensor(sequences)
        self.regions = torch.LongTensor(regions)
        self.diseases = torch.LongTensor(diseases)
        self.temporal = torch.FloatTensor(temporal)
        self.targets = torch.FloatTensor(targets)
    
    def __len__(self):
        return len(self.sequences)
    
    def __getitem__(self, idx):
        return (
            self.sequences[idx],
            self.regions[idx],
            self.diseases[idx],
            self.temporal[idx],
            self.targets[idx]
        )


def load_data():
    """Load preprocessed data from notebook."""
    print("📂 Loading data...")
    
    # Load from pickle files saved in notebook
    with open('../models/training_data.pkl', 'rb') as f:
        data = pickle.load(f)
    
    X_train = data['X_train']
    X_val = data['X_val']
    y_train = data['y_train']
    y_val = data['y_val']
    
    # Metadata
    region_train = data['region_train']
    region_val = data['region_val']
    disease_train = data['disease_train']
    disease_val = data['disease_val']
    temporal_train = data['temporal_train']
    temporal_val = data['temporal_val']
    
    # Load encoders
    with open('../models/feature_encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
    
    num_regions = len(encoders['region'].classes_)
    num_diseases = len(encoders['disease'].classes_)
    
    print(f"✅ Data loaded:")
    print(f"   Train: {len(X_train):,} sequences")
    print(f"   Val: {len(X_val):,} sequences")
    print(f"   Regions: {num_regions}")
    print(f"   Diseases: {num_diseases}")
    
    return (
        X_train, X_val, y_train, y_val,
        region_train, region_val,
        disease_train, disease_val,
        temporal_train, temporal_val,
        num_regions, num_diseases
    )


def train_single_model(
    model, train_loader, val_loader, criterion, optimizer, scheduler,
    epochs=200, patience=30, model_name="model"
):
    """Train a single model."""
    
    best_val_loss = float('inf')
    patience_counter = 0
    history = {'train_loss': [], 'val_loss': []}
    
    print(f"\n🏋️ Training {model_name}...")
    
    for epoch in range(1, epochs + 1):
        # Training
        model.train()
        train_loss = 0
        
        for batch in train_loader:
            optimizer.zero_grad()
            
            x, region, disease, temporal, target = [b.to(device) for b in batch]
            pred = model(x, region, disease, temporal)
            
            loss = criterion(pred, target.unsqueeze(1))
            loss.backward()
            
            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            
            optimizer.step()
            train_loss += loss.item()
        
        train_loss /= len(train_loader)
        
        # Validation
        model.eval()
        val_loss = 0
        
        with torch.no_grad():
            for batch in val_loader:
                x, region, disease, temporal, target = [b.to(device) for b in batch]
                pred = model(x, region, disease, temporal)
                loss = criterion(pred, target.unsqueeze(1))
                val_loss += loss.item()
        
        val_loss /= len(val_loader)
        
        # Scheduler step
        scheduler.step(val_loss)
        
        # Record history
        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        
        # Print progress
        if epoch % 5 == 0 or epoch == 1:
            lr = optimizer.param_groups[0]['lr']
            print(f"Epoch [{epoch:3d}/{epochs}] | "
                  f"Train: {train_loss:.4f} | "
                  f"Val: {val_loss:.4f} | "
                  f"LR: {lr:.6f}", end="")
        
        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            # Save best model
            torch.save({
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'epoch': epoch,
                'val_loss': val_loss,
                'config': IMPROVED_TRAINING_CONFIG
            }, f'../models/{model_name}_best.pt')
            
            if epoch % 5 == 0 or epoch == 1:
                print(" ✓ BEST")
            else:
                print(f"\rEpoch [{epoch:3d}/{epochs}] | "
                      f"Train: {train_loss:.4f} | "
                      f"Val: {val_loss:.4f} | "
                      f"LR: {lr:.6f} ✓ BEST")
        else:
            patience_counter += 1
            if epoch % 5 == 0 or epoch == 1:
                print()
            
            if patience_counter >= patience:
                print(f"\n⏹️  Early stopping at epoch {epoch}")
                break
    
    print(f"✅ Best validation loss: {best_val_loss:.4f}")
    return history, best_val_loss


def evaluate_model(model, val_loader, scaler):
    """Evaluate model on validation set."""
    
    model.eval()
    predictions = []
    actuals = []
    
    with torch.no_grad():
        for batch in val_loader:
            x, region, disease, temporal, target = [b.to(device) for b in batch]
            pred = model(x, region, disease, temporal)
            
            predictions.append(pred.cpu().numpy())
            actuals.append(target.cpu().numpy())
    
    predictions = np.concatenate(predictions).flatten()
    actuals = np.concatenate(actuals).flatten()
    
    # Inverse transform (from log scale to natural scale)
    predictions_natural = np.expm1(predictions)
    actuals_natural = np.expm1(actuals)
    
    # Calculate metrics
    mae = np.mean(np.abs(predictions_natural - actuals_natural))
    rmse = np.sqrt(np.mean((predictions_natural - actuals_natural) ** 2))
    
    # Calculate percentage errors
    non_zero_mask = actuals_natural > 0
    percentage_errors = np.abs(predictions_natural[non_zero_mask] - actuals_natural[non_zero_mask]) / actuals_natural[non_zero_mask] * 100
    median_percentage_error = np.median(percentage_errors)
    
    print(f"\n📊 Validation Metrics:")
    print(f"   MAE: {mae:.2f} cases")
    print(f"   RMSE: {rmse:.2f} cases")
    print(f"   Median Percentage Error: {median_percentage_error:.1f}%")
    print(f"   Mean Percentage Error: {percentage_errors.mean():.1f}%")
    
    return mae, rmse, median_percentage_error


def main():
    """Main training function."""
    
    # Load data
    (X_train, X_val, y_train, y_val,
     region_train, region_val,
     disease_train, disease_val,
     temporal_train, temporal_val,
     num_regions, num_diseases) = load_data()
    
    # Create datasets
    train_dataset = DiseaseDataset(
        X_train, region_train, disease_train, temporal_train, y_train
    )
    val_dataset = DiseaseDataset(
        X_val, region_val, disease_val, temporal_val, y_val
    )
    
    # Create dataloaders
    config = IMPROVED_TRAINING_CONFIG
    train_loader = DataLoader(
        train_dataset,
        batch_size=config['batch_size'],
        shuffle=True,
        num_workers=0  # Set to 0 for Windows
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=config['batch_size'],
        shuffle=False,
        num_workers=0
    )
    
    print(f"\n🎯 Training Configuration:")
    for key, value in config.items():
        print(f"   {key}: {value}")
    
    # Train ensemble of models
    if config['use_ensemble']:
        print(f"\n🎼 Training ensemble of {config['num_ensemble_models']} models...")
        models = []
        
        for i in range(config['num_ensemble_models']):
            print(f"\n{'='*60}")
            print(f"Model {i+1}/{config['num_ensemble_models']}")
            print(f"{'='*60}")
            
            # Create model with different initialization
            torch.manual_seed(42 + i)
            model = ImprovedDiseaseLSTM(
                num_regions=num_regions,
                num_diseases=num_diseases,
                embedding_dim=config['embedding_dim'],
                hidden_size=config['hidden_size'],
                num_layers=config['num_layers'],
                num_heads=config['num_heads'],
                dropout=config['dropout']
            ).to(device)
            
            # Loss and optimizer
            criterion = EnhancedHuberLoss(delta=1.0, adaptive=True)
            optimizer = optim.AdamW(
                model.parameters(),
                lr=config['learning_rate'],
                weight_decay=config['weight_decay']
            )
            scheduler = optim.lr_scheduler.ReduceLROnPlateau(
                optimizer,
                mode='min',
                factor=0.5,
                patience=10,
                verbose=True
            )
            
            # Train
            history, best_loss = train_single_model(
                model, train_loader, val_loader,
                criterion, optimizer, scheduler,
                epochs=config['epochs'],
                patience=config['patience'],
                model_name=f'improved_lstm_v2_model{i+1}'
            )
            
            # Load best weights
            checkpoint = torch.load(f'../models/improved_lstm_v2_model{i+1}_best.pt')
            model.load_state_dict(checkpoint['model_state_dict'])
            models.append(model)
            
            # Evaluate
            evaluate_model(model, val_loader, None)
        
        # Save ensemble
        print(f"\n💾 Saving ensemble...")
        torch.save({
            'num_models': len(models),
            'config': config
        }, '../models/improved_ensemble_v2.pt')
        
        print(f"✅ Ensemble training complete!")
        
    else:
        # Train single model
        model = ImprovedDiseaseLSTM(
            num_regions=num_regions,
            num_diseases=num_diseases,
            embedding_dim=config['embedding_dim'],
            hidden_size=config['hidden_size'],
            num_layers=config['num_layers'],
            num_heads=config['num_heads'],
            dropout=config['dropout']
        ).to(device)
        
        criterion = EnhancedHuberLoss(delta=1.0, adaptive=True)
        optimizer = optim.AdamW(
            model.parameters(),
            lr=config['learning_rate'],
            weight_decay=config['weight_decay']
        )
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer,
            mode='min',
            factor=0.5,
            patience=10,
            verbose=True
        )
        
        history, best_loss = train_single_model(
            model, train_loader, val_loader,
            criterion, optimizer, scheduler,
            epochs=config['epochs'],
            patience=config['patience'],
            model_name='improved_lstm_v2'
        )
        
        # Load and evaluate
        checkpoint = torch.load('../models/improved_lstm_v2_best.pt')
        model.load_state_dict(checkpoint['model_state_dict'])
        evaluate_model(model, val_loader, None)
    
    print("\n🎉 Training complete!")
    print("📝 Next steps:")
    print("   1. Check ../models/ for saved models")
    print("   2. Update API to use improved model")
    print("   3. Test predictions on validation set")


if __name__ == "__main__":
    main()
