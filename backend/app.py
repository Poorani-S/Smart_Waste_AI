import os
from flask import Flask
from flask_cors import CORS
from config import Config
from model.predictor import load_active_model

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load configuration
    app.config.from_object(Config)
    
    from flask import send_from_directory
    
    @app.route('/api/generated/<path:filename>')
    def serve_generated(filename):
        return send_from_directory(Config.GENERATED_FOLDER, filename)
        
    @app.route('/api/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)
    
    # Register blueprints
    from routes.prediction_routes import prediction_bp
    from routes.history_routes import history_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.health_routes import health_bp
    from routes.model_routes import model_bp
    
    app.register_blueprint(prediction_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(model_bp)
    
    # Load model synchronously at startup so it's ready before serving requests.
    # Background thread loading loses the race against health checks on cold starts.
    model_path = os.path.normpath(Config.MODEL_PATH)
    print(f"[startup] Resolved MODEL_PATH: {model_path}")
    print(f"[startup] File exists: {os.path.exists(model_path)}")
    try:
        if os.path.exists(model_path):
            load_active_model(model_path)
            print("[startup] Model loaded successfully.")
        else:
            print(f"[startup] WARNING: Model not found at {model_path}. Prediction endpoint will fail.")
    except Exception as e:
        print(f"[startup] ERROR loading model: {e}")
    
    return app

# Module-level app instance — required by gunicorn ('gunicorn app:app')
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))          # Render injects $PORT
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
