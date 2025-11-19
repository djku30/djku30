import React from 'react';
import { Play, Code2, Zap, ZapOff } from 'lucide-react';
import './Header.css';

function Header({ currentFile, onRun, autoRun, onToggleAutoRun }) {
  return (
    <div className="header">
      <div className="header-left">
        <Code2 size={20} className="logo-icon" />
        <span className="logo-text">Replit IDE</span>
      </div>
      <div className="header-center">
        {currentFile && <span className="current-file">{currentFile}</span>}
      </div>
      <div className="header-right">
        <button
          className={`auto-run-button ${autoRun ? 'active' : ''}`}
          onClick={onToggleAutoRun}
          title={autoRun ? "Disable Auto-Run" : "Enable Auto-Run"}
        >
          {autoRun ? <Zap size={16} /> : <ZapOff size={16} />}
        </button>
        <button
          className="run-button"
          onClick={onRun}
          disabled={!currentFile}
          title="Run (Ctrl+Enter)"
        >
          <Play size={16} />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
