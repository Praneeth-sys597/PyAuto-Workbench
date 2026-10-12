import React, { useState } from 'react';
import { VirtualFile, TerminalLog } from '../types';
import { INITIAL_FILES } from '../data/tasksData';
import { 
  Folder, 
  FolderArchive, 
  FileText, 
  Image as ImageIcon, 
  FileMusic, 
  FileCheck, 
  Play, 
  RotateCcw, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  FolderPlus,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface TaskFileMoverProps {
  onAddLog: (log: Omit<TerminalLog, 'id' | 'timestamp'>) => void;
  onClearLogs: () => void;
}

export const TaskFileMover: React.FC<TaskFileMoverProps> = ({ onAddLog, onClearLogs }) => {
  const [files, setFiles] = useState<VirtualFile[]>(() =>
    INITIAL_FILES.map((f, idx) => ({
      id: `file-${idx}`,
      name: f.name,
      extension: f.name.slice(f.name.lastIndexOf('.')),
      sizeKb: f.sizeKb,
      folder: f.folder,
      lastModified: '2026-03-28 10:20',
    }))
  );

  const [isRunning, setIsRunning] = useState(false);
  const [sourceDir, setSourceDir] = useState('./downloads');
  const [destDir, setDestDir] = useState('./jpg_photos');
  const [selectedExtension, setSelectedExtension] = useState('.jpg');
  const [newFileName, setNewFileName] = useState('');
  const [completedStats, setCompletedStats] = useState<{
    moved: number;
    scanned: number;
    skipped: number;
    totalSizeKb: number;
  } | null>(null);

  const sourceFiles = files.filter((f) => f.folder === 'source');
  const destFiles = files.filter((f) => f.folder === 'destination');

  const getFileIcon = (ext: string) => {
    const lower = ext.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(lower)) {
      return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
    if (['.mp3', '.wav', '.flac'].includes(lower)) {
      return <FileMusic className="w-4 h-4 text-amber-400" />;
    }
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  const handleReset = () => {
    setFiles(
      INITIAL_FILES.map((f, idx) => ({
        id: `file-${idx}`,
        name: f.name,
        extension: f.name.slice(f.name.lastIndexOf('.')),
        sizeKb: f.sizeKb,
        folder: 'source',
        lastModified: '2026-03-28 10:20',
      }))
    );
    setCompletedStats(null);
    onClearLogs();
    onAddLog({
      type: 'info',
      text: 'Virtual filesystem reset to initial state. Ready for automation.',
    });
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const cleanName = newFileName.trim();
    const ext = cleanName.includes('.') ? cleanName.slice(cleanName.lastIndexOf('.')) : '.jpg';
    const newFile: VirtualFile = {
      id: `custom-${Date.now()}`,
      name: cleanName,
      extension: ext,
      sizeKb: Math.floor(Math.random() * 3000) + 500,
      folder: 'source',
      lastModified: new Date().toLocaleTimeString(),
    };
    setFiles((prev) => [newFile, ...prev]);
    setNewFileName('');
    onAddLog({
      type: 'info',
      text: `Added file '${cleanName}' to ${sourceDir}/`,
    });
  };

  const runAutomation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedStats(null);
    onClearLogs();

    onAddLog({
      type: 'command',
      text: `python move_jpg_files.py --source ${sourceDir} --dest ${destDir}`,
    });

    await new Promise((r) => setTimeout(r, 300));

    onAddLog({
      type: 'info',
      text: `[os.path.exists] Checking if destination directory '${destDir}' exists...`,
    });

    await new Promise((r) => setTimeout(r, 350));

    onAddLog({
      type: 'info',
      text: `[os.makedirs] Destination folder created: '${destDir}' (exist_ok=True)`,
    });

    await new Promise((r) => setTimeout(r, 300));

    onAddLog({
      type: 'info',
      text: `[os.listdir] Reading contents of '${sourceDir}'... Found ${sourceFiles.length} files.`,
    });

    const targetExt = selectedExtension.toLowerCase();
    const matchingFiles = sourceFiles.filter((f) => f.name.toLowerCase().endsWith(targetExt));
    const nonMatchingFiles = sourceFiles.filter((f) => !f.name.toLowerCase().endsWith(targetExt));

    let movedSoFar = 0;
    let totalMovedKb = 0;

    for (const file of matchingFiles) {
      await new Promise((r) => setTimeout(r, 450));
      onAddLog({
        type: 'info',
        text: `[shutil.move] Relocating: ${sourceDir}/${file.name} -> ${destDir}/${file.name}`,
      });

      // Update state live
      setFiles((prev) =>
        prev.map((item) => (item.id === file.id ? { ...item, folder: 'destination' } : item))
      );
      movedSoFar += 1;
      totalMovedKb += file.sizeKb;
    }

    await new Promise((r) => setTimeout(r, 350));

    onAddLog({
      type: 'success',
      text: `[COMPLETE] Processed ${sourceFiles.length} files. Relocated ${movedSoFar} ${targetExt} files (${(
        totalMovedKb / 1024
      ).toFixed(2)} MB). ${nonMatchingFiles.length} non-matching files remained untouched.`,
    });

    setCompletedStats({
      moved: movedSoFar,
      scanned: sourceFiles.length,
      skipped: nonMatchingFiles.length,
      totalSizeKb: totalMovedKb,
    });

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Action Ribbon */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Source Directory */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Source Folder (<code className="text-emerald-400">os.listdir</code>)
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200">
                <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={sourceDir}
                  onChange={(e) => setSourceDir(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-zinc-200"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Destination Directory */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Destination Folder (<code className="text-emerald-400">os.makedirs</code>)
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200">
                <FolderArchive className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={destDir}
                  onChange={(e) => setDestDir(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-zinc-200"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Target Extension */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Target Extension Filter (<code className="text-emerald-400">.endswith()</code>)
              </label>
              <select
                value={selectedExtension}
                onChange={(e) => setSelectedExtension(e.target.value)}
                disabled={isRunning}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 outline-none cursor-pointer"
              >
                <option value=".jpg">.jpg (JPEG Images - Default)</option>
                <option value=".png">.png (PNG Images)</option>
                <option value=".pdf">.pdf (Documents)</option>
                <option value=".mp3">.mp3 (Audio Tracks)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 shrink-0">
            <button
              onClick={runAutomation}
              disabled={isRunning || sourceFiles.filter((f) => f.name.toLowerCase().endsWith(selectedExtension.toLowerCase())).length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-emerald-950 font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              <span>{isRunning ? 'Moving Files...' : 'Run Python File Mover'}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isRunning}
              className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              title="Reset virtual folder files"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Add Custom File */}
        <form onSubmit={handleAddFile} className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 shrink-0 hidden sm:inline">
            Test custom file:
          </span>
          <input
            type="text"
            placeholder="e.g. sample_holiday_photo.jpg or test_document.txt"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            disabled={isRunning}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
          />
          <button
            type="submit"
            disabled={isRunning || !newFileName.trim()}
            className="px-2.5 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Completion Summary Banner */}
      {completedStats && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-emerald-300">
                Automation Successful: {completedStats.moved} file(s) relocated to <code className="text-white">{destDir}/</code>
              </p>
              <p className="text-zinc-400 text-[11px]">
                Scanned {completedStats.scanned} files | Skipped {completedStats.skipped} non-{selectedExtension} files | Total size: {(completedStats.totalSizeKb / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono bg-emerald-900/30 px-3 py-1 rounded-md border border-emerald-800/40">
            Exit Code: 0 (OK)
          </div>
        </div>
      )}

      {/* Dual Virtual Filesystem View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Folder Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Source: {sourceDir}/
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                {sourceFiles.length} files
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">os.listdir()</span>
          </div>

          <div className="p-3 max-h-72 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 min-h-56">
            {sourceFiles.length === 0 ? (
              <div className="text-zinc-500 text-xs text-center py-10 italic">
                All matching files have been moved! Source directory is clean.
              </div>
            ) : (
              sourceFiles.map((file) => {
                const isTarget = file.name.toLowerCase().endsWith(selectedExtension.toLowerCase());
                return (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                      isTarget
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/60'
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(file.extension)}
                      <span className="font-mono truncate">{file.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {(file.sizeKb / 1024).toFixed(1)} MB
                      </span>
                      {isTarget && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                          Target
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Destination Folder Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Destination: {destDir}/
              </span>
              <span className="text-[10px] bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                {destFiles.length} files
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">shutil.move()</span>
          </div>

          <div className="p-3 max-h-72 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 min-h-56">
            {destFiles.length === 0 ? (
              <div className="text-zinc-500 text-xs text-center py-10 italic">
                Destination directory will receive files once script executes.
              </div>
            ) : (
              destFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-zinc-950/60 border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono truncate">{file.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {(file.sizeKb / 1024).toFixed(1)} MB
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-emerald-400 rounded font-mono">
                      ✓ Moved
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
