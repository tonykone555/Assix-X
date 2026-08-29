const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const regex = /\{activeTab === 'gif' && \([\s\S]*?(?=\{activeTab === '3d-studio' && \()/;

const newGifUI = `
              {activeTab === 'gif' && (
                <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto space-y-8">
                  <div className="text-left space-y-2 mb-6">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                      Outreach Multiplier
                    </span>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                      <Video size={20} className="text-blue-400" />
                      Video to Outreach GIF Generator
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium">
                      Select or upload a screen recording of the customized website. Use these looping videos or GIFs in your cold emails and DMs.
                    </p>
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

                  {/* USER UPLOADED VIDEOS LIST */}
                  {uploadedVideos.length > 0 && (
                    <div className="space-y-4 text-left pt-4">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Video size={16} className="text-blue-400" />
                        Available Outreach Videos ({uploadedVideos.length})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {uploadedVideos.map((videoUrl, idx) => (
                          <div key={idx} className="relative rounded-2xl border border-zinc-800 bg-[#060609] overflow-hidden group shadow-lg flex flex-col">
                            <div className="relative aspect-video bg-black">
                              <video
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            </div>
                            <div className="p-4 bg-[#121217] border-t border-zinc-800 flex items-center justify-between">
                              <div className="flex gap-2">
                                <a
                                  href={videoUrl}
                                  download={\`outreach-video-\${idx + 1}.mp4\`}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer transition flex items-center gap-1.5"
                                >
                                  <Download size={12} /> Download
                                </a>
                                <button
                                  onClick={() => handleDeleteUploadedVideo(idx)}
                                  className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-800/40 transition shrink-0"
                                  title="Delete Video"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
`;

content = content.replace(regex, newGifUI);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
