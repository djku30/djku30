import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import Preview from './components/Preview';
import Header from './components/Header';
import WebPreview from './components/WebPreview';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [bottomTab, setBottomTab] = useState('terminal'); // 'terminal', 'output', or 'webview'
  const [autoRun, setAutoRun] = useState(false);

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
    // Check if file is already open
    const existingTabIndex = openTabs.findIndex(tab => tab.path === filePath);

    if (existingTabIndex !== -1) {
      setActiveTabIndex(existingTabIndex);
      return;
    }

    try {
      const response = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();

      const newTab = {
        path: filePath,
        content: data.content,
        modified: false
      };

      setOpenTabs([...openTabs, newTab]);
      setActiveTabIndex(openTabs.length);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleContentChange = (content) => {
    if (openTabs[activeTabIndex]) {
      const updatedTabs = [...openTabs];
      updatedTabs[activeTabIndex] = {
        ...updatedTabs[activeTabIndex],
        content,
        modified: true
      };
      setOpenTabs(updatedTabs);
    }
  };

  const handleFileSave = async (content) => {
    const currentTab = openTabs[activeTabIndex];
    if (!currentTab) return;

    try {
      await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentTab.path, content })
      });

      const updatedTabs = [...openTabs];
      updatedTabs[activeTabIndex] = {
        ...updatedTabs[activeTabIndex],
        modified: false
      };
      setOpenTabs(updatedTabs);

      if (autoRun) {
        handleRunCode();
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleCloseTab = (index) => {
    const updatedTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(updatedTabs);

    if (activeTabIndex >= updatedTabs.length) {
      setActiveTabIndex(Math.max(0, updatedTabs.length - 1));
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

      // Close tab if file is open
      const tabIndex = openTabs.findIndex(tab => tab.path === filePath);
      if (tabIndex !== -1) {
        handleCloseTab(tabIndex);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleRunCode = async () => {
    const currentTab = openTabs[activeTabIndex];
    if (!currentTab) return;

    const ext = currentTab.path.split('.').pop();
    let language = 'javascript';

    if (ext === 'py') language = 'python';
    else if (ext === 'sh') language = 'bash';
    else if (ext === 'html') {
      setBottomTab('webview');
      return;
    }

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentTab.content, language })
      });
      const data = await response.json();
      setOutput(data.output || data.error || '');
      setBottomTab('output');
    } catch (error) {
      setOutput('Error: ' + error.message);
      setBottomTab('output');
    }
  };

  const currentTab = openTabs[activeTabIndex];

  return (
    <div className="app">
      <Header
        currentFile={currentTab?.path}
        onRun={handleRunCode}
        autoRun={autoRun}
        onToggleAutoRun={() => setAutoRun(!autoRun)}
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
            currentFile={currentTab?.path}
          />

          <Split
            className="split-vertical"
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={4}
          >
            <div className="editor-area">
              <div className="file-tabs">
                {openTabs.map((tab, index) => (
                  <div
                    key={tab.path}
                    className={`file-tab ${index === activeTabIndex ? 'active' : ''}`}
                    onClick={() => setActiveTabIndex(index)}
                  >
                    <span className="tab-name">
                      {tab.path.split('/').pop()}
                      {tab.modified && <span className="modified-dot">●</span>}
                    </span>
                    <button
                      className="close-tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(index);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <Editor
                value={currentTab?.content || ''}
                onChange={handleContentChange}
                onSave={handleFileSave}
                fileName={currentTab?.path}
              />
            </div>

            <div className="bottom-panel">
              <div className="tabs">
                <button
                  className={`tab ${bottomTab === 'terminal' ? 'active' : ''}`}
                  onClick={() => setBottomTab('terminal')}
                >
                  Terminal
                </button>
                <button
                  className={`tab ${bottomTab === 'output' ? 'active' : ''}`}
                  onClick={() => setBottomTab('output')}
                >
                  Output
                </button>
                <button
                  className={`tab ${bottomTab === 'webview' ? 'active' : ''}`}
                  onClick={() => setBottomTab('webview')}
                >
                  Webview
                </button>
              </div>
              <div className="tab-content">
                {bottomTab === 'terminal' && <Terminal />}
                {bottomTab === 'output' && <Preview output={output} />}
                {bottomTab === 'webview' && <WebPreview content={currentTab?.content} />}
              </div>
            </div>
          </Split>
        </Split>
      </div>
    </div>
  );
}

export default App;
