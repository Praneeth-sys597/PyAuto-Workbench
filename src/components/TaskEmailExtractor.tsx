import React, { useState, useMemo } from 'react';
import { TerminalLog } from '../types';
import { SAMPLE_TEXT_FILES } from '../data/tasksData';
import { 
  FileText, 
  MailCheck, 
  Play, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Upload,
  RefreshCw
} from 'lucide-react';

interface TaskEmailExtractorProps {
  onAddLog: (log: Omit<TerminalLog, 'id' | 'timestamp'>) => void;
  onClearLogs: () => void;
}

export const TaskEmailExtractor: React.FC<TaskEmailExtractorProps> = ({
  onAddLog,
  onClearLogs,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('client_inquiries');
  const [rawText, setRawText] = useState<string>(SAMPLE_TEXT_FILES.client_inquiries.content);
  const [inputFilename, setInputFilename] = useState('contacts_raw.txt');
  const [outputFilename, setOutputFilename] = useState('extracted_emails.txt');
  const [regexPattern, setRegexPattern] = useState(
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
  );
  const [deduplicate, setDeduplicate] = useState(true);
  const [sortAlphabetical, setSortAlphabetical] = useState(true);
  const [domainFilter, setDomainFilter] = useState('all');

  const [isRunning, setIsRunning] = useState(false);
  const [extractedList, setExtractedList] = useState<string[]>([]);
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});
  const [hasRun, setHasRun] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  // Switch presets
  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    if (SAMPLE_TEXT_FILES[key]) {
      setRawText(SAMPLE_TEXT_FILES[key].content);
      setInputFilename(`${key}.txt`);
      setHasRun(false);
      setExtractedList([]);
    }
  };

  // Run the Python script simulation
  const runExtraction = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasRun(false);
    onClearLogs();

    onAddLog({
      type: 'command',
      text: `python extract_emails.py --input ${inputFilename} --output ${outputFilename}`,
    });

    await new Promise((r) => setTimeout(r, 250));

    onAddLog({
      type: 'info',
      text: `[open()] Reading input file '${inputFilename}' using context manager (utf-8)...`,
    });

    await new Promise((r) => setTimeout(r, 300));

    // Regex matching
    const emailRegex = new RegExp(
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      'gi'
    );
    const matches = rawText.match(emailRegex) || [];

    onAddLog({
      type: 'info',
      text: `[re.findall] Compiled regex pattern: '${regexPattern}'`,
    });

    await new Promise((r) => setTimeout(r, 300));

    onAddLog({
      type: 'info',
      text: `[re.findall] Discovered ${matches.length} total email matches in source text.`,
    });

    // Counts
    const counts: Record<string, number> = {};
    matches.forEach((m) => {
      const lower = m.toLowerCase();
      counts[lower] = (counts[lower] || 0) + 1;
    });

    // Filtering & deduplicating
    let finalEmails = deduplicate ? Object.keys(counts) : matches.map((m) => m.toLowerCase());

    if (domainFilter !== 'all') {
      finalEmails = finalEmails.filter((em) => em.endsWith(domainFilter));
    }

    if (sortAlphabetical) {
      finalEmails.sort();
    }

    await new Promise((r) => setTimeout(r, 300));

    if (deduplicate) {
      onAddLog({
        type: 'info',
        text: `[set()] Deduplicated list: ${matches.length} raw matches -> ${finalEmails.length} unique addresses.`,
      });
    }

    await new Promise((r) => setTimeout(r, 300));

    onAddLog({
      type: 'info',
      text: `[open()] Writing results to output stream '${outputFilename}' (mode="w")...`,
    });

    await new Promise((r) => setTimeout(r, 250));

    onAddLog({
      type: 'success',
      text: `[SUCCESS] Output written to '${outputFilename}'. Extraction completed with 0 errors.`,
    });

    setExtractedList(finalEmails);
    setMatchCounts(counts);
    setHasRun(true);
    setIsRunning(false);
  };

  const outputContentText = extractedList.join('\n');

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputContentText);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleDownloadOutput = () => {
    const blob = new Blob([outputContentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawText(text);
        setInputFilename(file.name);
        setSelectedPreset('custom');
        setHasRun(false);
        setExtractedList([]);
        onAddLog({
          type: 'info',
          text: `Loaded uploaded file '${file.name}' (${(file.size / 1024).toFixed(1)} KB)`,
        });
      };
      reader.readAsText(file);
    }
  };

  // Distinct domains detected
  const uniqueDomains = useMemo(() => {
    const domains = new Set<string>();
    extractedList.forEach((e) => {
      const parts = e.split('@');
      if (parts[1]) domains.add(parts[1]);
    });
    return Array.from(domains);
  }, [extractedList]);

  return (
    <div className="space-y-6">
      {/* Configuration & Preset Ribbon */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Presets and Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-zinc-400">Sample Text Files:</span>
            {Object.entries(SAMPLE_TEXT_FILES).map(([key, item]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                disabled={isRunning}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  selectedPreset === key
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer transition-colors self-start sm:self-auto">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload .txt File</span>
            <input
              type="file"
              accept=".txt,.log,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isRunning}
            />
          </label>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Input File Name (<code className="text-emerald-400">open(..., 'r')</code>)
            </label>
            <input
              type="text"
              value={inputFilename}
              onChange={(e) => setInputFilename(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Output File Name (<code className="text-emerald-400">open(..., 'w')</code>)
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none"
            />
          </div>

          <div className="flex items-end gap-3 pb-0.5">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deduplicate}
                onChange={(e) => setDeduplicate(e.target.checked)}
                disabled={isRunning}
                className="rounded accent-emerald-500 cursor-pointer"
              />
              <span>Deduplicate (<code className="text-emerald-400">set()</code>)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sortAlphabetical}
                onChange={(e) => setSortAlphabetical(e.target.checked)}
                disabled={isRunning}
                className="rounded accent-emerald-500 cursor-pointer"
              />
              <span>Sort (<code className="text-emerald-400">sorted()</code>)</span>
            </label>
          </div>
        </div>

        {/* Regex Anatomy Info Card */}
        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-zinc-200">
              Regex Pattern Used: <code className="text-emerald-300 font-mono">r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;'</code>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-zinc-400">
            <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
              <span className="text-emerald-400 font-mono block">[a-zA-Z0-9._%+-]+</span>
              Username: Alphanumeric and common symbols before @
            </div>
            <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
              <span className="text-emerald-400 font-mono block">@[a-zA-Z0-9.-]+</span>
              Domain: Literal @ followed by domain host name
            </div>
            <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
              <span className="text-emerald-400 font-mono block">\.[a-zA-Z]&#123;2,&#125;</span>
              Top-Level Domain: Literal dot with 2+ characters (.com, .org, .ai)
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-zinc-400">
            Characters in file: <strong className="text-zinc-200 font-mono">{rawText.length}</strong>
          </span>

          <button
            onClick={runExtraction}
            disabled={isRunning || !rawText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-emerald-950 font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-emerald-950" />
            <span>{isRunning ? 'Extracting Emails...' : 'Run Python Email Extractor'}</span>
          </button>
        </div>
      </div>

      {/* Results banner */}
      {hasRun && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-emerald-300">
                Extraction Successful: {extractedList.length} unique emails isolated & saved to <code className="text-white">{outputFilename}</code>
              </p>
              <p className="text-zinc-400 text-[11px]">
                Analyzed across {uniqueDomains.length} unique domains: {uniqueDomains.slice(0, 4).join(', ')}{uniqueDomains.length > 4 ? '...' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOutput}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium cursor-pointer"
            >
              {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedResult ? 'Copied' : 'Copy Emails'}</span>
            </button>
            <button
              onClick={handleDownloadOutput}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold rounded-lg text-xs cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {outputFilename}</span>
            </button>
          </div>
        </div>
      )}

      {/* Dual Panel: Raw Text on Left, Extracted Output on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Text Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Input: {inputFilename}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Editable / Raw Text</span>
          </div>

          <div className="p-2 flex-1 flex flex-col">
            <textarea
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setHasRun(false);
              }}
              disabled={isRunning}
              placeholder="Paste or write text containing email addresses here..."
              className="w-full h-80 bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 text-xs font-mono text-zinc-300 resize-none outline-none leading-relaxed focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Output Text & Breakdown Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MailCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Output: {outputFilename}
              </span>
              {hasRun && (
                <span className="text-[10px] bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
                  {extractedList.length} items
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyOutput}
                disabled={!hasRun || extractedList.length === 0}
                className="p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                title="Copy clean list"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownloadOutput}
                disabled={!hasRun || extractedList.length === 0}
                className="p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                title="Download extracted_emails.txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col max-h-80 overflow-y-auto min-h-80 scrollbar-thin scrollbar-thumb-zinc-800">
            {!hasRun ? (
              <div className="text-zinc-500 text-xs text-center py-24 italic select-none">
                Click &apos;Run Python Email Extractor&apos; to process text, isolate email addresses, and write to file.
              </div>
            ) : extractedList.length === 0 ? (
              <div className="text-amber-400/80 text-xs text-center py-24 select-none">
                No valid email patterns found matching the regex.
              </div>
            ) : (
              <div className="space-y-1.5">
                {extractedList.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-zinc-600 font-mono w-5">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span className="font-mono text-emerald-300 select-all truncate">
                        {email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        @{email.split('@')[1]}
                      </span>
                      {matchCounts[email] > 1 && (
                        <span className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
                          {matchCounts[email]}x
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
