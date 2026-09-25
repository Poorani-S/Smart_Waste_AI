import os
from flask import Flask
from flask_cors import CORS
from config import Config
from model.predictor import load_active_model
import threading

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
    
    # Preload model in a background thread to not block startup completely,
    # or load it directly if preferred.
    def preload_model():
        try:
            if os.path.exists(Config.MODEL_PATH):
                load_active_model(Config.MODEL_PATH)
            else:
                print(f"Warning: Model not found at {Config.MODEL_PATH}. Prediction endpoint will fail.")
        except Exception as e:
            print(f"Failed to preload model: {e}")
            
    threading.Thread(target=preload_model).start()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=(Config.FLASK_ENV == 'development'))
