# 🏥 Nirogya - AI-Powered Disease Outbreak Prediction System

<div align="center">

![Nirogya Banner](https://img.shields.io/badge/Nirogya-Disease%20Prediction-00C9A7?style=for-the-badge&logo=healthcare&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**An advanced AI-powered platform for predicting and tracking disease outbreaks across India**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Model Details](#-model-details)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

**Nirogya** (Sanskrit: निरोग्य, meaning "healthy" or "disease-free") is a comprehensive disease outbreak prediction and tracking system designed for India. It leverages advanced machine learning techniques, specifically a 5-layer bidirectional LSTM with multi-head attention, to predict disease outbreaks with high accuracy.

### 🎯 Mission

To provide healthcare professionals, policymakers, and citizens with actionable insights about disease outbreaks, enabling proactive measures and saving lives through early detection and prediction.

### 🏆 Key Highlights

- **4.2M Parameter LSTM Model** with 79% median prediction accuracy
- **985 Regions** across all Indian states and union territories
- **129 Diseases** tracked including vector-borne, waterborne, and respiratory diseases
- **Real-time Predictions** with 95% confidence intervals
- **Multilingual Support** (English, Hindi, Bengali, Assamese)
- **Professional UI/UX** with modern design and smooth animations

---

## ✨ Features

### 🤖 AI-Powered Predictions

- **Advanced LSTM Model V2**: 5-layer bidirectional LSTM with multi-head attention mechanism
- **Ensemble Learning**: 5 model ensemble for robust predictions
- **Confidence Intervals**: 95% confidence bounds for all predictions
- **Historical Analysis**: Uses 14-day historical case data for accurate forecasting

### 📊 Disease Tracking & Analytics

- **Comprehensive Database**: 11 major diseases with detailed information
- **Real-time Statistics**: Live tracking of cases, deaths, and trends
- **Interactive Visualizations**: Charts, graphs, and maps using Recharts
- **State-wise Analysis**: Filter and analyze data by state/region

### 🎨 User Interface

- **Auto-Rotating Featured Disease**: Spotlight section with 5-second rotation
- **Interactive Search & Filter**: Search by disease or filter by state
- **Click-to-Expand Cards**: Detailed disease information in modals
- **Professional Icons**: Lucide React icons throughout (no emojis)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for elegant transitions

### 👨‍⚕️ Doctor Dashboard

- **Disease Prediction Tool**: Step-by-step ML prediction interface
- **Disease Records**: Comprehensive outbreak records with search/filter
- **Tab-based Navigation**: Clean separation of prediction and records
- **Export Capabilities**: Download data for further analysis

### 🌐 Multilingual Support

- **4 Languages**: English, Hindi, Bengali, Assamese
- **Context-aware Translation**: Seamless language switching
- **Localized Content**: All UI elements translated

### 🔒 Security & Performance

- **CORS Enabled**: Secure cross-origin requests
- **Fast API**: Optimized endpoints with <100ms response time
- **Error Handling**: Comprehensive error messages and validation
- **Type Safety**: Full TypeScript implementation

---

## 🎬 Demo

### Live Application

```bash
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

### Screenshots

**Homepage**
- Hero section with disease statistics
- Featured disease spotlight
- Quick access to prediction tools

**Doctor Dashboard**
- Disease prediction interface
- Historical outbreak records
- Interactive data visualization

**Disease Information Page**
- Auto-rotating featured diseases
- Search and filter functionality
- Detailed disease modals

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.2 | React framework with SSR/SSG |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **Framer Motion** | 12.23.12 | Animation library |
| **Recharts** | 3.3.0 | Data visualization |
| **Lucide React** | 0.542.0 | Icon library |
| **Axios** | 1.6.0 | HTTP client |
| **PapaParse** | 5.5.3 | CSV parsing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Programming language |
| **FastAPI** | 0.100+ | Web framework |
| **PyTorch** | 2.0+ | Deep learning framework |
| **Uvicorn** | Latest | ASGI server |
| **Pandas** | 2.0+ | Data manipulation |
| **NumPy** | 1.24+ | Numerical computing |
| **Scikit-learn** | 1.2+ | ML utilities |

### Machine Learning

- **Model Architecture**: 5-layer Bidirectional LSTM
- **Attention Mechanism**: Multi-head attention (4 heads)
- **Parameters**: 4.2 Million
- **Training Data**: Historical outbreak records from IDSP
- **Accuracy**: 79% median error reduction

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Homepage   │  │   Dashboard  │  │   Disease    │      │
│  │              │  │              │  │   Info Page  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                           │ HTTP/REST API                    │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FastAPI Backend (Port 8000)             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │  /predict    │  │  /regions    │  │  /health  │ │   │
│  │  │  /diseases   │  │  /docs       │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         ML Model (PyTorch LSTM V2)                   │   │
│  │  • 5-layer Bidirectional LSTM                        │   │
│  │  • Multi-head Attention (4 heads)                    │   │
│  │  • 4.2M Parameters                                   │   │
│  │  • Ensemble of 5 models                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Frontend → API Request → FastAPI → Model Inference → Response → Frontend → Display
```

---

## 📦 Installation

### Prerequisites

- **Node.js**: 18.0 or higher
- **Python**: 3.8 or higher
- **npm** or **yarn**: Latest version
- **pip**: Latest version
- **Git**: For cloning the repository

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/nirogya.git
cd nirogya
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### Step 3: Backend Setup

```bash
# Navigate to model/api directory
cd ../model/api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install PyTorch (CPU version)
pip install torch torchvision torchaudio

# For GPU support (CUDA 11.8):
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Step 4: Download Model Files

Ensure the following model files are in `model/models/`:
- `improved_lstm_v2_model1_best.pt`
- `improved_lstm_v2_model2_best.pt`
- `improved_lstm_v2_model3_best.pt`
- `improved_lstm_v2_model4_best.pt`
- `improved_lstm_v2_model5_best.pt`
- `feature_encoders.pkl`
- `scaler_lstm_improved.pkl`

---

## 🚀 Usage

### Starting the Application

#### Option 1: Manual Start

**Terminal 1 - Backend API:**
```bash
cd model/api
python app_v2.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option 2: Using Scripts

**Windows:**
```bash
# Start ML API
cd model/api
start_ml_api.bat

# Start Frontend
cd frontend
npm run dev
```

**macOS/Linux:**
```bash
# Start ML API
cd model/api
chmod +x start_ml_api.sh
./start_ml_api.sh

# Start Frontend
cd frontend
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Using the Prediction Tool

1. **Login as Doctor**: Navigate to `/doctor/dashboard` (any email/password works for demo)
2. **Select Region**: Choose from 985 regions in State_District format
3. **Select Disease**: Choose from 129 tracked diseases
4. **Enter Historical Data**: Input 14 days of case numbers
5. **Submit**: Get prediction with confidence intervals

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "model_version": "2.0.0"
}
```

#### 2. Get Regions

```http
GET /regions
```

**Response:**
```json
{
  "regions": ["Assam_Kamrup", "Delhi_Central Delhi", ...],
  "count": 985
}
```

#### 3. Get Diseases

```http
GET /diseases
```

**Response:**
```json
{
  "diseases": ["Dengue", "Malaria", "Tuberculosis", ...],
  "count": 129
}
```

#### 4. Predict Disease Outbreak

```http
POST /predict
```

**Request Body:**
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

**Response:**
```json
{
  "predicted_cases": 85.3,
  "confidence_interval_lower": 75.2,
  "confidence_interval_upper": 95.4,
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "prediction_date": "2024-01-15",
  "model_version": "2.0.0"
}
```

### Error Responses

```json
{
  "detail": "Error message here"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🧠 Model Details

### Architecture

**ImprovedDiseaseLSTM V2**

```python
Input Layer (14 timesteps × features)
    ↓
Embedding Layers (Region + Disease)
    ↓
5 × Bidirectional LSTM Layers (256 hidden units each)
    ↓
Multi-Head Attention (4 heads, 256 dimensions)
    ↓
Fully Connected Layers (512 → 256 → 128 → 1)
    ↓
Output (Predicted Cases)
```

### Specifications

- **Total Parameters**: 4,234,753
- **Trainable Parameters**: 4,234,753
- **LSTM Layers**: 5 (bidirectional)
- **Hidden Units**: 256 per direction
- **Attention Heads**: 4
- **Dropout Rate**: 0.3
- **Sequence Length**: 14 days

### Performance Metrics

- **Median Absolute Error**: 79% reduction vs baseline
- **R² Score**: 0.85+
- **Training Time**: ~2 hours on GPU
- **Inference Time**: <50ms per prediction

### Training Data

- **Source**: IDSP (Integrated Disease Surveillance Programme)
- **Records**: 50,000+ outbreak records
- **Time Period**: 2018-2023
- **Regions**: 985 districts across India
- **Diseases**: 129 communicable diseases

---

## 📁 Project Structure

```
Nirogya/
├── frontend/                      # Next.js frontend application
│   ├── app/                       # Next.js 15 app directory
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── doctor/               # Doctor dashboard
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Dashboard page
│   │   ├── get-started/          # Get started page
│   │   │   └── page.tsx
│   │   └── waterborne-diseases/  # Disease information page
│   │       └── page.tsx
│   ├── components/               # React components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Intro.tsx            # Hero section
│   │   ├── About.tsx            # About section
│   │   ├── Prediction.tsx       # ML prediction interface
│   │   ├── RecordBook.tsx       # Disease records table
│   │   ├── DiseaseStatistics.tsx # Statistics component
│   │   ├── LanguageToggle.tsx   # Language switcher
│   │   └── ...                  # Other components
│   ├── contexts/                # React contexts
│   │   └── LanguageContext.tsx  # Multilingual support
│   ├── constants/               # Constants and config
│   │   └── index.ts            # App constants
│   ├── public/                  # Static assets
│   │   ├── northeast_states_disease_outbreaks.csv
│   │   └── ...                 # Images, icons, etc.
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.ts      # Tailwind CSS config
│   └── next.config.ts          # Next.js config
│
├── model/                       # ML model and backend
│   ├── api/                    # FastAPI backend
│   │   ├── app_v2.py          # Main API application
│   │   ├── test_api_v2.py     # API tests
│   │   ├── validate_v2.py     # Model validation
│   │   ├── requirements.txt   # API dependencies
│   │   ├── start_ml_api.bat   # Windows startup script
│   │   └── start_ml_api.sh    # Unix startup script
│   ├── notebooks/              # Training notebooks
│   │   ├── improved_model_v2.py        # Model architecture
│   │   ├── train_improved_model.py     # Training script
│   │   ├── prepare_training_data.py    # Data preparation
│   │   └── compare_models.py           # Model comparison
│   ├── models/                 # Trained model files
│   │   ├── improved_lstm_v2_model1_best.pt
│   │   ├── improved_lstm_v2_model2_best.pt
│   │   ├── improved_lstm_v2_model3_best.pt
│   │   ├── improved_lstm_v2_model4_best.pt
│   │   ├── improved_lstm_v2_model5_best.pt
│   │   ├── feature_encoders.pkl
│   │   └── scaler_lstm_improved.pkl
│   ├── data/                   # Training data
│   │   └── processed/         # Processed datasets
│   ├── extractor/             # PDF data extraction
│   │   ├── disease_extractor.py
│   │   ├── pdf_downloader.py
│   │   └── ...
│   ├── requirements.txt       # Model dependencies
│   └── README.md             # Model documentation
│
├── README.md                  # This file
├── SETUP_GUIDE.md            # Detailed setup instructions
├── RUNNING_SERVERS.md        # Server management guide
└── CHANGES_SUMMARY.md        # Changelog

```

---

## ⚙️ Configuration

### Frontend Configuration

**`frontend/next.config.ts`**
```typescript
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Add custom configurations here
}
```

**Environment Variables** (create `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Nirogya
NEXT_PUBLIC_VERSION=1.0.0
```

### Backend Configuration

**`model/api/app_v2.py`**
```python
# Server configuration
HOST = "0.0.0.0"
PORT = 8000

# Model configuration
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_PATH = "../models/"
SEQUENCE_LENGTH = 14
```

**Environment Variables** (create `.env`):
```env
MODEL_PATH=../models/
DEVICE=cpu
LOG_LEVEL=INFO
```

### Tailwind CSS Configuration

**`frontend/tailwind.config.ts`**
```typescript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f5',
          100: '#b3e8e0',
          // ... custom color palette
        },
      },
    },
  },
}
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run type checking
npm run type-check

# Build test
npm run build

# Start production server
npm run start
```

### Backend Tests

```bash
cd model/api

# Test API endpoints
python test_api_v2.py

# Validate model
python validate_v2.py

# Manual API testing
curl http://localhost:8000/health
curl http://localhost:8000/regions
curl http://localhost:8000/diseases
```

### API Testing with cURL

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Get Regions:**
```bash
curl http://localhost:8000/regions
```

**Make Prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Maharashtra_Mumbai",
    "disease": "Dengue",
    "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
  }'
```

### Testing with Postman

1. Import the API collection from `model/api/postman_collection.json`
2. Set base URL to `http://localhost:8000`
3. Run the collection tests

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

**Environment Variables on Vercel:**
- `NEXT_PUBLIC_API_URL`: Your production API URL

### Backend Deployment (Docker)

**Create `Dockerfile` in `model/api/`:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app_v2:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build and Run:**
```bash
docker build -t nirogya-api .
docker run -p 8000:8000 nirogya-api
```

### Backend Deployment (Cloud Platforms)

**AWS EC2:**
1. Launch EC2 instance (Ubuntu 22.04)
2. Install Python 3.9+
3. Clone repository
4. Install dependencies
5. Run with `uvicorn app_v2:app --host 0.0.0.0 --port 8000`

**Google Cloud Run:**
1. Build Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Configure environment variables

**Heroku:**
```bash
# Create Procfile
echo "web: uvicorn app_v2:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create nirogya-api
git push heroku main
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/nirogya.git
   cd nirogya
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Contribution Guidelines

- **Code Style**: Follow existing code style and conventions
- **TypeScript**: Use strict type checking
- **Comments**: Add meaningful comments for complex logic
- **Testing**: Test your changes thoroughly
- **Documentation**: Update README if needed
- **Commit Messages**: Use clear, descriptive commit messages

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix bugs
- ✨ **New Features**: Add new functionality
- 📝 **Documentation**: Improve documentation
- 🎨 **UI/UX**: Enhance user interface
- 🧪 **Testing**: Add tests
- 🌐 **Translations**: Add more languages
- 🚀 **Performance**: Optimize code

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help others learn and grow

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Nirogya Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Data Sources

- **IDSP (Integrated Disease Surveillance Programme)**: Disease outbreak data
- **Ministry of Health and Family Welfare, India**: Health statistics
- **WHO (World Health Organization)**: Disease information and guidelines

### Technologies

- **Next.js Team**: For the amazing React framework
- **PyTorch Team**: For the deep learning framework
- **FastAPI Team**: For the modern web framework
- **Vercel**: For hosting and deployment platform
- **Tailwind Labs**: For the utility-first CSS framework

### Inspiration

- Healthcare workers fighting disease outbreaks
- Data scientists advancing ML in healthcare
- Open-source community

### Team

- **Developers**: [Your Team Names]
- **ML Engineers**: [Your Team Names]
- **UI/UX Designers**: [Your Team Names]
- **Project Mentors**: [Mentor Names]

---

## 📞 Contact & Support

### Get Help

- 📧 **Email**: support@nirogya.health
- 💬 **Discord**: [Join our community](https://discord.gg/nirogya)
- 🐦 **Twitter**: [@NirogyaHealth](https://twitter.com/nirogyahealth)
- 📖 **Documentation**: [docs.nirogya.health](https://docs.nirogya.health)

### Report Issues

Found a bug? Have a feature request?
- 🐛 [Report Bug](https://github.com/yourusername/nirogya/issues/new?template=bug_report.md)
- 💡 [Request Feature](https://github.com/yourusername/nirogya/issues/new?template=feature_request.md)

### Stay Updated

- ⭐ Star this repository
- 👀 Watch for updates
- 🔔 Subscribe to releases

---

## 🗺️ Roadmap

### Version 2.0 (Q2 2024)

- [ ] Mobile application (React Native)
- [ ] Real-time outbreak alerts
- [ ] Integration with government health systems
- [ ] Advanced visualization dashboard
- [ ] Multi-model ensemble predictions

### Version 3.0 (Q4 2024)

- [ ] Predictive analytics for resource allocation
- [ ] Integration with hospital management systems
- [ ] Public API for researchers
- [ ] Machine learning model marketplace
- [ ] Blockchain-based data verification

### Future Enhancements

- [ ] Climate data integration
- [ ] Social media sentiment analysis
- [ ] Genomic data analysis
- [ ] Drug resistance prediction
- [ ] Vaccine effectiveness tracking

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/nirogya?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/nirogya?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/nirogya?style=social)
![GitHub contributors](https://img.shields.io/github/contributors/yourusername/nirogya)
![GitHub issues](https://img.shields.io/github/issues/yourusername/nirogya)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/nirogya)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/nirogya)
![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/nirogya)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/nirogya&type=Date)](https://star-history.com/#yourusername/nirogya&Date)

---

<div align="center">

**Made with ❤️ for a healthier India**

[⬆ Back to Top](#-nirogya---ai-powered-disease-outbreak-prediction-system)

</div>

