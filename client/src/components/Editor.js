import React, { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './Editor.css';

function Editor({ value, onChange, onSave, fileName }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) {
          onSave(value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onSave]);

  const getLanguage = (fileName) => {
    if (!fileName) return 'plaintext';
    const ext = fileName.split('.').pop();
    const langMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      sh: 'shell',
      bash: 'shell',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml'
    };
    return langMap[ext] || 'plaintext';
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  if (!fileName) {
    return (
      <div className="editor-empty">
        <div className="empty-state">
          <h2>No file selected</h2>
          <p>Select a file from the explorer or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <MonacoEditor
        height="100%"
        language={getLanguage(fileName)}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          lineNumbers: 'on',
          rulers: [],
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'off',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 10 }
        }}
      />
    </div>
  );
}

export default Editor;
