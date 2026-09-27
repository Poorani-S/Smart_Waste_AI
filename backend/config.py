import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/smartwaste")
    MODEL_PATH = os.getenv("MODEL_PATH", "../models/best_model.h5")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 5 * 1024 * 1024)) # 5MB default
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
    GENERATED_FOLDER = os.path.join(os.path.dirname(__file__), "generated")
