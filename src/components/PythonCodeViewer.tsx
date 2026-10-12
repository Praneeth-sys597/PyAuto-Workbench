import React, { useState } from 'react';
import { Copy, Check, Download, Code, Sparkles, Terminal as TerminalIcon, Info } from 'lucide-react';

interface PythonCodeViewerProps {
  beginnerCode: string;
  advancedCode: string;
  taskTitle: string;
  filename: string;
  requirementsText?: string;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({
  beginnerCode,
  advancedCode,
  taskTitle,
  filename,
  requirementsText = 'Python 3.8+ (standard library only)',
}) => {
  const [version, setVersion] = useState<'beginner' | 'advanced'>('beginner');
  const [copied, setCopied] = useState(false);

  const activeCode = version === 'beginner' ? beginnerCode : advancedCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Code Viewer Header */}
      <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-200">
              {filename}
            </span>
          </div>

          {/* Toggle beginner / advanced */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
            <button
              onClick={() => setVersion('beginner')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                version === 'beginner'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Beginner Friendly (Concise)
            </button>
            <button
              onClick={() => setVersion('advanced')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                version === 'advanced'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              CLI / Production Mode
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
            title="Copy script code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-lg transition-colors cursor-pointer"
            title="Download standalone .py file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Code Body with line numbers */}
      <div className="relative font-mono text-xs overflow-x-auto max-h-96 bg-zinc-950 p-4 scrollbar-thin scrollbar-thumb-zinc-800">
        <pre className="text-zinc-200 leading-relaxed tab-4">
          <code>{activeCode}</code>
        </pre>
      </div>

      {/* Code Footer with execution hint */}
      <div className="bg-zinc-900/80 px-4 py-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Run locally: <code className="text-emerald-300 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">python {filename}</code>
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-500">
          <Info className="w-3.5 h-3.5" />
          <span>Dependencies: {requirementsText}</span>
        </div>
      </div>
    </div>
  );
};
