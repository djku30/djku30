import React from 'react';
import { Play, Code2 } from 'lucide-react';
import './Header.css';

function Header({ currentFile, onRun }) {
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
