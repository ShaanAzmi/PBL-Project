# Nirogya - Disease Outbreak Prediction System Setup Guide

## Overview
Nirogya is an advanced disease outbreak prediction system covering **All India** with two prediction engines:
1. **ML Model V2** - Advanced LSTM with multi-head attention (4.2M parameters)
2. **Water-Disease Correlation** - Analyzes water quality and disease correlation

---

## Quick Start

### 1. Backend Setup (ML Model V2 API)

#### Prerequisites
- Python 3.8+
- PyTorch with CUDA support (optional, for GPU acceleration)
- Required Python packages

#### Installation
```bash
cd Nirogya/model/api
pip install -r requirements.txt
```

#### Start ML Model API Server
**Windows:**
```bash
start_ml_api.bat
```

**Linux/Mac:**
```bash
chmod +x start_ml_api.sh
./start_ml_api.sh
```

**Or manually:**
```bash
cd Nirogya/model/api
python app_v2.py
```

The API will start on **http://localhost:8000**

#### Verify API is Running
Open your browser and visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Root: http://localhost:8000

---

### 2. Frontend Setup (Next.js)

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Installation
```bash
cd Nirogya/frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## Using the System

### ML Model V2 Prediction (Recommended)

1. **Login as Doctor**
   - Navigate to `/doctor/login`
   - Enter any email and password (validation disabled for demo)

2. **Access Prediction Dashboard**
   - After login, you'll see the prediction interface
   - Select the **"ML Model V2 Prediction"** tab

3. **Make a Prediction**
   - **Region**: Select from 985 available regions (State_District format)
   - **Disease**: Select from 129 diseases (e.g., Dengue, Malaria, Food Poisoning)
   - **Last 14 Days Cases**: Enter daily case counts for the past 14 days
   - Click **"Predict Next Day Cases"**

4. **View Results**
   - Predicted cases for the next day
   - 95% confidence interval (lower and upper bounds)
   - Model version and metadata

### Water-Disease Correlation Analysis

1. Select the **"Water-Disease Correlation"** tab
2. Enter outbreak information:
   - Number of cases
   - State/Union Territory (all 36 states and UTs available)
   - Start of outbreak month
3. Enter water quality parameters:
   - pH, Dissolved Oxygen, BOD, Nitrate, Coliform counts, Temperature
4. Click **"Run Complete Disease-Water Analysis"**
5. View comprehensive analysis including:
   - Disease prediction
   - Water quality assessment
   - Correlation analysis
   - 3-month future predictions
   - Recommendations

---

## API Endpoints

### ML Model V2 API (Port 8000)

#### GET /health
Health check endpoint
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda",
  "num_regions": 985,
  "num_diseases": 129
}
```

#### GET /regions
Get list of available regions
```json
{
  "total": 985,
  "regions": ["Maharashtra_Mumbai", "Delhi_Central Delhi", ...]
}
```

#### GET /diseases
Get list of available diseases
```json
{
  "total": 129,
  "diseases": ["Dengue", "Malaria", "Food Poisoning", ...]
}
```

#### POST /predict
Make a prediction
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "last_14_days_cases": [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]
}
```

Response:
```json
{
  "predicted_cases": 70.5,
  "confidence_interval_lower": 65.2,
  "confidence_interval_upper": 75.8,
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "prediction_date": "2025-11-14",
  "model_version": "V2 - ImprovedDiseaseLSTM"
}
```

---

## Model Information

### ImprovedDiseaseLSTM V2
- **Parameters**: 4.2M
- **Architecture**: 
  - 5-layer bidirectional LSTM
  - Multi-head attention (4 heads)
  - Regional embeddings (64-dim)
  - Disease embeddings (64-dim)
- **Training Data**: 16+ years of IDSP outbreak data
- **Coverage**: 985 regions, 129 diseases across All India
- **Performance**: 
  - Validation MAE: 6.62 cases
  - Best validation loss: 0.2355

---

## Troubleshooting

### ML API Not Starting
1. Check if Python is installed: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Check if port 8000 is available
4. Verify model files exist in `Nirogya/model/models/`

### Frontend Not Connecting to API
1. Ensure ML API is running on port 8000
2. Check browser console for CORS errors
3. Verify API health: http://localhost:8000/health

### No Regions/Diseases Loading
1. Check if `feature_encoders.pkl` exists in `Nirogya/model/models/`
2. Verify API logs for encoder loading errors
3. Restart the ML API server

---

## Project Structure

```
Nirogya/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   └── Prediction.tsx  # Main prediction component with ML integration
│   └── contexts/         # React contexts (Language, etc.)
├── model/                # ML model and API
│   ├── api/              # FastAPI server
│   │   ├── app_v2.py     # ML Model V2 API
│   │   ├── start_ml_api.bat  # Windows startup script
│   │   └── start_ml_api.sh   # Linux/Mac startup script
│   ├── models/           # Trained model files
│   └── notebooks/        # Training notebooks
└── SETUP_GUIDE.md        # This file
```

---

## Features

### All India Coverage
- **36 States and Union Territories**
- **985 Regions** (State_District combinations)
- **129 Diseases** tracked

### Professional UI
- Clean, professional design with Lucide React icons
- Multilingual support (6 languages)
- Responsive layout
- Real-time predictions
- Interactive data visualization

### Advanced ML Model
- State-of-the-art LSTM architecture
- Multi-head attention mechanism
- Confidence intervals for predictions
- GPU acceleration support

---

## Support

For issues or questions:
1. Check API health: http://localhost:8000/health
2. Review API docs: http://localhost:8000/docs
3. Check browser console for frontend errors
4. Verify both servers are running (ports 3000 and 8000)

---

## License

This project is part of the Nirogya disease outbreak prediction system.

