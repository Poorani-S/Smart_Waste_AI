from flask import Blueprint, jsonify, request
from database.mongodb import db

history_bp = Blueprint('history_bp', __name__)

@history_bp.route('/api/predictions', methods=['GET'])
def get_history():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        predictions = db.get_predictions(skip=skip, limit=limit)
        total = db.get_total_count()
        return jsonify({
            "page": page,
            "limit": limit,
            "total": total,
            "has_more": (skip + len(predictions)) < total,
            "data": predictions
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
