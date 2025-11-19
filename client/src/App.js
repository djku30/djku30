import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import Preview from './components/Preview';
import Header from './components/Header';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' or 'preview'

  useEffect(() => {
    loadFileTree();
  }, []);

  const loadFileTree = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleFileSelect = async (filePath) => {
    try {
      const response = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();
      setCurrentFile(filePath);
      setFileContent(data.content);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleFileSave = async (content) => {
    if (!currentFile) return;

    try {
      await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentFile, content })
      });
      setFileContent(content);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleCreateFile = async (name) => {
    try {
      await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: name, type: 'file' })
      });
      loadFileTree();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: name, type: 'directory' })
      });
      loadFileTree();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFile = async (filePath) => {
    try {
      await fetch(`/api/file?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      });
      loadFileTree();
      if (currentFile === filePath) {
        setCurrentFile(null);
        setFileContent('');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleRunCode = async () => {
    if (!currentFile || !fileContent) return;

    const ext = currentFile.split('.').pop();
    let language = 'javascript';

    if (ext === 'py') language = 'python';
    else if (ext === 'sh') language = 'bash';

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fileContent, language })
      });
      const data = await response.json();
      setOutput(data.output || data.error || '');
      setActiveTab('preview');
    } catch (error) {
      setOutput('Error: ' + error.message);
      setActiveTab('preview');
    }
  };

  return (
    <div className="app">
      <Header
        currentFile={currentFile}
        onRun={handleRunCode}
      />
      <div className="main-container">
        <Split
          className="split-horizontal"
          sizes={[20, 80]}
          minSize={150}
          gutterSize={4}
        >
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onDeleteFile={handleDeleteFile}
            currentFile={currentFile}
          />

          <Split
            className="split-vertical"
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={4}
          >
            <Editor
              value={fileContent}
              onChange={setFileContent}
              onSave={handleFileSave}
              fileName={currentFile}
            />

            <div className="bottom-panel">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'terminal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('terminal')}
                >
                  Terminal
                </button>
                <button
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Output
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'terminal' ? (
                  <Terminal />
                ) : (
                  <Preview output={output} />
                )}
              </div>
            </div>
          </Split>
        </Split>
      </div>
    </div>
  );
}

export default App;
