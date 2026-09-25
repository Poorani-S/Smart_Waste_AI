import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import Config
from model.predictor import predict_image
from utils.recommendations import get_waste_info
from database.mongodb import db
import uuid

prediction_bp = Blueprint('prediction_bp', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@prediction_bp.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add uuid to prevent overwriting
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
        
        # Ensure upload folder exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        file.save(filepath)
        
        try:
            # Predict
            result = predict_image(filepath, Config.MODEL_PATH)
            
            # Generate Grad-CAM
            from model.gradcam import generate_gradcam
            
            # Find index of predicted category
            from model.predictor import CLASSES
            predicted_idx = CLASSES.index(result["category"])
            
            gradcam_filename = generate_gradcam(filepath, Config.MODEL_PATH, predicted_idx)
            if gradcam_filename:
                result["gradcam_url"] = f"/api/generated/{gradcam_filename}"
            else:
                result["gradcam_url"] = None
                
            # Get recommendations
            waste_info = get_waste_info(result["category"])
            result["waste_info"] = waste_info
            
            # Save to MongoDB
            record = {
                "image_filename": unique_filename,
                "category": result["category"],
                "confidence": result["confidence"],
                "top_predictions": result["top_predictions"],
                "confidence_level": result["confidence_level"],
                "model_name": os.path.basename(Config.MODEL_PATH),
                "processing_time": result["processing_time"],
                "gradcam_path": gradcam_filename
            }
            db.insert_prediction(record)
            
            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "Invalid file type. Allowed types: " + ", ".join(Config.ALLOWED_EXTENSIONS)}), 400
