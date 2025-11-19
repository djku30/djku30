import React, { useState } from 'react';
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import './FileExplorer.css';

function FileTree({ item, onFileSelect, onDeleteFile, currentFile, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const isDirectory = item.type === 'directory';
  const isActive = currentFile === item.path;

  const handleClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(item.path);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${item.name}?`)) {
      onDeleteFile(item.path);
    }
  };

  return (
    <div className="file-tree-item">
      <div
        className={`file-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="file-item-left">
          {isDirectory ? (
            <>
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
            </>
          ) : (
            <>
              <span style={{ width: 14 }} />
              <File size={16} />
            </>
          )}
          <span className="file-name">{item.name}</span>
        </div>
        <button
          className="delete-button"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isDirectory && isOpen && item.children && (
        <div className="file-children">
          {item.children.map((child) => (
            <FileTree
              key={child.path}
              item={child}
              onFileSelect={onFileSelect}
              onDeleteFile={onDeleteFile}
              currentFile={currentFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileExplorer({
  files,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  currentFile
}) {
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createType, setCreateType] = useState('file');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newFileName.trim()) {
      if (createType === 'file') {
        onCreateFile(newFileName);
      } else {
        onCreateFolder(newFileName);
      }
      setNewFileName('');
      setShowNewFile(false);
    }
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <span>Files</span>
        <div className="header-actions">
          <button
            onClick={() => {
              setCreateType('file');
              setShowNewFile(true);
            }}
            title="New File"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => {
              setCreateType('folder');
              setShowNewFile(true);
            }}
            title="New Folder"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {showNewFile && (
        <form onSubmit={handleCreate} className="new-file-form">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder={`New ${createType} name`}
            autoFocus
            onBlur={() => {
              setTimeout(() => setShowNewFile(false), 200);
            }}
          />
        </form>
      )}

      <div className="file-list">
        {files.map((file) => (
          <FileTree
            key={file.path}
            item={file}
            onFileSelect={onFileSelect}
            onDeleteFile={onDeleteFile}
            currentFile={currentFile}
          />
        ))}
      </div>
    </div>
  );
}

export default FileExplorer;
