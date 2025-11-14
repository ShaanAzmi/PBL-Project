# 📡 Nirogya API Documentation

Complete API reference for the Nirogya Disease Outbreak Prediction System.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Base URL](#-base-url)
- [Authentication](#-authentication)
- [Endpoints](#-endpoints)
- [Request/Response Examples](#-requestresponse-examples)
- [Error Handling](#-error-handling)
- [Rate Limiting](#-rate-limiting)
- [Code Examples](#-code-examples)

---

## 🌐 Overview

The Nirogya API provides access to disease outbreak prediction capabilities using advanced machine learning models. The API is built with FastAPI and follows REST principles.

**API Version**: 2.0.0  
**Model Version**: ImprovedDiseaseLSTM V2  
**Parameters**: 4.2 Million  
**Accuracy**: 79% median error reduction

---

## 🔗 Base URL

### Development
```
http://localhost:8000
```

### Production
```
https://api.nirogya.health
```

---

## 🔐 Authentication

Currently, the API is **open** for demo purposes. No authentication required.

**Future versions will support:**
- API Key authentication
- OAuth 2.0
- JWT tokens

---

## 📍 Endpoints

### 1. Health Check

Check if the API is running and model is loaded.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "model_version": "2.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK`: API is healthy
- `503 Service Unavailable`: API is down or model not loaded

---

### 2. Get Regions

Retrieve list of all available regions for prediction.

**Endpoint:** `GET /regions`

**Response:**
```json
{
  "regions": [
    "Andhra Pradesh_Anantapur",
    "Andhra Pradesh_Chittoor",
    "Assam_Kamrup",
    "Delhi_Central Delhi",
    "Maharashtra_Mumbai",
    "...985 more regions..."
  ],
  "count": 985,
  "format": "State_District"
}
```

**Status Codes:**
- `200 OK`: Success

**Notes:**
- Regions are in `State_District` format
- Total 985 regions across India
- Covers all states and union territories

---

### 3. Get Diseases

Retrieve list of all tracked diseases.

**Endpoint:** `GET /diseases`

**Response:**
```json
{
  "diseases": [
    "Acute Diarrheal Disease",
    "Acute Encephalitis Syndrome",
    "Chickenpox",
    "Cholera",
    "Dengue",
    "Diphtheria",
    "Enteric Fever",
    "Food Poisoning",
    "Hepatitis A",
    "Japanese Encephalitis",
    "Leptospirosis",
    "Malaria",
    "Measles",
    "Meningitis",
    "Mumps",
    "Pertussis",
    "Pneumonia",
    "Tuberculosis",
    "Typhoid",
    "...129 total diseases..."
  ],
  "count": 129,
  "categories": {
    "vector_borne": 45,
    "waterborne": 38,
    "respiratory": 25,
    "other": 21
  }
}
```

**Status Codes:**
- `200 OK`: Success

---

### 4. Predict Disease Outbreak

Make a prediction for disease outbreak cases.

**Endpoint:** `POST /predict`

**Request Body:**
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

**Request Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `region` | string | Yes | Region in State_District format |
| `disease` | string | Yes | Disease name (exact match) |
| `historical_cases` | array[number] | Yes | 14 days of historical case data |

**Validation Rules:**
- `region`: Must be from `/regions` list
- `disease`: Must be from `/diseases` list
- `historical_cases`: Must be array of exactly 14 numbers
- All case numbers must be >= 0

**Response:**
```json
{
  "predicted_cases": 85.3,
  "confidence_interval_lower": 75.2,
  "confidence_interval_upper": 95.4,
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "prediction_date": "2024-01-15",
  "model_version": "2.0.0",
  "confidence_level": 0.95,
  "metadata": {
    "input_sequence_length": 14,
    "model_type": "ImprovedDiseaseLSTM",
    "ensemble_size": 5
  }
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `predicted_cases` | number | Predicted number of cases |
| `confidence_interval_lower` | number | Lower bound (95% confidence) |
| `confidence_interval_upper` | number | Upper bound (95% confidence) |
| `region` | string | Input region |
| `disease` | string | Input disease |
| `prediction_date` | string | Date of prediction |
| `model_version` | string | Model version used |
| `confidence_level` | number | Confidence level (0.95 = 95%) |
| `metadata` | object | Additional model information |

**Status Codes:**
- `200 OK`: Prediction successful
- `400 Bad Request`: Invalid input
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Model error

---

## 📝 Request/Response Examples

### Example 1: Basic Prediction

**Request:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Delhi_Central Delhi",
    "disease": "Malaria",
    "historical_cases": [12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45]
  }'
```

**Response:**
```json
{
  "predicted_cases": 48.7,
  "confidence_interval_lower": 42.3,
  "confidence_interval_upper": 55.1,
  "region": "Delhi_Central Delhi",
  "disease": "Malaria",
  "prediction_date": "2024-01-15",
  "model_version": "2.0.0"
}
```

### Example 2: Decreasing Trend

**Request:**
```json
{
  "region": "Karnataka_Bangalore",
  "disease": "Tuberculosis",
  "historical_cases": [100, 95, 90, 88, 85, 82, 80, 78, 75, 72, 70, 68, 65, 62]
}
```

**Response:**
```json
{
  "predicted_cases": 59.2,
  "confidence_interval_lower": 52.8,
  "confidence_interval_upper": 65.6,
  "region": "Karnataka_Bangalore",
  "disease": "Tuberculosis",
  "prediction_date": "2024-01-15",
  "model_version": "2.0.0"
}
```

### Example 3: Stable Cases

**Request:**
```json
{
  "region": "Tamil Nadu_Chennai",
  "disease": "Chickenpox",
  "historical_cases": [25, 26, 25, 24, 25, 26, 25, 24, 25, 26, 25, 24, 25, 26]
}
```

**Response:**
```json
{
  "predicted_cases": 25.3,
  "confidence_interval_lower": 22.1,
  "confidence_interval_upper": 28.5,
  "region": "Tamil Nadu_Chennai",
  "disease": "Chickenpox",
  "prediction_date": "2024-01-15",
  "model_version": "2.0.0"
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Errors

#### 1. Invalid Region

**Request:**
```json
{
  "region": "InvalidRegion",
  "disease": "Dengue",
  "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

**Response (400):**
```json
{
  "detail": "Invalid region: InvalidRegion. Use /regions endpoint to get valid regions."
}
```

#### 2. Invalid Disease

**Request:**
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "InvalidDisease",
  "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

**Response (400):**
```json
{
  "detail": "Invalid disease: InvalidDisease. Use /diseases endpoint to get valid diseases."
}
```

#### 3. Invalid Historical Cases Length

**Request:**
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "historical_cases": [45, 52, 48]
}
```

**Response (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "historical_cases"],
      "msg": "ensure this value has at least 14 items",
      "type": "value_error.list.min_items"
    }
  ]
}
```

#### 4. Negative Case Numbers

**Request:**
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "historical_cases": [45, 52, -10, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

**Response (400):**
```json
{
  "detail": "Historical cases must be non-negative numbers"
}
```

---

## 🚦 Rate Limiting

**Current Limits:**
- No rate limiting in demo mode

**Future Production Limits:**
- 100 requests per minute per IP
- 1000 requests per hour per API key
- Burst limit: 10 requests per second

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## 💻 Code Examples

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios'

const API_URL = 'http://localhost:8000'

async function predictOutbreak() {
  try {
    const response = await axios.post(`${API_URL}/predict`, {
      region: 'Maharashtra_Mumbai',
      disease: 'Dengue',
      historical_cases: [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
    })
    
    console.log('Prediction:', response.data.predicted_cases)
    console.log('Confidence Interval:', [
      response.data.confidence_interval_lower,
      response.data.confidence_interval_upper
    ])
  } catch (error) {
    console.error('Error:', error.response?.data?.detail)
  }
}
```

### Python (Requests)

```python
import requests

API_URL = 'http://localhost:8000'

def predict_outbreak():
    payload = {
        'region': 'Maharashtra_Mumbai',
        'disease': 'Dengue',
        'historical_cases': [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
    }
    
    response = requests.post(f'{API_URL}/predict', json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Prediction: {data['predicted_cases']}")
        print(f"Confidence Interval: [{data['confidence_interval_lower']}, {data['confidence_interval_upper']}]")
    else:
        print(f"Error: {response.json()['detail']}")
```

### cURL

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Maharashtra_Mumbai",
    "disease": "Dengue",
    "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
  }'
```

---

## 📊 Interactive Documentation

Visit the interactive API documentation at:

**Swagger UI:** http://localhost:8000/docs  
**ReDoc:** http://localhost:8000/redoc

Features:
- Try out endpoints directly
- See request/response schemas
- View example requests
- Test with different parameters

---

## 🔄 Versioning

The API uses semantic versioning: `MAJOR.MINOR.PATCH`

**Current Version:** 2.0.0

**Version History:**
- `2.0.0` - ImprovedDiseaseLSTM V2 with multi-head attention
- `1.0.0` - Initial LSTM model

**Breaking Changes:**
- Version changes will be announced in advance
- Old versions supported for 6 months after deprecation

---

## 📞 Support

- 📧 **Email**: api-support@nirogya.health
- 📖 **Documentation**: [Full API Docs](API_DOCUMENTATION.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/yourusername/nirogya/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/nirogya)

---

**Happy Coding! 🚀**

