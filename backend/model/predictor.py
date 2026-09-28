import os
import time
import numpy as np

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import tensorflow as tf

# ---------------------------------------------------------------------------
# Cross-version Keras compatibility shim — must run BEFORE keras is imported
# ---------------------------------------------------------------------------
# The model was saved with Keras 3.13+ which added 'input_axes' / 'output_axes'
# to VarianceScaling's serialized config. Older Keras (e.g. 3.12.x bundled with
# TF 2.16.x) doesn't accept those kwargs, causing deserialization to crash.
def _patch_keras_compat():
    try:
        import keras
        from keras.initializers import VarianceScaling

        if getattr(VarianceScaling, "_smart_waste_compat_patched", False):
            print("[compat] VarianceScaling patch already applied.")
            return VarianceScaling

        _orig = VarianceScaling.__init__

        def _compat_init(self, scale=1.0, mode='fan_in',
                         distribution='truncated_normal', seed=None, **kwargs):
            kwargs.pop('input_axes', None)
            kwargs.pop('output_axes', None)
            return _orig(self, scale=scale, mode=mode,
                         distribution=distribution, seed=seed, **kwargs)

        VarianceScaling.__init__ = _compat_init
        VarianceScaling._smart_waste_compat_patched = True
        keras.utils.get_custom_objects()['VarianceScaling'] = VarianceScaling
        print("[compat] VarianceScaling patched for cross-version Keras compatibility.")
        return VarianceScaling
    except Exception as exc:
        print(f"[compat] VarianceScaling patch skipped: {exc}")
        return None


_variance_scaling_cls = _patch_keras_compat()

from keras.models import load_model
from PIL import Image, ImageOps, ImageEnhance

# Global Model Caching Variables
_model = None
_model_path = None
_model_mtime = None

CLASSES = ["Glass", "Metal", "Organic", "Paper", "Plastic"]  # Alphabetical order


def _resolve_model_path(model_path):
    if model_path is None:
        return None
    candidate = os.path.expanduser(str(model_path))
    if not os.path.isabs(candidate):
        candidate = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', candidate))
    return os.path.normpath(candidate)


def _load_model_fallback(model_path):
    print(f"[model] Attempting tf.keras load_model with compile=False for {model_path}")
    try:
        return tf.keras.models.load_model(model_path, compile=False)
    except Exception as tf_error:
        print(f"[model] tf.keras load_model failed: {type(tf_error).__name__}: {tf_error}")

    if _variance_scaling_cls is not None:
        print("[model] Fallback: loading with custom_objects={'VarianceScaling': compat_class}")
        try:
            return tf.keras.models.load_model(model_path, compile=False, custom_objects={'VarianceScaling': _variance_scaling_cls})
        except Exception as compat_error:
            print(f"[model] compat fallback failed: {type(compat_error).__name__}: {compat_error}")

    try:
        import keras
        print(f"[model] Fallback: loading via legacy keras.models.load_model")
        return keras.models.load_model(model_path, compile=False, custom_objects={'VarianceScaling': _variance_scaling_cls} if _variance_scaling_cls is not None else {})
    except Exception as legacy_error:
        print(f"[model] legacy Keras load_model failed: {type(legacy_error).__name__}: {legacy_error}")
        raise legacy_error


def load_active_model(model_path):
    global _model, _model_path, _model_mtime
    resolved_model_path = _resolve_model_path(model_path)
    current_mtime = os.path.getmtime(resolved_model_path) if os.path.exists(resolved_model_path) else 0
    if _model is None or _model_path != resolved_model_path or _model_mtime != current_mtime:
        try:
            print(f"[model] Loading/Reloading active model from {resolved_model_path}...")
            _model = _load_model_fallback(resolved_model_path)
            _model_path = resolved_model_path
            _model_mtime = current_mtime
            print("[model] Model loaded successfully.")
        except Exception as exc:
            print(f"[model] Error loading model: {type(exc).__name__}: {exc}")
            raise
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
