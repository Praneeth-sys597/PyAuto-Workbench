import React, { useState } from 'react';
import { TerminalLog, ScrapedPageRecord } from '../types';
import { SAMPLE_WEB_TARGETS } from '../data/tasksData';
import { 
  Globe, 
  Play, 
  Copy, 
  Download, 
  Check, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Code2
} from 'lucide-react';

interface TaskWebScraperProps {
  onAddLog: (log: Omit<TerminalLog, 'id' | 'timestamp'>) => void;
  onClearLogs: () => void;
}

export const TaskWebScraper: React.FC<TaskWebScraperProps> = ({
  onAddLog,
  onClearLogs,
}) => {
  const [selectedTarget, setSelectedTarget] = useState(SAMPLE_WEB_TARGETS[0].url);
  const [customUrl, setCustomUrl] = useState('');
  const [userAgent, setUserAgent] = useState(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  );
  const [parserMethod, setParserMethod] = useState<'re' | 'bs4'>('re');
  const [outputFilename, setOutputFilename] = useState('webpage_title.txt');
  const [isRunning, setIsRunning] = useState(false);
  const [scrapedRecords, setScrapedRecords] = useState<ScrapedPageRecord[]>([]);
  const [currentResult, setCurrentResult] = useState<ScrapedPageRecord | null>(null);
  const [copiedFile, setCopiedFile] = useState(false);

  const activeTargetData =
    SAMPLE_WEB_TARGETS.find((t) => t.url === selectedTarget) || {
      url: customUrl || 'https://example.org',
      name: 'Custom Webpage',
      simulatedStatus: 200,
      simulatedTitle: 'Example Domain - Automation Testbed',
      simulatedMeta: 'This domain is established to be used for illustrative examples.',
      simulatedHtml: `<!doctype html><html><head><title>Example Domain - Automation Testbed</title></head><body><h1>Example Domain</h1></body></html>`,
    };

  const currentUrl = selectedTarget === 'custom' ? customUrl : selectedTarget;

  const runScraper = async () => {
    if (isRunning || !currentUrl) return;
    setIsRunning(true);
    setCurrentResult(null);
    onClearLogs();

    onAddLog({
      type: 'command',
      text: `python scrape_title.py --url "${currentUrl}" --output "${outputFilename}"`,
    });

    await new Promise((r) => setTimeout(r, 280));

    onAddLog({
      type: 'info',
      text: `[requests.get] Preparing HTTP GET request for '${currentUrl}'`,
    });

    onAddLog({
      type: 'info',
      text: `[headers] User-Agent: "${userAgent.slice(0, 40)}..."`,
    });

    await new Promise((r) => setTimeout(r, 450));

    onAddLog({
      type: 'info',
      text: `[HTTP] Connected to remote server. Status Code: 200 OK (Content-Type: text/html)`,
    });

    await new Promise((r) => setTimeout(r, 350));

    onAddLog({
      type: 'info',
      text: `[response.raise_for_status()] Status check passed (no 4xx/5xx errors).`,
    });

    await new Promise((r) => setTimeout(r, 300));

    const titleExtracted = activeTargetData.simulatedTitle;

    if (parserMethod === 're') {
      onAddLog({
        type: 'info',
        text: `[re.search] Pattern: r'<title>(.*?)</title>' with flags re.IGNORECASE`,
      });
      onAddLog({
        type: 'success',
        text: `[re.search] Title captured: "${titleExtracted}"`,
      });
    } else {
      onAddLog({
        type: 'info',
        text: `[BeautifulSoup] Parsed HTML DOM tree -> soup.title.string`,
      });
      onAddLog({
        type: 'success',
        text: `[BeautifulSoup] Title isolated: "${titleExtracted}"`,
      });
    }

    await new Promise((r) => setTimeout(r, 350));

    onAddLog({
      type: 'info',
      text: `[open()] Writing title record to '${outputFilename}' with file handling context manager...`,
    });

    await new Promise((r) => setTimeout(r, 250));

    onAddLog({
      type: 'success',
      text: `[SUCCESS] Title saved to disk: "${titleExtracted}". Total execution time: 0.74s.`,
    });

    const newRecord: ScrapedPageRecord = {
      id: `scrape-${Date.now()}`,
      url: currentUrl,
      title: titleExtracted,
      statusCode: 200,
      extractedAt: new Date().toLocaleTimeString(),
      method: parserMethod,
      description: activeTargetData.simulatedMeta,
    };

    setCurrentResult(newRecord);
    setScrapedRecords((prev) => [newRecord, ...prev.filter((r) => r.url !== currentUrl)]);
    setIsRunning(false);
  };

  const generatedFileContent = currentResult
    ? `==============================================\nWEBPAGE TITLE SCRAPE RESULT\n==============================================\nTarget URL:    ${currentResult.url}\nHTTP Status:   ${currentResult.statusCode} OK\nExtracted At:  ${currentResult.extractedAt}\nMethod:        ${currentResult.method === 're' ? 'Python re.search regex' : 'BeautifulSoup (bs4)'}\n\nTitle:\n"${currentResult.title}"\n\nMeta Description:\n${currentResult.description || 'N/A'}\n==============================================`
    : '';

  const handleCopyFile = () => {
    navigator.clipboard.writeText(generatedFileContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([generatedFileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Target Webpage Selector and Configuration */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Target Webpage (<code className="text-emerald-400">requests.get(url)</code>)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SAMPLE_WEB_TARGETS.map((target) => (
              <button
                key={target.url}
                onClick={() => {
                  setSelectedTarget(target.url);
                  setCurrentResult(null);
                }}
                disabled={isRunning}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedTarget === target.url
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate text-zinc-200">{target.name}</span>
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 truncate block">
                  {target.url}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom URL Option */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
          <input
            type="text"
            placeholder="Or enter custom URL: https://example.com"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setSelectedTarget('custom');
              setCurrentResult(null);
            }}
            disabled={isRunning}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 font-mono outline-none"
          />
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Tested via HTTP GET
          </span>
        </div>

        {/* Configurations: User-Agent, Output filename, Parsing method */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Extraction Technique
            </label>
            <select
              value={parserMethod}
              onChange={(e) => setParserMethod(e.target.value as 're' | 'bs4')}
              disabled={isRunning}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none cursor-pointer"
            >
              <option value="re">Regex: re.search(r&apos;&lt;title&gt;(.*?)&lt;/title&gt;&apos;)</option>
              <option value="bs4">BeautifulSoup: soup.title.string</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Output Text File (<code className="text-emerald-400">open(..., &apos;w&apos;)</code>)
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              HTTP Header (<code className="text-emerald-400">User-Agent</code>)
            </label>
            <input
              type="text"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none truncate"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>Ready to request: <code className="text-zinc-200">{currentUrl}</code></span>
          </div>

          <button
            onClick={runScraper}
            disabled={isRunning || !currentUrl}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-emerald-950 font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-emerald-950" />
            <span>{isRunning ? 'Scraping Webpage...' : 'Run Python Title Scraper'}</span>
          </button>
        </div>
      </div>

      {/* Result Presentation Card */}
      {currentResult && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Scraped Webpage Title Extracted & Saved
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  &ldquo;{currentResult.title}&rdquo;
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleCopyFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium cursor-pointer"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Copied' : 'Copy Record'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold rounded-lg text-xs cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {outputFilename}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
              <span className="text-zinc-500 block mb-0.5">HTTP Status</span>
              <span className="font-mono text-emerald-400 font-semibold">{currentResult.statusCode} OK</span>
            </div>
            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
              <span className="text-zinc-500 block mb-0.5">Extracted Via</span>
              <span className="font-mono text-zinc-300">
                {currentResult.method === 're' ? 're.search(<title>)' : 'BeautifulSoup .title'}
              </span>
            </div>
            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
              <span className="text-zinc-500 block mb-0.5">Saved To Local Disk</span>
              <span className="font-mono text-emerald-300">{outputFilename}</span>
            </div>
          </div>
        </div>
      )}

      {/* HTML Response Viewer & Saved File Output Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mock HTML Response Viewer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Remote HTML Response (<code className="text-zinc-400">response.text</code>)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">requests.get</span>
          </div>

          <div className="p-3 bg-zinc-950 max-h-72 min-h-60 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
            <pre className="text-zinc-400 whitespace-pre-wrap">
              {activeTargetData.simulatedHtml}
            </pre>
          </div>
        </div>

        {/* Saved File Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Saved File Preview: {outputFilename}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">file.write()</span>
          </div>

          <div className="p-3 bg-zinc-950 max-h-72 min-h-60 overflow-y-auto font-mono text-xs text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800">
            {currentResult ? (
              <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                {generatedFileContent}
              </pre>
            ) : (
              <div className="text-zinc-500 text-xs text-center py-20 italic">
                Click &apos;Run Python Title Scraper&apos; to download webpage HTML, isolate title tag, and inspect file output.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
