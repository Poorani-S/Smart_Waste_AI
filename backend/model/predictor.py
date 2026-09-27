import os
import time
import numpy as np
import tensorflow as tf
from keras.models import load_model
from PIL import Image, ImageOps, ImageEnhance

# ---------------------------------------------------------------------------
# Cross-version Keras compatibility shim
# ---------------------------------------------------------------------------
# The model was saved with Keras 3.13+ which added 'input_axes' / 'output_axes'
# to VarianceScaling's serialized config. Older Keras (e.g. 3.12.x bundled with
# TF 2.16.1) doesn't accept those kwargs, causing deserialization to crash.
# We monkey-patch __init__ to silently drop any unrecognised keyword arguments
# so the .h5 file loads correctly on any Keras 3.x version.
def _patch_keras_compat():
    try:
        from keras.initializers import VarianceScaling
        _orig = VarianceScaling.__init__
        def _compat_init(self, scale=1.0, mode='fan_in',
                         distribution='truncated_normal', seed=None, **kwargs):
            # Drop kwargs added in newer Keras that older versions don't support
            kwargs.pop('input_axes', None)
            kwargs.pop('output_axes', None)
            _orig(self, scale=scale, mode=mode,
                  distribution=distribution, seed=seed)
        VarianceScaling.__init__ = _compat_init
        print("[compat] VarianceScaling patched for cross-version Keras compatibility.")
    except Exception as e:
        print(f"[compat] VarianceScaling patch skipped: {e}")

_patch_keras_compat()
# ---------------------------------------------------------------------------

# Global Model Caching Variables
_model = None
_model_path = None
_model_mtime = None

CLASSES = ["Glass", "Metal", "Organic", "Paper", "Plastic"]  # Alphabetical order

def load_active_model(model_path):
    global _model, _model_path, _model_mtime
    current_mtime = os.path.getmtime(model_path) if os.path.exists(model_path) else 0
    if _model is None or _model_path != model_path or _model_mtime != current_mtime:
        try:
            print(f"Loading/Reloading active model from {model_path}...")
            _model = load_model(model_path)
            _model_path = model_path
            _model_mtime = current_mtime
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
    Returns a list of img_arrays for Test-Time Augmentation (TTA).
    Preserves original aspect ratio via white-background padding.
    """
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    if w != h:
        max_dim = max(w, h)
        padded = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
        padded.paste(img, ((max_dim - w) // 2, (max_dim - h) // 2))
        img = padded

    img_resized = img.resize((224, 224), Image.LANCZOS)

    augmented = []

    # Original resized
    augmented.append(_pil_to_array(img_resized, normalize=False))
    # Horizontal flip
    augmented.append(_pil_to_array(ImageOps.mirror(img_resized), normalize=False))
    # Slight brightness boost
    augmented.append(_pil_to_array(ImageEnhance.Brightness(img_resized).enhance(1.1), normalize=False))
    # Slight contrast boost
    augmented.append(_pil_to_array(ImageEnhance.Contrast(img_resized).enhance(1.1), normalize=False))

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

def get_model():
    """Return the currently loaded model instance (or None if not yet loaded)."""
    return _model
