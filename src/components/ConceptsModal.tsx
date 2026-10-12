import React, { useState } from 'react';
import { X, BookOpen, Layers, Terminal, Copy, Check, CheckCircle2 } from 'lucide-react';

interface ConceptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptsModal: React.FC<ConceptsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'os_shutil' | 're' | 'requests' | 'file_handling'>('os_shutil');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Key Concepts Reference Guide
              </h2>
              <p className="text-xs text-zinc-400">
                Mastering Python Standard Library & HTTP automation for Task 3
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

        {/* Tab Navigation */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'os_shutil', label: '1. os & shutil (Filesystem)', badge: 'Directories & Moving' },
            { id: 're', label: '2. re (Regular Expressions)', badge: 'Pattern Search' },
            { id: 'requests', label: '3. requests (HTTP Client)', badge: 'Web Scraping' },
            { id: 'file_handling', label: '4. File Handling (open & with)', badge: 'Safe I/O' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
          {activeTab === 'os_shutil' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-300 text-sm mb-1">
                  Why Use <code>os</code> and <code>shutil</code> Together?
                </h3>
                <p className="text-zinc-400">
                  The <code className="text-zinc-200">os</code> module is part of Python&apos;s standard library and provides direct interaction with the operating system (listing directories, joining file paths, creating folders). Meanwhile, <code className="text-zinc-200">shutil</code> (Shell Utilities) specializes in high-level file operations such as moving, copying, and archiving.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Essential <code>os</code> Functions
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li>
                      <code className="text-emerald-300 font-mono">os.listdir(path)</code>: Returns a list of all filenames in the target directory.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">os.path.join(a, b)</code>: Automatically joins path components with the correct separator (<code className="text-zinc-200">/</code> on Linux/Mac, <code className="text-zinc-200">\</code> on Windows).
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">os.makedirs(path, exist_ok=True)</code>: Creates directories recursively. Prevents crashes if the directory already exists.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">filename.lower().endswith(&quot;.jpg&quot;)</code>: Case-insensitive extension check.
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Essential <code>shutil</code> Functions
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li>
                      <code className="text-emerald-300 font-mono">shutil.move(src, dst)</code>: Moves a file or directory to a new location. Handles cross-filesystem drives automatically by copying then removing the source.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">shutil.copy2(src, dst)</code>: Copies file while preserving original timestamps and metadata.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">shutil.rmtree(path)</code>: Recursively deletes an entire folder tree.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-zinc-400 text-[11px]">Canonical Pattern: Move All .jpg Files</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `import os\nimport shutil\n\nos.makedirs("./jpg_dest", exist_ok=True)\nfor file in os.listdir("./source"):\n    if file.lower().endswith(".jpg"):\n        shutil.move(os.path.join("./source", file), os.path.join("./jpg_dest", file))`,
                        'code-mover'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {copiedSnippet === 'code-mover' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'code-mover' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-emerald-300 text-xs bg-zinc-900/80 p-3 rounded-lg overflow-x-auto">
{`import os
import shutil

os.makedirs("./jpg_dest", exist_ok=True)
for file in os.listdir("./source"):
    if file.lower().endswith(".jpg"):
        shutil.move(
            os.path.join("./source", file),
            os.path.join("./jpg_dest", file)
        )`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 're' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-300 text-sm mb-1">
                  How Python&apos;s <code>re</code> Module Handles String Extraction
                </h3>
                <p className="text-zinc-400">
                  The <code className="text-zinc-200">re</code> module provides regular expression matching operations. Instead of manually parsing every line and looking for &apos;@&apos;, regex allows defining a pattern that describes an email structure across thousands of lines instantaneously.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2">Regex Anatomy for Emails</h4>
                  <div className="space-y-2 text-zinc-400 font-mono text-[11px]">
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-emerald-400">[a-zA-Z0-9._%+-]+</span>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Matches username: letters, digits, dots, plus, percent, hyphens</p>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-emerald-400">@</span>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Matches the mandatory at symbol</p>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-emerald-400">[a-zA-Z0-9.-]+</span>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Matches domain name host (e.g., google, acme-corp)</p>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-emerald-400">\.[a-zA-Z]&#123;2,&#125;</span>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Matches literal dot followed by at least 2 letters (.com, .org, .edu)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2">Core Regex Functions</h4>
                  <ul className="space-y-2.5 text-zinc-400">
                    <li>
                      <code className="text-emerald-300 font-mono">re.findall(pattern, string)</code>: Returns all non-overlapping matches in the string as a list of strings.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">re.search(pattern, string)</code>: Searches the string for the first match and returns a Match object.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">re.compile(pattern)</code>: Pre-compiles the regex pattern for faster execution when used in loops.
                    </li>
                    <li>
                      <code className="text-emerald-300 font-mono">set(found_emails)</code>: Effortlessly removes duplicates from the extracted list.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-300 text-sm mb-1">
                  HTTP Automation with <code>requests</code>
                </h3>
                <p className="text-zinc-400">
                  The <code className="text-zinc-200">requests</code> package is Python&apos;s de facto standard for HTTP requests. It is human-friendly, handles SSL certificates, keeps connection pools open, and automatically decodes UTF-8 HTML responses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2">Best Practices for Web Scraping</h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li>
                      <strong>Always set a User-Agent header:</strong> Prevents 403 Forbidden errors because default <code className="text-emerald-300 font-mono">python-requests</code> is often blocked by Cloudflare or Akamai.
                    </li>
                    <li>
                      <strong>Always set a timeout:</strong> <code className="text-emerald-300 font-mono">requests.get(url, timeout=10)</code> prevents scripts from hanging indefinitely if a remote server stops responding.
                    </li>
                    <li>
                      <strong>Check status codes:</strong> <code className="text-emerald-300 font-mono">response.raise_for_status()</code> ensures execution halts on 404 or 500 errors.
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-semibold text-zinc-200 mb-2">Extracting &lt;title&gt; with Regex vs BeautifulSoup</h4>
                  <p className="text-zinc-400 mb-2">
                    Using Regex (<code className="text-emerald-300 font-mono">re</code>):
                  </p>
                  <pre className="bg-zinc-900 p-2 rounded text-[11px] font-mono text-emerald-300 mb-2">
match = re.search(r&quot;&lt;title&gt;(.*?)&lt;/title&gt;&quot;, response.text, re.I)
title = match.group(1).strip()
                  </pre>
                  <p className="text-zinc-400">
                    Does not require installing external parsers like BeautifulSoup, making it ideal for lightweight tasks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'file_handling' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-300 text-sm mb-1">
                  Modern Python File Handling: <code>with open(...)</code>
                </h3>
                <p className="text-zinc-400">
                  In legacy code, developers used <code className="text-zinc-200">f = open(&quot;...&quot;); f.close()</code>. If an error occurred between open and close, file descriptors were leaked. Python&apos;s context manager (<code className="text-emerald-300 font-mono">with open()</code>) guarantees safe resource release under all circumstances.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <span className="font-mono text-emerald-400 font-semibold block mb-1">Mode &apos;r&apos; (Read)</span>
                  <p className="text-zinc-400 text-[11px]">
                    Opens file for reading text. Throws <code className="text-rose-400">FileNotFoundError</code> if file does not exist.
                  </p>
                </div>
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <span className="font-mono text-emerald-400 font-semibold block mb-1">Mode &apos;w&apos; (Write)</span>
                  <p className="text-zinc-400 text-[11px]">
                    Creates file if missing, or overwrites existing content completely from beginning.
                  </p>
                </div>
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <span className="font-mono text-emerald-400 font-semibold block mb-1">Mode &apos;a&apos; (Append)</span>
                  <p className="text-zinc-400 text-[11px]">
                    Preserves existing file content and appends new lines at the end. Ideal for activity logs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 px-6 py-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg cursor-pointer transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
