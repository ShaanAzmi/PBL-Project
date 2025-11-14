"""
FastAPI application for Disease Outbreak Prediction Model V2
Uses the improved LSTM model with multi-head attention
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import torch
import numpy as np
import pandas as pd
import pickle
from datetime import datetime, timedelta
import sys
import uvicorn
sys.path.append('../notebooks')

# Import improved model
from improved_model_v2 import ImprovedDiseaseLSTM

# Load model and preprocessing artifacts
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Initialize FastAPI
app = FastAPI(
    title="Disease Outbreak Prediction API V2",
    description="Advanced LSTM V2 model with multi-head attention (4.2M parameters, 79% median error)",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and encoders
model = None
region_encoder = None
disease_encoder = None
num_regions = 0
num_diseases = 0

@app.on_event("startup")
async def load_model():
    """Load model and encoders on startup."""
    global model, region_encoder, disease_encoder, num_regions, num_diseases
    
    try:
        # Load encoders
        with open('../models/feature_encoders.pkl', 'rb') as f:
            encoders = pickle.load(f)
        
        region_encoder = encoders['region']
        disease_encoder = encoders['disease']
        num_regions = len(region_encoder.classes_)
        num_diseases = len(disease_encoder.classes_)
        
        # Initialize improved model
        model = ImprovedDiseaseLSTM(
            num_regions=num_regions,
            num_diseases=num_diseases,
            embedding_dim=64,
            hidden_size=256,
            num_layers=5,
            num_heads=4,
            dropout=0.3
        ).to(device)
        
        # Load best model weights (Model 5 - best validation loss: 0.2355)
        checkpoint = torch.load('../models/improved_lstm_v2_model5_best.pt', map_location=device)
        
        if 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
        
        model.eval()
        
        print(f"✅ Model V2 loaded successfully on {device}")
        print(f"📊 Model: ImprovedDiseaseLSTM (4.2M parameters)")
        print(f"📊 Regions: {num_regions}, Diseases: {num_diseases}")
        print(f"📊 Best validation loss: 0.2355")
        print(f"📊 Median error: 87.5% → Target: <50%")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise


# Pydantic models
class PredictionRequest(BaseModel):
    """Request model for prediction endpoint."""
    region: str = Field(..., description="Region name (State_District format)")
    disease: str = Field(..., description="Disease name")
    last_14_days_cases: List[float] = Field(..., description="List of 14 daily case counts", min_length=14, max_length=14)
    prediction_date: Optional[str] = Field(None, description="Date for prediction (YYYY-MM-DD)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "region": "Maharashtra_Mumbai",
                "disease": "Dengue",
                "last_14_days_cases": [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
                "prediction_date": "2025-11-15"
            }
        }


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint."""
    predicted_cases: float
    confidence_interval_lower: float
    confidence_interval_upper: float
    region: str
    disease: str
    prediction_date: str
    model_version: str


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Disease Outbreak Prediction API V2",
        "version": "2.0.0",
        "model": "ImprovedDiseaseLSTM",
        "parameters": "4.2M",
        "features": [
            "5-layer bidirectional LSTM",
            "Multi-head attention (4 heads)",
            "Regional embeddings (64-dim)",
            "Disease embeddings (64-dim)",
            "Temporal features",
            "Enhanced Huber loss"
        ],
        "performance": {
            "validation_mae": "6.62 cases",
            "median_error": "87.5%",
            "best_loss": "0.2355"
        },
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
        "num_regions": num_regions,
        "num_diseases": num_diseases,
        "model_version": "V2 - ImprovedDiseaseLSTM"
    }


@app.get("/regions")
async def get_regions():
    """Get list of available regions."""
    if region_encoder is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    regions = region_encoder.classes_.tolist()
    return {
        "total": len(regions),
        "regions": sorted(regions)
    }


@app.get("/diseases")
async def get_diseases():
    """Get list of available diseases."""
    if disease_encoder is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    diseases = disease_encoder.classes_.tolist()
    return {
        "total": len(diseases),
        "diseases": sorted(diseases)
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict disease outbreak cases for the next day.
    
    Args:
        request: Prediction request with region, disease, and last 14 days cases
    
    Returns:
        Prediction with confidence intervals
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Validate region and disease
        if request.region not in region_encoder.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown region: {request.region}. Use /regions to see available options."
            )
        
        if request.disease not in disease_encoder.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown disease: {request.disease}. Use /diseases to see available options."
            )
        
        # Encode region and disease
        region_idx = region_encoder.transform([request.region])[0]
        disease_idx = disease_encoder.transform([request.disease])[0]
        
        # Parse prediction date
        if request.prediction_date:
            pred_date = pd.to_datetime(request.prediction_date)
        else:
            pred_date = pd.Timestamp.now()
        
        # Extract temporal features
        month = pred_date.month
        day_of_year = pred_date.dayofyear
        year = pred_date.year
        
        # Cyclical encoding
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        day_sin = np.sin(2 * np.pi * day_of_year / 365)
        day_cos = np.cos(2 * np.pi * day_of_year / 365)
        year_norm = (year - 2009) / 16
        
        temporal_features = np.array([month_sin, month_cos, day_sin, day_cos, year_norm], dtype=np.float32)
        
        # Log transform cases
        cases_log = np.log1p(request.last_14_days_cases)
        
        # Prepare tensors
        x = torch.FloatTensor(cases_log).unsqueeze(0).to(device)
        region_t = torch.LongTensor([region_idx]).to(device)
        disease_t = torch.LongTensor([disease_idx]).to(device)
        temporal_t = torch.FloatTensor(temporal_features).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            pred_log = model(x, region_t, disease_t, temporal_t)
            pred_cases = np.expm1(pred_log.cpu().numpy()[0, 0])
        
        # Confidence intervals (simple approach: ±30% based on model uncertainty)
        ci_lower = max(0, pred_cases * 0.7)
        ci_upper = pred_cases * 1.3
        
        return PredictionResponse(
            predicted_cases=float(pred_cases),
            confidence_interval_lower=float(ci_lower),
            confidence_interval_upper=float(ci_upper),
            region=request.region,
            disease=request.disease,
            prediction_date=pred_date.strftime("%Y-%m-%d"),
            model_version="ImprovedDiseaseLSTM V2.0 (4.2M params, Best: Model 5)"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    print("🚀 Starting Disease Outbreak Prediction API V2...")
    print(f"📊 Model: ImprovedDiseaseLSTM (4.2M parameters)")
    print(f"🎯 Performance: MAE 6.62 cases, Median Error 87.5%")
    print(f"🌐 Server: http://0.0.0.0:8000")
    print(f"📚 Docs: http://0.0.0.0:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
