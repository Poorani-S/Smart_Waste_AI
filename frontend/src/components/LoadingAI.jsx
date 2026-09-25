import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Sparkles, Database } from 'lucide-react';
import './LoadingAI.css';

const LoadingAI = () => {
  const [stage, setStage] = useState(0);

  const stages = [
    { text: "Image received securely", icon: Upload },
    { text: "Preprocessing input data", icon: Camera },
    { text: "Running Deep Learning Model (EfficientNet)", icon: Sparkles },
    { text: "Generating Grad-CAM explanation", icon: Database },
    { text: "Saving classification to database", icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Simulate the stages passing while the actual API request happens
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-ai-container glass-panel">
      <div className="loading-ai-header">
        <Loader2 className="spinner" size={32} />
        <h3>AI is analyzing waste...</h3>
      </div>
      
      <div className="loading-stages">
        {stages.map((s, index) => {
          const Icon = s.icon;
          const isCompleted = index < stage;
          const isActive = index === stage;
          
          return (
            <div 
              key={index} 
              className={`loading-stage ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${index > stage ? 'pending' : ''}`}
            >
              <div className="stage-icon-wrapper">
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>
              <span className="stage-text">{s.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingAI;
