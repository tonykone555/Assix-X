const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const videoUploadHTML = `
                  {/* UPLOAD VIDEOS DROPZONE */}
                  <div className="bg-[#060609] border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 text-center transition flex flex-col items-center justify-center space-y-2 relative group mt-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/5 text-amber-500/60 flex items-center justify-center">
                      <Video size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-300">Upload Custom Video</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5">MP4, WEBM accepted.</p>
                    </div>
                    <label className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-600 text-zinc-300 hover:text-white font-bold text-[10px] rounded shadow cursor-pointer transition">
                      Browse Videos
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>
                  </div>`;

const newHTML = `
                  {/* UPLOAD MODELS DROPZONE */}
                  <div className="bg-[#060609] border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 text-center transition flex flex-col items-center justify-center space-y-2 relative group mt-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/5 text-amber-500/60 flex items-center justify-center">
                      <Box size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-300">Upload Custom 3D Model</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5">.GLB files accepted.</p>
                    </div>
                    <label className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-600 text-zinc-300 hover:text-white font-bold text-[10px] rounded shadow cursor-pointer transition">
                      Browse .GLB Files
                      <input type="file" accept=".glb" onChange={handleModelUpload} className="hidden" />
                    </label>
                  </div>

                  {/* USER UPLOADED MODELS LIST */}
                  {uploadedModels.length > 0 && (
                    <div className="space-y-3.5 text-left pt-2">
                      <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Box size={14} className="text-amber-400" />
                        Your Uploaded 3D Models ({uploadedModels.length})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedModels.map((modelUrl, idx) => (
                          <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#060609] overflow-visible group hover:border-amber-500/40 transition shadow-lg flex flex-col z-10 hover:z-30">
                            <div className="relative aspect-square rounded-t-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                               <Box size={32} className="text-zinc-700" />
                               <span className="absolute bottom-2 right-2 text-[8px] text-zinc-500 font-mono bg-black/50 px-1 rounded">GLB</span>
                            </div>
                            <div className="p-2.5 bg-[#121217] rounded-b-xl border-t border-zinc-800/80 flex items-center justify-between gap-2 overflow-visible">
                              <button
                                onClick={() => handleDeleteUploadedModel(idx)}
                                className="p-1 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-md border border-red-800/40 transition shrink-0"
                                title="Delete Model"
                              >
                                <Trash2 size={12} />
                              </button>
                              {renderPlacementSelector(modelUrl, true)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
` + videoUploadHTML;

content = content.replace(videoUploadHTML, newHTML);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
