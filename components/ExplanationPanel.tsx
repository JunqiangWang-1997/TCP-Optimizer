import React from 'react';
import { Zap } from './Icons';

interface ExplanationPanelProps {
  explanation: string;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  // Simple markdown-like parsing for bolding and lists
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###') || line.startsWith('##')) {
        return <h3 key={i} className="text-lg font-bold text-primary-400 mt-4 mb-2">{line.replace(/#/g, '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 mb-1 text-gray-300">{line.substring(2)}</li>;
      }
      // Basic bold parsing
      const parts = line.split('**');
      return (
        <p key={i} className="mb-2 text-gray-300 leading-relaxed">
          {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-900/30 rounded-lg">
          <Zap className="text-primary-400" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white">Tuning Analysis</h2>
      </div>
      <div className="prose prose-invert max-w-none text-sm">
        {renderText(explanation)}
      </div>
    </div>
  );
};