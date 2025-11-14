@echo off
echo ========================================
echo Starting ML Model V2 API Server
echo ========================================
echo.
echo Model: ImprovedDiseaseLSTM V2
echo Parameters: 4.2M
echo Port: 8000
echo.
echo Starting server...
echo.

cd /d "%~dp0"
python app_v2.py

pause

