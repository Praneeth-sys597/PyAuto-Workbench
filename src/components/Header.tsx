import React from 'react';
import { TaskId } from '../types';
import { 
  FolderArchive, 
  MailCheck, 
  Globe, 
  FileText, 
  BookOpen, 
  Code2, 
  TerminalSquare,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTaskId: TaskId;
  onSelectTask: (taskId: TaskId) => void;
  onOpenReport: () => void;
  onOpenConcepts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTaskId,
  onSelectTask,
  onOpenReport,
  onOpenConcepts,
}) => {
  const tasks: Array<{
    id: TaskId;
    label: string;
    sub: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'file_mover',
      label: 'Idea 1: Move .jpg Files',
      sub: 'Directory sorting & relocation',
      badge: 'os + shutil',
      icon: <FolderArchive className="w-4 h-4" />,
    },
    {
      id: 'email_extractor',
      label: 'Idea 2: Extract Emails',
      sub: 'Regex pattern search from .txt',
      badge: 're + file handling',
      icon: <MailCheck className="w-4 h-4" />,
    },
    {
      id: 'web_scraper',
      label: 'Idea 3: Scrape Webpage Title',
      sub: 'HTTP GET & <title> extraction',
      badge: 'requests + re',
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-zinc-800/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                  PyAuto Workbench
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Task 3 Automation
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Automating repetitive tasks with Python: <code className="text-emerald-300">os</code>, <code className="text-emerald-300">shutil</code>, <code className="text-emerald-300">re</code>, <code className="text-emerald-300">requests</code>, file handling
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenConcepts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 hover:border-zinc-600 rounded-lg transition-colors cursor-pointer shadow-sm"
              title="View documentation on os, shutil, re, requests"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Key Concepts</span>
            </button>

            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
              title="Generate a ready-to-submit project report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submission Report</span>
            </button>
          </div>
        </div>

        {/* Task navigation tabs */}
        <div className="flex overflow-x-auto py-2.5 gap-2 no-scrollbar">
          {tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800/90 text-white border border-emerald-500/40 shadow-sm shadow-black/40'
                    : 'bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {task.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{task.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {task.badge}
                    </span>
                  </div>
                  <span className="text-[11px] block text-zinc-400 leading-tight">
                    {task.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
