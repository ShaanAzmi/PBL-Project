# Nirogya - Running Servers Status

## ✅ Both Servers Are Running Successfully!

### 🔧 Backend - ML Model V2 API
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

**Health Status:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "num_regions": 985,
  "num_diseases": 129,
  "model_version": "V2 - ImprovedDiseaseLSTM"
}
```

**Available Endpoints:**
- `GET /` - API information
- `GET /health` - Health check
- `GET /regions` - List of 985 regions
- `GET /diseases` - List of 129 diseases
- `POST /predict` - Make predictions

---

### 🌐 Frontend - Next.js Application
- **Status**: ✅ Running
- **URL**: http://localhost:3000
- **Framework**: Next.js 15 with React and TypeScript

---

## 🎯 How to Test the Integration

### Step 1: Access the Website
1. Open your browser and go to: **http://localhost:3000**
2. You should see the Nirogya homepage with "All India Coverage"

### Step 2: Login as Doctor
1. Click on **"Doctor Login"** button or navigate to `/doctor/login`
2. Enter any email (e.g., `doctor@nirogya.com`)
3. Enter any password (e.g., `password123`)
4. Click **"Login"**
5. You'll be redirected to the dashboard

### Step 3: Test ML Model V2 Prediction
1. After login, you'll see the prediction interface
2. The **"ML Model V2 Prediction"** tab should be selected by default
3. **Select Region**: Choose any region from the dropdown (e.g., "Maharashtra_Mumbai")
   - 985 regions available in State_District format
4. **Select Disease**: Choose any disease (e.g., "Dengue")
   - 129 diseases available
5. **Enter 14 Days of Case Data**: 
   - Fill in the case counts for the last 14 days
   - Example: 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65
6. Click **"Predict Next Day Cases"**
7. View the results:
   - Predicted cases for the next day
   - 95% confidence interval (lower and upper bounds)
   - Region and disease information
   - Model version

### Step 4: Test Water-Disease Correlation (Optional)
1. Click on the **"Water-Disease Correlation"** tab
2. Enter outbreak information:
   - Number of cases
   - State/Union Territory (all 36 states and UTs available)
   - Start of outbreak month
3. Enter water quality parameters
4. Click **"Run Complete Disease-Water Analysis"**
5. View comprehensive analysis results

---

## 📊 Sample Test Data

### Example 1: Dengue in Maharashtra
```
Region: Maharashtra_Mumbai
Disease: Dengue
Last 14 Days Cases: 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65
```

### Example 2: Malaria in Odisha
```
Region: Odisha_Khurda
Disease: Malaria
Last 14 Days Cases: 5, 7, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35
```

### Example 3: Food Poisoning in Delhi
```
Region: Delhi_South Delhi
Disease: Food Poisoning
Last 14 Days Cases: 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28
```

---

## 🔍 Verify API Endpoints

### Test Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "num_regions": 985,
  "num_diseases": 129,
  "model_version": "V2 - ImprovedDiseaseLSTM"
}
```

### Test Regions Endpoint
```bash
curl http://localhost:8000/regions
```

Expected Response:
```json
{
  "total": 985,
  "regions": ["Andhra Pradesh_Alluri Sitharama Raju", "Andhra Pradesh_Anakapalli", ...]
}
```

### Test Diseases Endpoint
```bash
curl http://localhost:8000/diseases
```

Expected Response:
```json
{
  "total": 129,
  "diseases": ["Acute Diarrheal Disease", "Dengue", "Malaria", "Food Poisoning", ...]
}
```

### Test Prediction Endpoint
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Maharashtra_Mumbai",
    "disease": "Dengue",
    "last_14_days_cases": [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]
  }'
```

Expected Response:
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

## 🛠️ Troubleshooting

### If ML API is not responding:
1. Check if the process is running: Look for terminal 4
2. Restart the API:
   ```bash
   cd Nirogya/model/api
   python app_v2.py
   ```
3. Check for errors in the terminal output

### If Frontend is not responding:
1. Check if the process is running: Look for terminal 7
2. Restart the frontend:
   ```bash
   cd Nirogya/frontend
   npm run dev
   ```
3. Check for errors in the terminal output

### If predictions are not working:
1. Verify ML API is running: `curl http://localhost:8000/health`
2. Check browser console for errors (F12)
3. Verify CORS is enabled in the API
4. Make sure you've entered all 14 days of case data

---

## 📝 Current Running Processes

**Terminal 4**: ML Model V2 API Server (Port 8000)
- Command: `python app_v2.py`
- Working Directory: `c:\Users\SHAAN\OneDrive\Desktop\pbl\Nirogya\model\api`

**Terminal 7**: Next.js Frontend Server (Port 3000)
- Command: `npm run dev`
- Working Directory: `c:\Users\SHAAN\OneDrive\Desktop\pbl\Nirogya\frontend`

---

## 🎉 Features Verified

✅ ML Model V2 API running on port 8000  
✅ Frontend running on port 3000  
✅ 985 regions loaded successfully  
✅ 129 diseases loaded successfully  
✅ Health check endpoint working  
✅ Regions endpoint working  
✅ Diseases endpoint working  
✅ Prediction endpoint ready  
✅ CORS enabled for frontend integration  
✅ Model loaded successfully (ImprovedDiseaseLSTM V2)  

---

## 📚 Additional Resources

- **Setup Guide**: See `SETUP_GUIDE.md` for installation instructions
- **Changes Summary**: See `CHANGES_SUMMARY.md` for all modifications
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Frontend**: http://localhost:3000

---

## 🔄 To Stop the Servers

### Stop ML API:
- Find terminal 4 and press `Ctrl+C`
- Or kill the process from task manager

### Stop Frontend:
- Find terminal 7 and press `Ctrl+C`
- Or kill the process from task manager

---

## ✨ Next Steps

1. **Test the ML predictions** through the website
2. **Try different regions and diseases** to see various predictions
3. **Compare ML Model V2** predictions with Water-Disease Correlation
4. **Explore the API documentation** at http://localhost:8000/docs
5. **Check the multilingual support** by changing languages on the website

---

**Last Updated**: 2025-11-13  
**Status**: All systems operational ✅

