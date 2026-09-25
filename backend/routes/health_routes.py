from flask import Blueprint, jsonify
from database.mongodb import db
from model.predictor import _model

health_bp = Blueprint('health_bp', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": _model is not None,
        "database_connected": db.connected
    }), 200
