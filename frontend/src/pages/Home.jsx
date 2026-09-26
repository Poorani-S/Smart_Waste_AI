import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartClassifying = () => {
    const saved = localStorage.getItem('smartwaste_user');
    if (saved) {
      navigate('/classify');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">
          Intelligent Waste <span className="highlight">Classification</span>
        </h1>
        <p className="hero-subtitle">
          Powered by Explainable AI (EfficientNetB0 + Grad-CAM) to help you sort waste accurately and responsibly.
        </p>
        <button onClick={handleStartClassifying} className="btn btn-primary hero-btn" style={{ border: 'none', cursor: 'pointer' }}>
          Start Classifying <ArrowRight size={20} />
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Zap size={24} /></div>
          <h3>Real-time Inference</h3>
          <p>Lightning-fast classification using optimized Deep Learning models.</p>
        </div>
        
        <div className="feature-card glass-panel">
          <div className="feature-icon"><ShieldCheck size={24} /></div>
          <h3>Explainable AI</h3>
          <p>Understand model decisions with Grad-CAM visual heatmaps.</p>
        </div>
        
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Leaf size={24} /></div>
          <h3>Eco-Friendly</h3>
          <p>Actionable disposal guidelines to reduce your environmental footprint.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
