@echo off
echo ========================================================
echo         Starting SmartWaste AI Full Stack App
echo ========================================================

echo [1/2] Starting Flask Backend (Port 5000)...
cd backend
start /b cmd /c "python app.py"
cd ..

echo [2/2] Starting React Frontend (Port 5173)...
cd frontend
start /b cmd /c "npm run dev"
cd ..

echo ========================================================
echo Dashboard will be available at: http://localhost:5173/
echo API Server is running at: http://localhost:5000/
echo ========================================================
pause
