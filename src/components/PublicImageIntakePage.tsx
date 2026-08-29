import React, { useState } from 'react';
import { 
  Upload, Image as ImageIcon, CheckCircle, Video, Play, 
  Trash2, X, ShieldCheck, Clock, Sparkles, Check, Send
} from 'lucide-react';

interface PublicImageIntakePageProps {
  serverUrl?: string;
}

export default function PublicImageIntakePage({ serverUrl = window.location.origin }: PublicImageIntakePageProps) {
  // Query param parsing
  const queryParams = new URLSearchParams(window.location.search);
  const initialName = queryParams.get('name') || queryParams.get('leadName') || '';
  const initialEmail = queryParams.get('email') || queryParams.get('leadEmail') || '';
  const leadIdParam = queryParams.get('leadId') || queryParams.get('id') || '';
  const campaignParam = queryParams.get('campaign') || '';

  const [name, setName] = useState<string>(initialName);
  const [email, setEmail] = useState<string>(initialEmail);
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<{ url: string; name: string; size?: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedName, setSubmittedName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active step indicator
  const [activeStep, setActiveStep] = useState<number>(1);

  // Handle Drag & Drop / File Select
  const handleFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select image files (PNG, JPG, WEBP, GIF)');
        return;
      }

      if (file.size > 12 * 1024 * 1024) {
        setErrorMsg('Images should be under 12MB each.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        if (resultUrl) {
          setImages(prev => [
            ...prev,
            { url: resultUrl, name: file.name, size: file.size }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name or business name in Step 2.');
      setActiveStep(2);
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please upload at least 1 image or screenshot in Step 1.');
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${serverUrl}/api/public/submit-intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          notes: notes.trim(),
          images,
          leadId: leadIdParam,
          campaign: campaignParam
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubmitted(true);
        setSubmittedName(name.trim());
      } else {
        setErrorMsg(data.error || 'Failed to submit images. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(`Network error: ${err.message || 'Please check connection'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Top Banner Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-sm">
              <Video size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900">Visual Spec Intake Portal</h1>
              <p className="text-xs text-slate-500">Direct Screenshot & Image Submission</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            <Clock size={14} className="animate-pulse text-emerald-600" />
            <span>Guaranteed Video Delivery Today</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8 flex-1">
        {/* Intro Message & Walkthrough Demo Cards */}
        {!submitted && (
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
              <Sparkles size={13} className="text-blue-600" />
              <span>Simple 1-Minute Submission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Upload Your Screenshots & Specs
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              No back-and-forth emails needed. Simply upload your screenshots or project images below. You will receive your customized video walkthrough by the end of the day.
            </p>

            {/* Walkthrough Demo Pictures / Visual Example Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-left">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 relative overflow-hidden shadow-xs hover:shadow-md transition">
                <div className="flex items-center gap-2 text-blue-700 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] text-blue-700 font-black">1</span>
                  <span>Upload Screenshots</span>
                </div>
                {/* Mockup Demo Picture */}
                <div className="h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 text-center text-slate-500">
                  <div className="space-y-1">
                    <ImageIcon size={22} className="mx-auto text-blue-600/70" />
                    <p className="text-[11px] font-medium text-slate-500">Wireframes, UI, or Specs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 relative overflow-hidden shadow-xs hover:shadow-md transition">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] text-indigo-700 font-black">2</span>
                  <span>We Review & Record</span>
                </div>
                {/* Mockup Demo Picture */}
                <div className="h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 text-center text-slate-500">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                      <Play size={14} className="ml-0.5" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-500">Custom Loom/Video Specs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 relative overflow-hidden shadow-xs hover:shadow-md transition">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] text-emerald-700 font-black">3</span>
                  <span>Video Delivered</span>
                </div>
                {/* Mockup Demo Picture */}
                <div className="h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 text-center text-slate-500">
                  <div className="space-y-1">
                    <CheckCircle size={22} className="mx-auto text-emerald-600" />
                    <p className="text-[11px] font-medium text-slate-500">By End of Day Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between font-medium shadow-xs">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {/* SUBMITTED SUCCESS STATE */}
        {submitted ? (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle size={44} />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900">Sent successfully!</h3>
              <p className="text-lg font-bold text-emerald-700">
                Thank you, {submittedName || 'there'}!
              </p>
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                We have received your uploaded screenshots and specs. You will receive your customized video walkthrough by the end of the day.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-600 border-b border-slate-200 pb-2 font-bold">
                <span>Uploaded Images Summary</span>
                <span className="text-emerald-700 font-extrabold">{images.length} File{images.length > 1 ? 's' : ''} Received</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-medium shadow-2xs">
                    <ImageIcon size={12} className="text-blue-600 shrink-0" />
                    <span className="truncate max-w-[140px]">{img.name || `Image #${idx+1}`}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setImages([]);
                setNotes('');
                setActiveStep(1);
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              Upload Additional Images
            </button>
          </div>
        ) : (
          /* THE 3-BUTTON INTAKE FORM CONTAINER */
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            
            {/* STEP / BUTTON 1: IMAGE SELECTION & DROPZONE */}
            <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
              activeStep === 1 
                ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20' 
                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    images.length > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {images.length > 0 ? <Check size={16} /> : '1'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      BUTTON 1: Select or Drop Screenshots
                    </h3>
                    <p className="text-xs text-slate-500">Drag & drop or click to upload PNG, JPG, WEBP, or GIF files</p>
                  </div>
                </div>
                {images.length > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {images.length} Image{images.length > 1 ? 's' : ''} Ready
                  </span>
                )}
              </div>

              {/* Dropzone Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                }}
                className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer group"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition shadow-xs">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Click to choose images or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-500">Supports paste from clipboard (Ctrl+V / Cmd+V)</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-2xs">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 hover:bg-red-600 text-white transition opacity-90 group-hover:opacity-100 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STEP / BUTTON 2: YOUR NAME & DETAILS */}
            <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
              activeStep === 2 
                ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20' 
                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  name.trim() ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {name.trim() ? <Check size={16} /> : '2'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">BUTTON 2: Enter Your Name</h3>
                  <p className="text-xs text-slate-500">So we know where to address your walkthrough video</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                    Your Name or Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins or Apex Solutions"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (activeStep === 2 && e.target.value.trim()) setActiveStep(3);
                    }}
                    onFocus={() => setActiveStep(2)}
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sarah@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setActiveStep(2)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Optional Notes / Specific Request
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please review checkout flow in image #2"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onFocus={() => setActiveStep(2)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP / BUTTON 3: SEND IMAGES & GET VIDEO */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || images.length === 0 || !name.trim()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Submitting Your Images...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="group-hover:translate-x-0.5 transition" />
                    <span>BUTTON 3: Send Images & Get Video By End of Day</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Private & Secure. You will receive your video walkthrough by the end of the day.</span>
              </p>
            </div>

          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 font-medium bg-white">
        Direct Client Visual Intake Portal &bull; Delivered Same-Day
      </footer>
    </div>
  );
}
