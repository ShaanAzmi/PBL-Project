# 🚀 Nirogya - Quick Start Guide

Get Nirogya up and running in 5 minutes!

---

## ⚡ Quick Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/nirogya.git
cd nirogya
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../model/api
pip install -r requirements.txt
pip install torch torchvision torchaudio
```

---

## 🎯 Start the Application

### Terminal 1 - Backend API
```bash
cd model/api
python app_v2.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Loading ML Model V2...
INFO:     ✓ Model loaded successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.5.2
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

---

## 🌐 Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **API** | http://localhost:8000 | Backend API |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/health | API health status |

---

## 🎮 Quick Test

### 1. Test Backend API
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "model_version": "2.0.0"
}
```

### 2. Test Frontend
1. Open http://localhost:3000 in your browser
2. You should see the Nirogya homepage
3. Click "Get Started" or "Login as Doctor"

### 3. Make a Prediction
1. Go to http://localhost:3000/doctor/dashboard
2. Login with any email/password (demo mode)
3. Select a region (e.g., "Maharashtra_Mumbai")
4. Select a disease (e.g., "Dengue")
5. Enter 14 days of case data
6. Click "Predict Outbreak"
7. View the prediction results!

---

## 🔧 Common Issues & Solutions

### Issue: Port Already in Use

**Frontend (Port 3000):**
```bash
# Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

**Backend (Port 8000):**
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

### Issue: Module Not Found

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
cd model/api
pip install -r requirements.txt --force-reinstall
```

### Issue: Model Files Missing

Download model files from the releases page and place them in `model/models/`:
- `improved_lstm_v2_model1_best.pt`
- `improved_lstm_v2_model2_best.pt`
- `improved_lstm_v2_model3_best.pt`
- `improved_lstm_v2_model4_best.pt`
- `improved_lstm_v2_model5_best.pt`
- `feature_encoders.pkl`
- `scaler_lstm_improved.pkl`

### Issue: CORS Errors

Make sure the backend is running and CORS is enabled in `app_v2.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📚 Next Steps

1. **Explore Features**: Check out the [README.md](README.md) for detailed features
2. **Read Documentation**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) for advanced setup
3. **API Reference**: Visit http://localhost:8000/docs for API documentation
4. **Customize**: Modify the code to fit your needs

---

## 💡 Tips

- **Development Mode**: Use `npm run dev` for hot-reload during development
- **Production Build**: Use `npm run build && npm start` for production
- **API Testing**: Use the interactive docs at http://localhost:8000/docs
- **Logs**: Check terminal output for errors and debugging info
- **Performance**: Use GPU for faster predictions (requires CUDA setup)

---

## 🆘 Need Help?

- 📖 **Full Documentation**: [README.md](README.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/yourusername/nirogya/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/nirogya)
- 📧 **Email**: support@nirogya.health

---

**Happy Coding! 🎉**

