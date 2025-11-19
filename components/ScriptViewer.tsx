import React, { useState } from 'react';
import { Copy, CheckCircle, Download, Terminal } from './Icons';

interface ScriptViewerProps {
  script: string;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([script], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "optimize_tcp.sh";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full mt-8 rounded-xl overflow-hidden border border-gray-700 bg-gray-950 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-mono text-gray-300">
          <Terminal size={16} className="text-primary-500" />
          <span>optimize_tcp.sh</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono leading-relaxed text-gray-300 whitespace-pre">
            {/* Minimal syntax highlighting wrapper could go here, but simple pre is safer for stability */}
            <code>{script}</code>
        </pre>
      </div>
    </div>
  );
};