import React, { useEffect, useRef } from 'react';
import './WebPreview.css';

function WebPreview({ content }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && content) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
    }
  }, [content]);

  if (!content) {
    return (
      <div className="webpreview-empty">
        <div className="empty-state">
          <h3>No HTML content to preview</h3>
          <p>Open an HTML file and click Run to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="webpreview">
      <iframe
        ref={iframeRef}
        title="Web Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="webpreview-iframe"
      />
    </div>
  );
}

export default WebPreview;
