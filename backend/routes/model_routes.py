from flask import Blueprint, jsonify
import os
from database.mongodb import db
from config import Config

model_bp = Blueprint('model_bp', __name__)

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models'))

@model_bp.route('/api/model-performance', methods=['GET'])
def get_model_performance():
    """Return live model info and classification stats from the database."""
    try:
        stats = db.get_dashboard_stats()
        
        # Scan available model files
        models_info = []
        model_files = {
            'best_model.keras': {'name': 'EfficientNet-B0 (Active)', 'arch': 'EfficientNetB0', 'active': True},
            'efficientnet_model.keras': {'name': 'EfficientNet-B0', 'arch': 'EfficientNetB0', 'active': False},
            'mobilenet_model.keras': {'name': 'MobileNet-V2', 'arch': 'MobileNetV2', 'active': False},
            'cnn_model.keras': {'name': 'Custom CNN', 'arch': 'Sequential CNN', 'active': False},
        }
        for filename, info in model_files.items():
            path = os.path.join(MODELS_DIR, filename)
            if os.path.exists(path):
                size_mb = round(os.path.getsize(path) / (1024 * 1024), 1)
                models_info.append({
                    'filename': filename,
                    'name': info['name'],
                    'architecture': info['arch'],
                    'size_mb': size_mb,
                    'active': info['active'],
                    'status': 'Active' if info['active'] else 'Available'
                })

        return jsonify({
            'models': models_info,
            'stats': stats,
            'active_model': os.path.basename(Config.MODEL_PATH)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

