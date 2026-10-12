/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TaskId, TerminalLog } from './types';
import { TASKS_DATA } from './data/tasksData';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { TaskFileMover } from './components/TaskFileMover';
import { TaskEmailExtractor } from './components/TaskEmailExtractor';
import { TaskWebScraper } from './components/TaskWebScraper';
import { ConceptsModal } from './components/ConceptsModal';
import { AssignmentReportModal } from './components/AssignmentReportModal';
import { 
  Play, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Terminal as TerminalIcon,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTaskId, setActiveTaskId] = useState<TaskId>('file_mover');
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      timestamp: '03:10:00',
      type: 'info',
      text: 'Python 3.12.2 environment initialized with os, shutil, re, requests.',
    },
    {
      id: 'init-2',
      timestamp: '03:10:01',
      type: 'success',
      text: 'PyAuto Task Automation Suite loaded. Ready for execution.',
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'simulator' | 'explanation'>('simulator');
  const [isConceptsOpen, setIsConceptsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const activeTask = TASKS_DATA[activeTaskId];

  const handleAddLog = (log: Omit<TerminalLog, 'id' | 'timestamp'>) => {
    const newLog: TerminalLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      ...log,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const getTaskFilename = (id: TaskId) => {
    switch (id) {
      case 'file_mover':
        return 'move_jpg_files.py';
      case 'email_extractor':
        return 'extract_emails.py';
      case 'web_scraper':
        return 'scrape_title.py';
    }
  };

  const getTaskCommandSnippet = (id: TaskId) => {
    switch (id) {
      case 'file_mover':
        return 'python move_jpg_files.py --source ./downloads --dest ./jpg_photos';
      case 'email_extractor':
        return 'python extract_emails.py --input contacts.txt --output extracted_emails.txt';
      case 'web_scraper':
        return 'python scrape_title.py --url https://www.python.org';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header
        activeTaskId={activeTaskId}
        onSelectTask={(id) => {
          setActiveTaskId(id);
          setActiveViewTab('simulator');
        }}
        onOpenConcepts={() => setIsConceptsOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Task Objective & Concept Summary Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeTask.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {activeTask.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                {activeTask.shortDesc}
              </p>
            </div>

            {/* Concepts tags */}
            <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto">
              <span className="text-[11px] text-zinc-500 font-medium mr-1">Concepts:</span>
              {activeTask.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-1 text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-emerald-400 rounded-md"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Sub-tab view toggle (Simulator vs Explanation) */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/80">
            <button
              onClick={() => setActiveViewTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'simulator'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              Interactive Workbench & Sandbox
            </button>
            <button
              onClick={() => setActiveViewTab('explanation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'explanation'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              Step-by-Step Code Breakdown
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeViewTab === 'simulator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Interactive Simulator */}
            <div className="lg:col-span-7 space-y-6">
              {activeTaskId === 'file_mover' && (
                <TaskFileMover onAddLog={handleAddLog} onClearLogs={handleClearLogs} />
              )}
              {activeTaskId === 'email_extractor' && (
                <TaskEmailExtractor onAddLog={handleAddLog} onClearLogs={handleClearLogs} />
              )}
              {activeTaskId === 'web_scraper' && (
                <TaskWebScraper onAddLog={handleAddLog} onClearLogs={handleClearLogs} />
              )}
            </div>

            {/* Right 5 Cols: Python Code Viewer & Live Terminal */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              {/* Standalone Python Script Viewer */}
              <PythonCodeViewer
                beginnerCode={activeTask.beginnerCode}
                advancedCode={activeTask.advancedCode}
                taskTitle={activeTask.title}
                filename={getTaskFilename(activeTaskId)}
                requirementsText={
                  activeTaskId === 'web_scraper'
                    ? 'requests (pip install requests)'
                    : 'Python 3 standard library (no pip install needed)'
                }
              />

              {/* Virtual Python Terminal */}
              <Terminal
                logs={logs}
                isRunning={isRunning}
                onClear={handleClearLogs}
                commandSnippet={getTaskCommandSnippet(activeTaskId)}
              />
            </div>
          </div>
        ) : (
          /* Step-by-Step Explanation Tab */
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {activeTask.explanation.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  Detailed technical breakdown of how each Python statement operates under the hood.
                </p>
              </div>

              <div className="space-y-4">
                {activeTask.explanation.steps.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-200">{item.step}</h4>
                    </div>

                    <p className="text-xs text-zinc-400 pl-7">{item.desc}</p>

                    <div className="pl-7 pt-1">
                      <pre className="bg-zinc-900/90 p-2.5 rounded-lg text-emerald-300 font-mono text-xs overflow-x-auto border border-zinc-800/80">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Core Functions Reference Grid */}
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Core Functions & Standard Library Reference
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeTask.explanation.coreFunctions.map((fn, i) => (
                    <div
                      key={i}
                      className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-emerald-400 font-bold text-xs">{fn.name}</code>
                        <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                          {fn.lib}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{fn.purpose}</p>
                      <div className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        Example: {fn.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Task 3: Task Automation with Python Scripts · Covers <code className="text-zinc-400">os</code>, <code className="text-zinc-400">shutil</code>, <code className="text-zinc-400">re</code>, <code className="text-zinc-400">requests</code>, file handling
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConceptsOpen(true)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Key Concepts Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Generate Submission Report
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ConceptsModal isOpen={isConceptsOpen} onClose={() => setIsConceptsOpen(false)} />
      <AssignmentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        activeTaskId={activeTaskId}
      />
    </div>
  );
}
