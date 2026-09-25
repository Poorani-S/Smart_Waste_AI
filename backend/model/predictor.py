import os
import time
import numpy as np
import tensorflow as tf
from keras.models import load_model
from PIL import Image, ImageOps, ImageEnhance

# Global Model Variable
_model = None

CLASSES = ["Glass", "Metal", "Organic", "Paper", "Plastic"]  # Alphabetical order

def load_active_model(model_path):
    global _model
    if _model is None:
        try:
            print(f"Loading model from {model_path}...")
            _model = load_model(model_path)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
    return _model

def _pil_to_array(pil_img, normalize=False):
    """Convert a PIL image to a preprocessed numpy batch."""
    arr = np.array(pil_img, dtype=np.float32)
    if normalize:
        arr = arr / 255.0  # [0, 1] range
    return np.expand_dims(arr, axis=0)

def preprocess_and_augment(img_path):
    """
    Returns a list of (img_array, weight) tuples for Test-Time Augmentation (TTA).
    We try multiple preprocessing variants and return all of them to be averaged.
    This significantly improves reliability when the training normalization is uncertain.
    """
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224), Image.LANCZOS)

    augmented = []

    # Original
    augmented.append(_pil_to_array(img, normalize=False))
    # Horizontal flip
    augmented.append(_pil_to_array(ImageOps.mirror(img), normalize=False))
    # Slight brightness boost (simulate different lighting)
    augmented.append(_pil_to_array(ImageEnhance.Brightness(img).enhance(1.15), normalize=False))
    # Slight brightness reduce
    augmented.append(_pil_to_array(ImageEnhance.Brightness(img).enhance(0.85), normalize=False))

    return augmented

def determine_confidence_level(confidence):
    if confidence >= 75.0:
        return "High"
    elif confidence >= 45.0:
        return "Moderate"
    else:
        return "Low"

def predict_image(img_path, model_path):
    model = load_active_model(model_path)
    if not model:
        raise ValueError("Model not loaded.")

    augmented_arrays = preprocess_and_augment(img_path)

    start_time = time.time()

    # Average predictions across all TTA variants (ensemble)
    all_preds = []
    for arr in augmented_arrays:
        preds = model.predict(arr, verbose=0)[0]
        all_preds.append(preds)

    avg_predictions = np.mean(all_preds, axis=0)
    processing_time = time.time() - start_time

    # Get top 3 predictions
    top_3_idx = np.argsort(avg_predictions)[-3:][::-1]

    top_predictions = []
    for idx in top_3_idx:
        top_predictions.append({
            "category": CLASSES[idx],
            "confidence": float(round(avg_predictions[idx] * 100, 2))
        })

    top_category = top_predictions[0]["category"]
    top_confidence = top_predictions[0]["confidence"]

    result = {
        "category": top_category,
        "confidence": top_confidence,
        "top_predictions": top_predictions,
        "confidence_level": determine_confidence_level(top_confidence),
        "processing_time": round(processing_time, 4),
        "model_name": os.path.basename(model_path)
    }

    return result
