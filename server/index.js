const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const WORKSPACE_DIR = path.join(__dirname, '..', 'workspace');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Ensure workspace directory exists
async function initWorkspace() {
  try {
    await fs.access(WORKSPACE_DIR);
  } catch {
    await fs.mkdir(WORKSPACE_DIR, { recursive: true });
    // Create a default file
    await fs.writeFile(
      path.join(WORKSPACE_DIR, 'index.js'),
      'console.log("Hello from Replit IDE!");\n'
    );
  }
}

// File tree endpoint
app.get('/api/files', async (req, res) => {
  try {
    const files = await getFileTree(WORKSPACE_DIR);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getFileTree(dir, basePath = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        const children = await getFileTree(fullPath, relativePath);
        return {
          name: entry.name,
          path: relativePath,
          type: 'directory',
          children
        };
      } else {
        return {
          name: entry.name,
          path: relativePath,
          type: 'file'
        };
      }
    })
  );
  return files;
}

// Read file content
app.get('/api/file', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE_DIR, req.query.path);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save file
app.post('/api/file', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    const fullPath = path.join(WORKSPACE_DIR, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create file/folder
app.post('/api/create', async (req, res) => {
  try {
    const { path: itemPath, type } = req.body;
    const fullPath = path.join(WORKSPACE_DIR, itemPath);

    if (type === 'file') {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, '');
    } else {
      await fs.mkdir(fullPath, { recursive: true });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file/folder
app.delete('/api/file', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE_DIR, req.query.path);
    await fs.rm(filePath, { recursive: true, force: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute code
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    let command, args, input;

    switch (language) {
      case 'javascript':
        command = 'node';
        args = ['-e', code];
        break;
      case 'python':
        command = 'python3';
        args = ['-c', code];
        break;
      case 'bash':
        command = 'bash';
        args = ['-c', code];
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const child = spawn(command, args, {
      cwd: WORKSPACE_DIR,
      timeout: 30000
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      res.json({
        output: output + errorOutput,
        exitCode: code
      });
    });

    child.on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for terminal
wss.on('connection', (ws) => {
  console.log('Terminal connected');

  let shell;
  try {
    // Use bash if available, otherwise sh
    shell = spawn('bash', [], {
      cwd: WORKSPACE_DIR,
      env: process.env
    });
  } catch (error) {
    shell = spawn('sh', [], {
      cwd: WORKSPACE_DIR,
      env: process.env
    });
  }

  shell.stdout.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
  });

  shell.stderr.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
  });

  shell.on('close', () => {
    ws.close();
  });

  ws.on('message', (message) => {
    try {
      const { type, data } = JSON.parse(message);
      if (type === 'input') {
        shell.stdin.write(data);
      } else if (type === 'resize') {
        // Handle terminal resize if using node-pty
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Terminal disconnected');
    shell.kill();
  });
});

// Initialize and start server
initWorkspace().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
