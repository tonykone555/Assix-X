import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface ScrapedData {
  title: string;
  url: string;
  emails: string[];
  phones: string[];
  socials: string[];
  timestamp: string;
}

export default function Popup() {
  const [status, setStatus] = useState<string>('ready');
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [extractedData, setExtractedData] = useState<ScrapedData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');

  useEffect(() => {
    // Fetch initial status from background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
        if (response) {
          setStatus(response.status);
          setSessionCount(response.sessionCount);
        }
      });
    }
  }, []);

  const handleStartAutomation = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'START_AUTOMATION' }, (response) => {
        if (response && response.success) {
          setStatus(response.status);
          setSessionCount(prev => prev + 1);
        }
      });
    }
  };

  const handleStopAutomation = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'STOP_AUTOMATION' }, (response) => {
        if (response && response.success) {
          setStatus(response.status);
        }
      });
    }
  };

  const handleScrapePage = () => {
    setErrorMsg(null);
    setSyncStatus('');
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.id) {
          setErrorMsg("No active tab found.");
          return;
        }

        chrome.tabs.sendMessage(activeTab.id, { action: 'SCRAPE_PAGE' }, (response) => {
          if (chrome.runtime.lastError) {
            setErrorMsg("Cannot scrape this page. Make sure you are on a standard webpage and refresh it.");
            return;
          }
          if (response && response.success) {
            setExtractedData(response.data);
          } else {
            setErrorMsg(response?.error || "Failed to parse page.");
          }
        });
      });
    } else {
      setErrorMsg("Chrome Extension environment not detected.");
    }
  };

  const handleSyncToAssix = async () => {
    if (!extractedData) return;
    setSyncStatus('syncing');
    
    try {
      // Direct post to the local Assix Service Engine server running on port 3000
      const payload = {
        sessionName: `Manual Extension Extract: ${extractedData.title.slice(0, 30)}`,
        leads: extractedData.emails.map((email, idx) => ({
          name: extractedData.title,
          email: email,
          phone: extractedData.phones[idx] || '',
          website: extractedData.url,
          status: 'extracted',
          timestamp: extractedData.timestamp
        }))
      };

      const res = await fetch('http://localhost:3000/api/sessions/create-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus(''), 3000);
      } else {
        setSyncStatus('failed');
      }
    } catch (e) {
      console.error(e);
      setSyncStatus('failed');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="brand-title">ASSIX COMPANION</h1>
          <div className="brand-subtitle">Automation Engine v1.0.0</div>
        </div>
        <span className={`badge ${status === 'running' ? 'badge-running' : 'badge-ready'}`}>
          {status}
        </span>
      </header>

      {/* Control Card */}
      <div className="card">
        <h2 className="card-title">Automation Control</h2>
        {status !== 'running' ? (
          <button className="btn btn-primary" onClick={handleStartAutomation}>
            Launch Session
          </button>
        ) : (
          <button className="btn btn-danger" onClick={handleStopAutomation}>
            Stop Active Session
          </button>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#52525B', marginTop: '6px', textTransform: 'uppercase' }}>
          <span>Total Launched:</span>
          <span style={{ fontFamily: 'monospace', color: '#F5F5F5' }}>{sessionCount}</span>
        </div>
      </div>

      {/* Scraper Card */}
      <div className="card">
        <h2 className="card-title">On-Page Lead Extractor</h2>
        <button className="btn btn-secondary" onClick={handleScrapePage}>
          Scrape Current Tab
        </button>

        {errorMsg && (
          <div style={{ color: '#EF4444', fontSize: '9px', marginTop: '8px', lineHeight: '1.2' }}>
            {errorMsg}
          </div>
        )}

        {extractedData && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="lead-item">
              <div className="lead-label">Source Title</div>
              <div className="lead-value" style={{ fontWeight: 'bold' }}>{extractedData.title}</div>
            </div>
            
            {extractedData.emails.length > 0 && (
              <div className="lead-item">
                <div className="lead-label">Found Emails ({extractedData.emails.length})</div>
                <div className="tag-container">
                  {extractedData.emails.map((m, i) => (
                    <span key={i} className="tag">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {extractedData.phones.length > 0 && (
              <div className="lead-item">
                <div className="lead-label">Found Phones ({extractedData.phones.length})</div>
                <div className="tag-container">
                  {extractedData.phones.map((p, i) => (
                    <span key={i} className="tag">{p}</span>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ marginTop: '8px', padding: '6px' }}
              onClick={handleSyncToAssix}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' && 'Syncing...'}
              {syncStatus === 'success' && 'Successfully Synced! ✓'}
              {syncStatus === 'failed' && 'Sync Failed (Server Offline)'}
              {syncStatus === '' && 'Sync to Assix Console'}
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        Powered by Assix Service Engine
      </footer>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<Popup />);
}
