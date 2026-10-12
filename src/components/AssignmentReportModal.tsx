import React, { useState } from 'react';
import { X, FileText, Copy, Download, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { TaskId } from '../types';
import { TASKS_DATA } from '../data/tasksData';

interface AssignmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTaskId: TaskId;
}

export const AssignmentReportModal: React.FC<AssignmentReportModalProps> = ({
  isOpen,
  onClose,
  activeTaskId,
}) => {
  const [reportType, setReportType] = useState<TaskId | 'all'>(activeTaskId);
  const [studentName, setStudentName] = useState('Python Automation Developer');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = () => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (reportType === 'all') {
      return `# TASK 3: Task Automation with Python Scripts - Project Report
**Author:** ${studentName}  
**Date:** ${dateStr}  
**Core Technologies:** Python 3 (os, shutil, re, requests, file handling)

---

## 1. Executive Summary
This submission documents the automation of three real-life repetitive computer tasks using Python scripts:
1. **Directory Relocation:** Moving all \`.jpg\` images from an unsorted directory into a designated photos folder using \`os\` and \`shutil\`.
2. **Contact Extraction:** Harvesting, sanitizing, and deduplicating email addresses from unstructured \`.txt\` logs using regular expressions (\`re\`) and context-managed file handling.
3. **Webpage Metadata Scraping:** Connecting to remote web servers via HTTP GET requests using \`requests\`, extracting the \`<title>\` tag, and archiving it into local storage.

---

## 2. Idea 1: Move All .jpg Files to a New Folder
### 2.1 Problem Statement
Manual file management in messy download folders is slow and error-prone. This script scans a folder, isolates \`.jpg\` files regardless of letter casing, and relocates them to a target directory.

### 2.2 Key Concepts
- \`os.listdir(path)\`: Returns directory filenames.
- \`os.path.join(dir, file)\`: Cross-platform path stitching.
- \`os.makedirs(dest, exist_ok=True)\`: Safe directory creation.
- \`shutil.move(src, dst)\`: Atomic file transfer.

### 2.3 Python Implementation
\`\`\`python
${TASKS_DATA.file_mover.beginnerCode}
\`\`\`

---

## 3. Idea 2: Extract All Email Addresses from a .txt File
### 3.1 Problem Statement
Raw log files and customer inquiry dumps contain emails buried inside unstructured paragraphs. This automation extracts all valid addresses, removes duplicates, and exports a clean alphabetical list.

### 3.2 Key Concepts
- \`with open(..., 'r', encoding='utf-8')\`: Safe file reading context manager.
- \`re.findall(pattern, text)\`: Pattern search matching RFC-standard email structures.
- \`set()\`: Constant-time deduplication.
- \`with open(..., 'w')\`: Stream clean output back to disk.

### 3.3 Python Implementation
\`\`\`python
${TASKS_DATA.email_extractor.beginnerCode}
\`\`\`

---

## 4. Idea 3: Scrape the Title of a Fixed Webpage
### 4.1 Problem Statement
Extracting titles of dynamic or static web pages without opening a browser GUI. Uses HTTP GET requests and string pattern extraction.

### 4.2 Key Concepts
- \`requests.get(url, headers=headers, timeout=10)\`: Network HTTP GET client.
- \`response.raise_for_status()\`: Ensures status code is 200 OK before parsing.
- \`re.search(r'<title>(.*?)</title>', response.text, re.IGNORECASE)\`: Regular expression title capture.

### 4.3 Python Implementation
\`\`\`python
${TASKS_DATA.web_scraper.beginnerCode}
\`\`\`

---

## 5. Verification & How to Run
1. Install requirements (for Idea 3 only):
   \`\`\`bash
   pip install requests
   \`\`\`
2. Run any script in terminal:
   \`\`\`bash
   python move_jpg_files.py
   python extract_emails.py
   python scrape_title.py
   \`\`\`
3. Verify output files created on local disk.
`;
    }

    const task = TASKS_DATA[reportType];
    return `# TASK 3: Task Automation with Python Scripts - Project Report
**Task:** ${task.title}  
**Author:** ${studentName}  
**Date:** ${dateStr}  
**Key Concepts Used:** ${task.concepts.join(', ')}  

---

## 1. Problem Statement & Objective
${task.shortDesc}

The goal is to automate this repetitive real-life workflow using standard Python libraries, eliminating manual effort, reducing human error, and creating clean output artifacts.

---

## 2. Key Concepts & Modules
${task.explanation.steps
  .map(
    (s) => `### ${s.step}
${s.desc}

\`\`\`python
${s.code}
\`\`\`
`
  )
  .join('\n')}

---

## 3. Python Source Code
\`\`\`python
${task.beginnerCode}
\`\`\`

---

## 4. How to Run Locally
1. Save the code into a file named \`${task.id === 'file_mover' ? 'move_jpg_files.py' : task.id === 'email_extractor' ? 'extract_emails.py' : 'scrape_title.py'}\`.
${task.id === 'web_scraper' ? '2. Install dependency: `pip install requests`\n' : ''}
${task.id === 'web_scraper' ? '3.' : '2.'} Run the script:
   \`\`\`bash
   python ${task.id === 'file_mover' ? 'move_jpg_files.py' : task.id === 'email_extractor' ? 'extract_emails.py' : 'scrape_title.py'}
   \`\`\`
${task.id === 'web_scraper' ? '4.' : '3.'} Inspect generated output files and terminal confirmation logs.
`;
  };

  const markdownContent = generateMarkdownReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `task3_automation_report_${reportType}.md`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Assignment Submission Report Generator
              </h2>
              <p className="text-xs text-zinc-400">
                Export a complete, formatted report with code, explanations, and outputs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="bg-zinc-900/90 px-6 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 font-medium">Report Scope:</span>
            <button
              onClick={() => setReportType('file_mover')}
              className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                reportType === 'file_mover'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Idea 1 (File Mover)
            </button>
            <button
              onClick={() => setReportType('email_extractor')}
              className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                reportType === 'email_extractor'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Idea 2 (Email Harvester)
            </button>
            <button
              onClick={() => setReportType('web_scraper')}
              className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                reportType === 'web_scraper'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Idea 3 (Title Scraper)
            </button>
            <button
              onClick={() => setReportType('all')}
              className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                reportType === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Full 3-in-1 Suite Report
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-zinc-400">Author:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none w-44"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Markdown Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
          <pre className="whitespace-pre-wrap selection:bg-emerald-900 selection:text-emerald-100">
            {markdownContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="bg-zinc-950 px-6 py-3.5 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Format: Standard Markdown (.md) compatible with GitHub, Canvas, Blackboard, or Google Docs
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
