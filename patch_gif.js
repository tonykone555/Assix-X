const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const newGifState = `
  const [customGifUrlInput, setCustomGifUrlInput] = useState('');
  const handleGenerateCustomGif = async () => {
    if (!customGifUrlInput) return;
    setGeneratingGif(true);
    setGifError(null);
    try {
      const urlboxGif = \`/api/urlbox/gif?url=\${encodeURIComponent(customGifUrlInput)}&refresh=true&scroll=\${gifScrollMode === 'scroll'}\`;
      setGifUrl(\`\${urlboxGif}&t=\${Date.now()}\`);
    } catch (err: any) {
      setGifError(err.message || 'Error generating GIF');
    } finally {
      setGeneratingGif(false);
    }
  };
`;

if (!content.includes('customGifUrlInput')) {
  content = content.replace('const [gifUrl, setGifUrl]', newGifState + '\\n  const [gifUrl, setGifUrl]');
}

const gifUIRegex = /<div className="bg-\[#0A0A0C\] border-2 border-dashed border-zinc-700 hover:border-amber-500\/50 rounded-2xl p-8 text-center transition flex flex-col items-center justify-center space-y-2 relative group mt-4">[\s\S]*?<\/label>\s*<\/div>/;

const newGifUI = `
                  <div className="space-y-6">
                    {/* CUSTOM URL TO GIF */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 relative">
                      <h4 className="text-sm font-bold text-zinc-200 mb-2">Auto-Generate GIF from Live URL</h4>
                      <p className="text-[11px] text-zinc-500 mb-4">Paste any website URL to automatically capture a scrolling animated GIF.</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://..." 
                          value={customGifUrlInput}
                          onChange={(e) => setCustomGifUrlInput(e.target.value)}
                          className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white"
                        />
                        <button 
                          onClick={handleGenerateCustomGif}
                          disabled={!customGifUrlInput || generatingGif}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-lg cursor-pointer transition flex items-center gap-2"
                        >
                          {generatingGif ? 'Capturing...' : 'Generate GIF'}
                        </button>
                      </div>
                      
                      {gifError && <p className="text-red-400 text-xs mt-3">{gifError}</p>}
                      
                      {gifUrl && (
                        <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden bg-black p-2">
                          <img src={gifUrl} alt="Generated GIF" className="w-full max-w-lg mx-auto rounded-lg" />
                          <div className="text-center mt-3">
                            <button 
                              onClick={handleCopyGifUrl}
                              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition"
                            >
                              {copiedGifUrl ? 'Copied!' : 'Copy GIF URL'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-zinc-800 flex-1"></div>
                      <span className="text-xs text-zinc-500 font-bold uppercase">OR</span>
                      <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    {/* UPLOAD VIDEOS DROPZONE */}
                    <div className="bg-[#0A0A0C] border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-2xl p-8 text-center transition flex flex-col items-center justify-center space-y-2 relative group mt-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">Upload Screen Recording</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">MP4, WEBM accepted. Loop your video perfectly for email.</p>
                      </div>
                      <label className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition mt-4">
                        Browse Videos
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
`;

content = content.replace(gifUIRegex, newGifUI);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
