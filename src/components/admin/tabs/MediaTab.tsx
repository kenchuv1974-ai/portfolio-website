import { useRef, useState } from 'react';
import { Check, Copy, FileText, Image as ImageIcon, Upload } from 'lucide-react';
import { processFileUpload } from '../../../services/storageService';
import type { PortfolioData } from '../../../types/portfolio';

interface MediaTabProps {
  data: PortfolioData;
  onShowToast: (title: string, message: string, type: 'success' | 'error') => void;
}

export default function MediaTab({ data, onShowToast }: MediaTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast('Copied to Clipboard', 'Media URL copied successfully.', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenericUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUri = await processFileUpload(file);
      copyToClipboard(dataUri, 'uploaded-temp');
      onShowToast('Upload Successful', `File "${file.name}" uploaded and Data URI copied to clipboard!`, 'success');
    } catch (err) {
      onShowToast('Upload Failed', (err as Error).message, 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-red-500" />
          <span>Media & Document Storage Manager</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Manage portraits, project visuals, certificates, and resume documents with persistent storage.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-zinc-700/80 hover:border-red-500/60 bg-zinc-900/40 p-8 text-center cursor-pointer transition flex flex-col items-center justify-center group"
      >
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-red-400 group-hover:border-red-500/50 mb-3 transition shadow-lg">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-sm font-semibold text-zinc-200">
          Click or drop file to upload to Media Storage
        </div>
        <div className="text-xs text-zinc-500 mt-1 font-mono">
          Supports PNG, WebP, JPG, and PDF (Max 8MB per file)
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,application/pdf"
          onChange={handleGenericUpload}
          className="hidden"
        />
      </div>

      {/* Currently Referenced Media Assets */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase text-zinc-400">
          Active Core Media Assets
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Portrait Card */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex items-start gap-4">
            <div className="w-20 h-24 rounded-xl overflow-hidden border border-red-500/30 bg-zinc-950 shrink-0">
              <img
                src={data.profile.portrait.src}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-red-400 font-bold">
                  Billboard Portrait
                </span>
                <span className="text-[10px] font-mono text-zinc-500">HERO IMAGE</span>
              </div>
              <p className="text-xs text-zinc-400 truncate mb-3">
                {data.profile.portrait.src.substring(0, 45)}...
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(data.profile.portrait.src, 'portrait')}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === 'portrait' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Asset URL</span>
              </button>
            </div>
          </div>

          {/* Resume PDF Card */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex items-start gap-4">
            <div className="w-20 h-24 rounded-xl border border-red-500/30 bg-zinc-950 flex flex-col items-center justify-center text-red-500 shrink-0">
              <FileText className="w-8 h-8" />
              <span className="text-[10px] font-mono mt-1 text-zinc-400">PDF</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-red-400 font-bold">
                  Resume Document
                </span>
                <span className="text-[10px] font-mono text-zinc-500">PUBLIC PDF</span>
              </div>
              <p className="text-xs text-zinc-400 truncate mb-3">
                {data.profile.resumePdf
                  ? `${data.profile.resumePdf.substring(0, 45)}...`
                  : 'No resume attached (manage in Profile tab)'}
              </p>
              <div className="flex items-center gap-2">
                {data.profile.resumePdf && (
                  <>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(data.profile.resumePdf, 'resume')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedKey === 'resume' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Link</span>
                    </button>
                    <a
                      href={data.profile.resumePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/40 text-xs font-mono transition"
                    >
                      View
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
