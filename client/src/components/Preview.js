import React from 'react';
import './Preview.css';

function Preview({ output }) {
  return (
    <div className="preview">
      <pre className="preview-output">{output || 'No output yet. Run your code to see results here.'}</pre>
    </div>
  );
}

export default Preview;
