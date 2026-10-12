import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Camera, Loader2, X, RefreshCw, 
  Download, Share2, Eye, ShieldAlert, Sparkles, Layers,
  ChevronRight, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import LoadingAI from '../components/LoadingAI';
import './Classify.css';

const Classify = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Processing state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // View state
  const [showGradCam, setShowGradCam] = useState(false);

  const API_BASE = 'http://localhost:5000';

  // --- Drag and Drop Logic ---
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // --- File Handling ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      setError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }
    
    stopCamera();
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setShowGradCam(false);
  };

  // --- Camera Logic ---
  const startCamera = async () => {
    setError(null);
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied or unavailable.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        stopCamera();
        handleFile(file);
      }, 'image/jpeg', 0.9);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- Analysis ---
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Small artificial delay to allow Loading animation to show stages
      const response = await axios.post(`${API_BASE}/api/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Delay setting result slightly for UX effect if it returned too fast
      setTimeout(() => setResult(response.data), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process image. Make sure Backend is running.');
      setLoading(false);
    }
  };

  // Unset loading when result arrives
  useEffect(() => {
    if (result || error) {
      setLoading(false);
    }
  }, [result, error]);

  const resetAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setShowGradCam(false);
  };

  const downloadReport = () => {
    if (!result) return;
    const now = new Date().toLocaleString();
    const top3Rows = (result.top_predictions || []).map(p =>
      `<tr><td>${p.category}</td><td>${p.confidence}%</td></tr>`
    ).join('');

    const confColor = result.confidence_level === 'High' ? '#065f46' : result.confidence_level === 'Moderate' ? '#92400e' : '#991b1b';
    const confBg = result.confidence_level === 'High' ? '#d1fae5' : result.confidence_level === 'Moderate' ? '#fef3c7' : '#fee2e2';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SmartWaste_Report_${result.category}_${Date.now()}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none !important; } }
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 720px; margin: 36px auto; color: #111; background: #fff; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
    .logo-box { width: 40px; height: 40px; background: #10b981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    h1 { color: #10b981; font-size: 1.6rem; margin: 0; }
    .subtitle { color: #6b7280; font-size: 0.88rem; margin-bottom: 24px; margin-top: 4px; }
    .divider { height: 1px; background: #e5e7eb; margin-bottom: 20px; }
    .section { margin: 18px 0; padding: 18px 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
    .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 10px; }
    .main-cat { font-size: 2.2rem; font-weight: 800; color: #10b981; }
    .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; background: ${confBg}; color: ${confColor}; }
    .conf-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 0.95rem; }
    .bar-bg { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; background: #10b981; width: ${result.confidence}%; }
    table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }
    th { background: #f9fafb; text-align: left; padding: 8px 12px; font-weight: 600; color: #374151; width: 140px; border-bottom: 1px solid #e5e7eb; }
    td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; }
    tr:last-child td, tr:last-child th { border-bottom: none; }
    footer { margin-top: 32px; font-size: 0.78rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; }
    .print-btn { display: block; margin: 24px auto 0; padding: 10px 28px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">🌿</div>
    <h1>SmartWaste AI</h1>
  </div>
  <div class="subtitle">Classification Report &nbsp;&middot;&nbsp; Generated: ${now}</div>
  <div class="divider"></div>

  <div class="section">
    <div class="section-label">Detected Category</div>
    <div class="main-cat">${result.category}</div>
    <div class="conf-row">
      <strong>${result.confidence}% confidence</strong>
      <div class="bar-bg"><div class="bar-fill"></div></div>
      <span class="badge">${result.confidence_level}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-label">Top 3 Predictions</div>
    <table><tr><th>Category</th><th>Confidence</th></tr>${top3Rows}</table>
  </div>

  <div class="section">
    <div class="section-label">Disposal Guide</div>
    <table>
      <tr><th>Type</th><td>${result.waste_info?.type || '—'}</td></tr>
      <tr><th>Examples</th><td>${(result.waste_info?.examples || []).join(', ') || '—'}</td></tr>
      <tr><th>Disposal</th><td>${result.waste_info?.disposal || '—'}</td></tr>
      <tr><th>Recyclable</th><td>${result.waste_info?.recyclable ? 'Yes ✓' : 'No'}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-label">Technical Details</div>
    <table>
      <tr><th>Model</th><td>${result.model_name || 'EfficientNet-B0'}</td></tr>
      <tr><th>Processing Time</th><td>${result.processing_time}s</td></tr>
    </table>
  </div>

  <button class="print-btn no-print" onclick="window.print()">&#8595; Save as PDF</button>

  <footer>
    <span>SmartWaste AI &mdash; Responsible AI for a Greener Tomorrow</span>
    <span>Predictions are probabilistic. Follow local guidelines.</span>
  </footer>

  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 400); };<\/script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const getConfidenceColor = (level) => {
    switch(level) {
      case 'High': return 'var(--success)';
      case 'Moderate': return 'var(--warning)';
      case 'Low': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="classify-page animate-fade-in">
      <div className="page-header">
        <h1>Classify Waste</h1>
        <p>Powered by Explainable AI (EfficientNetB0 + Grad-CAM)</p>
      </div>

      <div className="classify-grid">
        {/* LEFT COLUMN: UPLOAD & PREVIEW */}
        <div className="classify-left">
          <div className="upload-container glass-panel">
            {!preview && !isCameraActive && !loading && (
              <div 
                className={`dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input type="file" id="file-upload" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} hidden />
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <Upload size={32} />
                  </div>
                  <h3>Drop your waste image here</h3>
                  <p>or</p>
                  <label htmlFor="file-upload" className="btn btn-secondary">Browse Image</label>
                  <span className="dropzone-hint">Supports JPG, PNG, WEBP (Max 5MB)</span>
                </div>
                
                <div className="divider"><span>OR</span></div>
                
                <button className="btn btn-secondary camera-btn" onClick={startCamera}>
                  <Camera size={18} /> Use Camera
                </button>
              </div>
            )}

            {isCameraActive && (
              <div className="camera-view">
                <video ref={videoRef} autoPlay playsInline className="video-stream"></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                <div className="camera-actions">
                  <button className="btn btn-secondary" onClick={stopCamera}>Cancel</button>
                  <button className="btn btn-primary" onClick={captureImage}>
                    <Camera size={18} /> Capture
                  </button>
                </div>
              </div>
            )}

            {preview && !loading && (
              <div className="preview-view animate-fade-in">
                <div className="image-wrapper">
                  <img src={preview} alt="Preview" className="preview-img" />
                  <button className="remove-img-btn" onClick={resetAll} aria-label="Remove image">
                    <X size={16} />
                  </button>
                </div>
                
                {!result && (
                  <div className="preview-actions">
                    <button className="btn btn-primary analyze-btn" onClick={handleUpload}>
                      <Sparkles size={18} /> Analyze Waste
                    </button>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="loading-view">
                <LoadingAI />
              </div>
            )}
            
            {error && (
              <div className="error-message mt-4">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className="responsible-ai-note">
            <InfoIcon />
            <p><strong>Responsible AI:</strong> Predictions are probabilistic. Always follow your local municipal guidelines for definitive waste disposal.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: INSTRUCTIONS OR RESULTS */}
        <div className="classify-right">
          {!result && !loading ? (
            <div className="instructions-card glass-panel">
              <h3>How it works</h3>
              <div className="workflow-steps">
                <div className="workflow-step">
                  <div className="step-number">01</div>
                  <div className="step-content">
                    <h4>Upload Image</h4>
                    <p>Provide a clear photo of the waste item using upload or camera.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-number">02</div>
                  <div className="step-content">
                    <h4>AI Analyzes Image</h4>
                    <p>Our EfficientNet Deep Learning model processes the visual features.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-number">03</div>
                  <div className="step-content">
                    <h4>Category Detected</h4>
                    <p>Identifies if it's Plastic, Paper, Glass, Metal, or Organic.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-number">04</div>
                  <div className="step-content">
                    <h4>Get Recommendation</h4>
                    <p>Receive actionable disposal and recycling guidelines.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="result-container animate-slide-up">
              
              {/* Top Result Card */}
              <div className="result-hero card">
                <div className="result-hero-header">
                  <span className="tag">AI CLASSIFICATION</span>
                  <span className={`confidence-badge ${result.confidence_level.toLowerCase()}`}>
                    {result.confidence_level} Confidence
                  </span>
                </div>
                
                <h2 className="detected-category">{result.category}</h2>
                <div className="confidence-display">
                  <span className="conf-value">{result.confidence}% Match</span>
                  <div className="conf-bar-bg">
                    <div 
                      className="conf-bar-fill" 
                      style={{ 
                        width: `${result.confidence}%`,
                        backgroundColor: getConfidenceColor(result.confidence_level)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Explainable AI (Grad-CAM) */}
              {result.gradcam_url && (
                <div className="xai-card card">
                  <div className="card-header-flex">
                    <h3>Explainable AI (Grad-CAM)</h3>
                    <div className="view-toggle">
                      <button 
                        className={`toggle-btn ${!showGradCam ? 'active' : ''}`}
                        onClick={() => setShowGradCam(false)}
                      >Original</button>
                      <button 
                        className={`toggle-btn ${showGradCam ? 'active' : ''}`}
                        onClick={() => setShowGradCam(true)}
                      >Heatmap</button>
                    </div>
                  </div>
                  
                  <div className="xai-image-container">
                    <img 
                      src={showGradCam ? `${API_BASE}${result.gradcam_url}` : preview} 
                      alt="AI Attention" 
                      className="xai-img" 
                    />
                  </div>
                  <p className="xai-caption">
                    <Sparkles size={14} /> The heatmap highlights regions that contributed most to the AI's prediction.
                  </p>
                </div>
              )}

              {/* Details & Actions Grid */}
              <div className="details-grid">
                
                <div className="info-card card">
                  <h3>Top 3 Predictions</h3>
                  <div className="top3-list">
                    {(result.top_predictions || []).map((pred, i) => (
                      <div key={i} className="top3-item">
                        <span className="top3-name">{pred.category}</span>
                        <div className="top3-bar-container">
                          <div className="top3-bar" style={{width: `${pred.confidence}%`}}></div>
                        </div>
                        <span className="top3-val">{pred.confidence}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="model-info">
                    <Layers size={14} /> Model: {result.model_name || 'EfficientNet-B0'}
                  </div>
                </div>

                <div className="guide-card card">
                  <h3>Disposal Guide</h3>
                  <div className="guide-content">
                    <div className="guide-item">
                      <span className="label">Type</span>
                      <span className="val">{result.waste_info.type}</span>
                    </div>
                    <div className="guide-item">
                      <span className="label">Examples</span>
                      <span className="val">{result.waste_info.examples.join(', ')}</span>
                    </div>
                    
                    <div className="disposal-action-box">
                      <h4>What should I do?</h4>
                      <p>{result.waste_info.disposal}</p>
                    </div>
                  </div>
                </div>
                
              </div>
              
              <div className="result-action-bar">
                <button className="btn btn-secondary" onClick={resetAll}>
                  <RefreshCw size={16} /> Classify Another
                </button>
                <button className="btn btn-primary" onClick={downloadReport}>
                  <Download size={16} /> Download Report
                </button>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default Classify;
