import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 10;
  
  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/predictions?page=${page}&limit=${LIMIT}`);
      setHistory(response.data.data || []);
      setTotal(response.data.total || 0);
      setHasMore(response.data.has_more ?? false);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (level) => {
    switch(level) {
      case 'High': return 'var(--accent-green)';
      case 'Moderate': return 'var(--warning)';
      case 'Low': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="history-container animate-fade-in">
      <div className="history-header">
        <h2>Classification History</h2>
        <p>Review past predictions and model performance.</p>
      </div>

      <div className="history-content glass-panel">
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : total === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} className="empty-icon" />
            <h3>No History Found</h3>
            <p>Start classifying images to see them here.</p>
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p>No records found on page {page}.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Date</th>
                      <th>Prediction</th>
                      <th>Confidence</th>
                      <th>Model</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="history-img-wrapper">
                            <img 
                              src={`${API_BASE}/api/uploads/${item.image_filename}`} 
                              alt={item.category} 
                              className="history-img"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                            />
                          </div>
                        </td>
                        <td>{formatDate(item.timestamp)}</td>
                        <td>
                          <span className="history-category">{item.category}</span>
                        </td>
                        <td>
                          <div className="history-confidence">
                            <span style={{ color: getConfidenceColor(item.confidence_level) }}>
                              {item.confidence}%
                            </span>
                            <div className="mini-bar-bg">
                              <div 
                                className="mini-bar-fill"
                                style={{ 
                                  width: `${item.confidence}%`,
                                  backgroundColor: getConfidenceColor(item.confidence_level)
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td><span className="history-model">{item.model_name}</span></td>
                        <td>{item.processing_time}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="pagination">
              <button 
                className="btn btn-secondary pagination-btn"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button 
                className="btn btn-secondary pagination-btn"
                disabled={page >= totalPages || !hasMore}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
