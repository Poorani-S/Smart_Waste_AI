# ♻️ SmartWaste AI

An **Explainable Deep Learning-Based Waste Classification & Management System** built with TensorFlow/Keras, Flask, React, and MongoDB.

## Overview
SmartWaste AI classifies waste into 5 categories (Glass, Metal, Organic, Paper, Plastic) to promote proper recycling. It uses a fine-tuned **EfficientNetB0** model and provides visual explainability using **Grad-CAM heatmaps** so users can see exactly *why* the AI made its decision.

### Key Features
- **Deep Learning Inference:** Optimized classification using EfficientNetB0 (88%+ Accuracy).
- **Explainable AI (XAI):** Real-time generation of Grad-CAM visual heatmaps.
- **Eco-Tech Dashboard:** Real-time analytics and dynamic visualizations using Recharts.
- **Recommendations Engine:** Actionable, category-specific disposal guidelines.
- **Modular Stack:** Decoupled Flask REST API and modern React + Vite frontend.

## System Requirements
- Python 3.9+
- Node.js 18+
- MongoDB Community Server (running on `localhost:27017`)

## Quick Start

The easiest way to start both the AI Backend and the React Frontend simultaneously on Windows is by using the provided startup script:

1. Ensure MongoDB is running locally.
2. Double click the **`start.bat`** file in the root directory (or run `.\start.bat` in your terminal).
3. The React app will open at `http://localhost:5173/` and the API will be available at `http://localhost:5000/`.

---

## Manual Setup & Execution

### 1. Database
Make sure your MongoDB server is running on the default port `27017`. The app will automatically create a database named `smartwaste`.

### 2. Backend (Flask API)
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the API
python app.py
```
*API will run on `http://localhost:5000`*

### 3. Frontend (React + Vite)
```bash
# Open a NEW terminal tab
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```
*Frontend will run on `http://localhost:5173`*

## Project Structure
- `/data`: Raw and processed dataset files.
- `/models`: Saved trained models (`best_model.keras`).
- `/scripts`: Data inspection, cleaning, and augmentation scripts.
- `/ml`: Model architectures (`train_cnn.py`, `train_mobilenet.py`, `train_efficientnet.py`) and evaluation logic.
- `/reports`: Training graphs, confusion matrices, and metrics CSV.
- `/backend`: Modular Flask REST API (MongoDB config, routing, prediction engine, Grad-CAM).
- `/frontend`: React SPA with Vite (Glassmorphism styling, Lucide icons, Recharts).

## Troubleshooting

- **`npm error ENOENT package.json`**: This happens if you run `npm run dev` in the project root. You MUST navigate into the `frontend` folder first (`cd frontend`).
- **TensorFlow/NumPy Errors**: We downgraded NumPy to `< 2.0.0` in the backend `requirements.txt` to ensure compatibility with OpenCV and TensorFlow. Ensure you have installed the exact requirements.
