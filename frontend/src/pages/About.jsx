import React from 'react';
import { Info, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="icon-container" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', color: 'var(--primary-color)' }}>
          <Info size={40} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>About SmartWaste AI</h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1.1rem' }}>Intelligent waste classification for a greener tomorrow</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          color: 'white',
          boxShadow: '0 10px 25px rgba(var(--primary-color-rgb), 0.4)'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>SW</span>
        </div>
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Version 1.0.0</h2>
        
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2.5rem' }}>
          SmartWaste AI uses advanced machine learning architectures like EfficientNet to accurately classify 
          waste materials into recyclable categories. Our mission is to automate sorting processes and 
          educate individuals on proper waste disposal, effectively reducing landfill accumulation and environmental impact.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', background: 'var(--primary-color)', border: 'none',
            borderRadius: '2rem', color: 'white', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 14px rgba(var(--primary-color-rgb), 0.4)'
          }}>
            <Globe size={20} /> Project Website
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(150,150,150,0.2)', paddingTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
          &copy; 2026 SmartWaste AI Team. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
