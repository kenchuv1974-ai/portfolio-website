import { useRef } from 'react';
import { Camera, ExternalLink, FileText, Globe, Mail, RotateCcw, Trash2, Upload } from 'lucide-react';
import { processFileUpload } from '../../../services/storageService';
import type { PortfolioData } from '../../../types/portfolio';

interface ProfileTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error') => void;
}

export default function ProfileTab({ data, onChange, onShowToast }: ProfileTabProps) {
  const p = data.profile;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof typeof p, value: unknown) => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const updateLinks = (key: string, val: string) => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        links: {
          ...prev.profile.links,
          [key]: val,
        },
      },
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUri = await processFileUpload(file);
      onChange((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          portrait: {
            ...prev.profile.portrait,
            src: dataUri,
            srcSet: '', // Cleared so uploaded image takes precedence
          },
        },
      }));
      onShowToast('Profile Photo Updated', 'Uploaded new portrait successfully.', 'success');
    } catch (err) {
      onShowToast('Upload Failed', (err as Error).message, 'error');
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      onShowToast('Invalid File', 'Please upload a PDF document for your resume.', 'error');
      return;
    }

    try {
      const dataUri = await processFileUpload(file);
      onChange((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          resumePdf: dataUri,
        },
      }));
      onShowToast('Resume PDF Updated', 'Uploaded new resume successfully.', 'success');
    } catch (err) {
      onShowToast('Upload Failed', (err as Error).message, 'error');
    } finally {
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handleDeleteResume = () => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        resumePdf: '',
      },
    }));
    onShowToast('Resume Removed', 'Cleared resume document. Public download button will be hidden.', 'success');
  };

  const handleResetResume = () => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        resumePdf: './assets/Sushmita_Dasari_Resume.pdf',
      },
    }));
    onShowToast('Resume Restored', 'Reverted back to original bundle resume PDF.', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Photo & Resume Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
        
        {/* Portrait Preview */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group w-36 h-48 rounded-xl overflow-hidden border-2 border-red-500/40 bg-zinc-950 mb-3 shadow-xl">
            <img
              src={p.portrait.src}
              alt={p.portrait.alt || p.displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition cursor-pointer"
            >
              <Camera className="w-6 h-6 mb-1 text-red-400" />
              <span>Change Photo</span>
            </button>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer mb-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Portrait</span>
          </button>
          <span className="text-[11px] text-zinc-500">PNG, JPG or WebP (Max 8MB)</span>
        </div>

        {/* Profile Basic Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={p.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Display Name (Brand)
              </label>
              <input
                type="text"
                value={p.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Opening Title / First Name
              </label>
              <input
                type="text"
                value={p.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="e.g. SUSHMITA"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-['Bebas_Neue',sans-serif] tracking-wider text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Series Tagline
              </label>
              <input
                type="text"
                value={p.seriesTag}
                onChange={(e) => updateField('seriesTag', e.target.value)}
                placeholder="e.g. THE SERIES"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-['Bebas_Neue',sans-serif] tracking-wider text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Studio Card Label
              </label>
              <input
                type="text"
                value={p.originalLabel}
                onChange={(e) => updateField('originalLabel', e.target.value)}
                placeholder="e.g. A DASARI ORIGINAL"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Professional Role Headline
              </label>
              <input
                type="text"
                value={p.role}
                onChange={(e) => updateField('role', e.target.value)}
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Tagline Chips (Comma Separated)
              </label>
              <input
                type="text"
                value={p.tagline.join(', ')}
                onChange={(e) => updateField('tagline', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="Full-Stack Developer, AI / ML, Java"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bio & Details */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
          Bio, Location & Social Links
        </h3>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
            Introductory Narrative (Billboard Bio)
          </label>
          <textarea
            rows={3}
            value={p.intro}
            onChange={(e) => updateField('intro', e.target.value)}
            className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              value={p.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={p.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={p.links.linkedin || ''}
              onChange={(e) => updateLinks('linkedin', e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={p.links.github || ''}
              onChange={(e) => updateLinks('github', e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Interests (Comma Separated)
            </label>
            <input
              type="text"
              value={p.interests.join(', ')}
              onChange={(e) => updateField('interests', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="System Design, Cloud Computing (AWS), Machine Learning"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Availability Status
            </label>
            <input
              type="text"
              value={p.availabilityStatus || ''}
              onChange={(e) => updateField('availabilityStatus', e.target.value)}
              placeholder="Open to Opportunities"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Resume PDF Controls & Management */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-zinc-200 flex items-center gap-1.5 font-bold">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Resume PDF Document Management</span>
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                Controls the resume linked in the hero CTA button, top navigation, and screenplay viewer.
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {p.resumePdf ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {p.resumePdf.startsWith('data:') ? 'Custom Uploaded PDF' : 'Attached'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                  No Resume Attached
                </span>
              )}
            </div>
          </div>

          {/* Editable URL Input */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Resume Document Link or Data URI (Edit / Paste custom URL)
            </label>
            <input
              type="text"
              value={p.resumePdf || ''}
              onChange={(e) => updateField('resumePdf', e.target.value)}
              placeholder="e.g. ./assets/Sushmita_Dasari_Resume.pdf or https://drive.google.com/..."
              className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-950/40"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New PDF</span>
              </button>

              {p.resumePdf && (
                <a
                  href={p.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-zinc-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Preview PDF</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetResume}
                title="Reset to original bundle PDF"
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to Default</span>
              </button>

              {p.resumePdf && (
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  title="Remove resume document"
                  className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-900/60 hover:bg-red-900/50 text-red-400 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Resume</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
