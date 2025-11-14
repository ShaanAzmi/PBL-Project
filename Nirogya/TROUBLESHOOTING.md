# 🔧 Nirogya - Troubleshooting Guide

Complete guide to solving common issues with Nirogya.

---

## 📋 Table of Contents

- [Installation Issues](#-installation-issues)
- [Frontend Issues](#-frontend-issues)
- [Backend Issues](#-backend-issues)
- [API Issues](#-api-issues)
- [Model Issues](#-model-issues)
- [Performance Issues](#-performance-issues)
- [Deployment Issues](#-deployment-issues)
- [General Tips](#-general-tips)

---

## 🔨 Installation Issues

### Issue: npm install fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

3. **Update npm:**
```bash
npm install -g npm@latest
```

4. **Use specific Node version:**
```bash
# Install nvm (Node Version Manager)
# Then use Node 18 or 20
nvm install 18
nvm use 18
npm install
```

### Issue: pip install fails

**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement torch
```

**Solutions:**

1. **Upgrade pip:**
```bash
python -m pip install --upgrade pip
```

2. **Install PyTorch separately:**
```bash
# CPU version
pip install torch torchvision torchaudio

# GPU version (CUDA 11.8)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3. **Use virtual environment:**
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Python version incompatibility

**Symptoms:**
```
ERROR: This package requires Python >=3.8
```

**Solutions:**

1. **Check Python version:**
```bash
python --version
```

2. **Install Python 3.8+:**
- Download from https://www.python.org/downloads/
- Or use pyenv:
```bash
pyenv install 3.9.0
pyenv global 3.9.0
```

---

## 🎨 Frontend Issues

### Issue: Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process on port 3000:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

2. **Use different port:**
```bash
PORT=3001 npm run dev
```

### Issue: Module not found errors

**Symptoms:**
```
Module not found: Can't resolve 'framer-motion'
```

**Solutions:**

1. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Install missing package:**
```bash
npm install framer-motion
```

3. **Check package.json:**
Ensure all dependencies are listed correctly.

### Issue: TypeScript errors

**Symptoms:**
```
Type 'string' is not assignable to type 'number'
```

**Solutions:**

1. **Run type check:**
```bash
npm run type-check
```

2. **Fix type errors:**
Add proper type annotations or use type assertions.

3. **Restart TypeScript server:**
In VSCode: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Issue: Tailwind CSS not working

**Symptoms:**
Styles not applying, classes not working.

**Solutions:**

1. **Check tailwind.config.ts:**
```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

2. **Rebuild:**
```bash
npm run build
npm run dev
```

3. **Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

### Issue: Images not loading

**Symptoms:**
404 errors for images, broken image icons.

**Solutions:**

1. **Check public folder:**
Ensure images are in `public/` directory.

2. **Use correct path:**
```tsx
// Correct
<img src="/image.png" alt="..." />

// Incorrect
<img src="./image.png" alt="..." />
```

3. **Use Next.js Image component:**
```tsx
import Image from 'next/image'
<Image src="/image.png" width={500} height={300} alt="..." />
```

---

## ⚙️ Backend Issues

### Issue: Port 8000 already in use

**Symptoms:**
```
ERROR: [Errno 48] Address already in use
```

**Solutions:**

1. **Kill process on port 8000:**

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

2. **Use different port:**
```python
# In app_v2.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Issue: Model files not found

**Symptoms:**
```
FileNotFoundError: [Errno 2] No such file or directory: '../models/improved_lstm_v2_model1_best.pt'
```

**Solutions:**

1. **Check model files exist:**
```bash
ls -la ../models/
```

2. **Download model files:**
Download from releases page and place in `model/models/`.

3. **Check file paths:**
Ensure paths in `app_v2.py` are correct:
```python
MODEL_PATH = "../models/"
```

### Issue: Import errors

**Symptoms:**
```
ModuleNotFoundError: No module named 'improved_model_v2'
```

**Solutions:**

1. **Check sys.path:**
```python
import sys
sys.path.append('../notebooks')
```

2. **Install in development mode:**
```bash
cd model/notebooks
pip install -e .
```

3. **Check file exists:**
```bash
ls -la ../notebooks/improved_model_v2.py
```

### Issue: CUDA/GPU errors

**Symptoms:**
```
RuntimeError: CUDA out of memory
```

**Solutions:**

1. **Use CPU instead:**
```python
device = torch.device('cpu')
```

2. **Reduce batch size:**
```python
BATCH_SIZE = 16  # Reduce from 32
```

3. **Clear GPU cache:**
```python
torch.cuda.empty_cache()
```

---

## 🌐 API Issues

### Issue: CORS errors

**Symptoms:**
```
Access to fetch at 'http://localhost:8000/predict' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**

1. **Enable CORS in backend:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Check backend is running:**
```bash
curl http://localhost:8000/health
```

3. **Use correct API URL:**
```typescript
const API_URL = 'http://localhost:8000'
```

### Issue: 422 Validation Error

**Symptoms:**
```json
{
  "detail": [
    {
      "loc": ["body", "historical_cases"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Solutions:**

1. **Check request body:**
Ensure all required fields are present:
```json
{
  "region": "Maharashtra_Mumbai",
  "disease": "Dengue",
  "historical_cases": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75, 78, 80]
}
```

2. **Verify data types:**
- `region`: string
- `disease`: string
- `historical_cases`: array of 14 numbers

3. **Check API documentation:**
Visit http://localhost:8000/docs for correct format.

### Issue: 500 Internal Server Error

**Symptoms:**
```json
{
  "detail": "Internal server error"
}
```

**Solutions:**

1. **Check backend logs:**
Look at terminal output for error details.

2. **Test with curl:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"region":"Maharashtra_Mumbai","disease":"Dengue","historical_cases":[45,52,48,55,60,58,62,65,70,68,72,75,78,80]}'
```

3. **Restart backend:**
```bash
# Stop with Ctrl+C
python app_v2.py
```

### Issue: Slow API responses

**Symptoms:**
Requests taking >5 seconds.

**Solutions:**

1. **Use GPU:**
```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

2. **Enable model caching:**
Model is loaded once at startup, not per request.

3. **Optimize model:**
Use quantization or pruning for faster inference.

---

## 🧠 Model Issues

### Issue: Poor prediction accuracy

**Symptoms:**
Predictions are way off from expected values.

**Solutions:**

1. **Check input data quality:**
Ensure historical cases are realistic and sequential.

2. **Verify region and disease:**
Use exact names from `/regions` and `/diseases` endpoints.

3. **Retrain model:**
If data distribution has changed significantly.

### Issue: Model loading fails

**Symptoms:**
```
RuntimeError: Error(s) in loading state_dict
```

**Solutions:**

1. **Check PyTorch version:**
```bash
pip show torch
```

2. **Reinstall PyTorch:**
```bash
pip uninstall torch
pip install torch
```

3. **Re-download model files:**
Ensure files are not corrupted.

### Issue: Out of memory

**Symptoms:**
```
RuntimeError: CUDA out of memory
```

**Solutions:**

1. **Use CPU:**
```python
device = torch.device('cpu')
```

2. **Reduce sequence length:**
```python
SEQUENCE_LENGTH = 7  # Instead of 14
```

3. **Use smaller model:**
Load single model instead of ensemble.

---

## 🚀 Performance Issues

### Issue: Slow page load

**Solutions:**

1. **Build for production:**
```bash
npm run build
npm start
```

2. **Optimize images:**
Use Next.js Image component with proper sizing.

3. **Enable caching:**
Configure proper cache headers.

### Issue: High memory usage

**Solutions:**

1. **Limit data fetching:**
Paginate large datasets.

2. **Optimize components:**
Use React.memo for expensive components.

3. **Clear browser cache:**
Hard refresh with `Ctrl+Shift+R`.

---

## 🌍 Deployment Issues

### Issue: Build fails on Vercel

**Solutions:**

1. **Check build logs:**
Look for specific error messages.

2. **Set Node version:**
Add to `package.json`:
```json
"engines": {
  "node": "18.x"
}
```

3. **Environment variables:**
Set all required env vars in Vercel dashboard.

### Issue: API not accessible

**Solutions:**

1. **Check firewall:**
Ensure port 8000 is open.

2. **Use correct host:**
```python
uvicorn.run(app, host="0.0.0.0", port=8000)
```

3. **Check HTTPS:**
Use HTTPS in production, not HTTP.

---

## 💡 General Tips

### Debugging Checklist

- [ ] Check all services are running
- [ ] Verify correct ports (3000, 8000)
- [ ] Check browser console for errors
- [ ] Check terminal logs for errors
- [ ] Test API with curl/Postman
- [ ] Clear cache and rebuild
- [ ] Check environment variables
- [ ] Verify file paths are correct
- [ ] Ensure dependencies are installed
- [ ] Check Python/Node versions

### Getting Help

1. **Check documentation:**
   - README.md
   - SETUP_GUIDE.md
   - QUICK_START.md

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow

3. **Ask for help:**
   - Discord community
   - GitHub Discussions
   - Email support

4. **Provide details:**
   - Error messages
   - Steps to reproduce
   - System information
   - Screenshots

---

## 📞 Still Need Help?

- 📧 **Email**: support@nirogya.health
- 💬 **Discord**: [Join our community](https://discord.gg/nirogya)
- 🐛 **GitHub Issues**: [Report a bug](https://github.com/yourusername/nirogya/issues)
- 📖 **Documentation**: [Full docs](README.md)

---

**Remember: Most issues can be solved by restarting services and clearing caches! 🔄**

