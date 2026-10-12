import React, { useRef, useEffect, useState } from 'react';
import { TerminalLog } from '../types';
import { Terminal as TerminalIcon, Copy, Trash2, Check, Play, CornerDownRight } from 'lucide-react';

interface TerminalProps {
  logs: TerminalLog[];
  isRunning: boolean;
  onClear: () => void;
  title?: string;
  commandSnippet?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  logs,
  isRunning,
  onClear,
  title = 'Python Virtual Terminal (v3.12)',
  commandSnippet,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const fullText = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogStyle = (type: TerminalLog['type']) => {
    switch (type) {
      case 'command':
        return 'text-emerald-400 font-semibold';
      case 'success':
        return 'text-emerald-300';
      case 'warning':
        return 'text-amber-300';
      case 'error':
        return 'text-rose-400 font-semibold';
      case 'info':
      default:
        return 'text-zinc-300';
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-zinc-900/90 px-3 py-2 border-b border-zinc-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-sans">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-zinc-200">{title}</span>
          </div>

          {isRunning && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Executing...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors disabled:opacity-40 cursor-pointer"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            disabled={logs.length === 0}
            className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors disabled:opacity-40 cursor-pointer"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-3.5 max-h-72 min-h-48 overflow-y-auto space-y-1 bg-zinc-950/95 scrollbar-thin scrollbar-thumb-zinc-800">
        {commandSnippet && (
          <div className="text-zinc-500 flex items-center gap-1.5 pb-1 border-b border-zinc-900 mb-1.5">
            <CornerDownRight className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-400">$ {commandSnippet}</span>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-zinc-600 italic py-6 text-center select-none font-sans text-xs">
            Script output and execution logs will stream here when automation runs.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start gap-2 break-all">
              <span className="text-zinc-600 text-[10px] select-none shrink-0 pt-0.5">
                {log.timestamp}
              </span>
              <span className={getLogStyle(log.type)}>
                {log.type === 'command' && <span className="text-emerald-500 mr-1.5">$</span>}
                {log.type === 'success' && <span className="text-emerald-400 mr-1.5">✓</span>}
                {log.type === 'error' && <span className="text-rose-400 mr-1.5">✗</span>}
                {log.type === 'warning' && <span className="text-amber-400 mr-1.5">⚠</span>}
                {log.text}
              </span>
            </div>
          ))
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs pt-1">
            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-500 text-[11px]">Processing filesystem / regex task...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer */}
      <div className="bg-zinc-900/60 px-3 py-1.5 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>Status: {isRunning ? 'Running' : 'Ready'}</span>
        <span>Lines: {logs.length}</span>
      </div>
    </div>
  );
};
