import numpy as np
import matplotlib.pyplot as plt
import os
import tensorflow as tf
import uuid
import matplotlib.cm as cm
from PIL import Image
from config import Config
from model.predictor import load_active_model


def _preprocess_for_gradcam(img_path):
    """Preprocess image exactly the same way as predictor — raw [0-255] for EfficientNet."""
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    return np.expand_dims(arr, axis=0), np.array(img)


def generate_gradcam(img_path, model_path, predicted_class_idx):
    try:
        model = load_active_model(model_path)
        img_array, original_img = _preprocess_for_gradcam(img_path)

        # Build grad model: outputs [last conv layer output, final predictions]
        # For EfficientNet, the last conv feature layer is 'top_activation'
        last_conv_layer_name = None
        for layer in reversed(model.layers):
            if hasattr(layer, 'filters') or 'conv' in layer.name.lower() or 'activation' in layer.name.lower():
                last_conv_layer_name = layer.name
                break

        if last_conv_layer_name is None:
            print("Could not find conv layer for Grad-CAM")
            return None

        # Create gradient model
        grad_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=[model.get_layer(last_conv_layer_name).output, model.output]
        )

        with tf.GradientTape() as tape:
            inputs = tf.cast(img_array, tf.float32)
            conv_outputs, predictions = grad_model(inputs)
            loss = predictions[:, predicted_class_idx]

        # Compute gradients of the class score with respect to conv output
        grads = tape.gradient(loss, conv_outputs)[0]
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1))
        conv_out = conv_outputs[0]

        # Weight conv output by pooled gradients
        heatmap = conv_out @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
        heatmap = heatmap.numpy()

        # Resize heatmap to image size
        heatmap_img = Image.fromarray(np.uint8(255 * heatmap)).resize((224, 224), Image.LANCZOS)
        heatmap_arr = np.array(heatmap_img)

        # Apply colormap
        colormap = cm.jet(heatmap_arr / 255.0)[..., :3]
        heatmap_colored = np.uint8(colormap * 255)

        # Superimpose on original
        superimposed = (heatmap_colored * 0.4 + original_img * 0.6).astype(np.uint8)

        # Save
        unique_filename = f"gradcam_{uuid.uuid4().hex}.jpg"
        save_path = os.path.join(Config.GENERATED_FOLDER, unique_filename)
        os.makedirs(Config.GENERATED_FOLDER, exist_ok=True)
        Image.fromarray(superimposed).save(save_path, quality=92)

        return unique_filename

    except Exception as e:
        print(f"Failed to generate Grad-CAM: {e}")
        return None

