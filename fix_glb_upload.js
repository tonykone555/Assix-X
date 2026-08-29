const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const targetStr = `                    {/* USER UPLOADED VIDEOS LIST */}`;

const newGLBSection = `
                    {/* UPLOAD MODELS DROPZONE */}
                    <div className="bg-[#050508] border-2 border-dashed border-zinc-800 hover:border-amber-500 rounded-xl p-5 text-center transition flex flex-col items-center justify-center space-y-1.5 relative group mt-4">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/5 text-amber-400 flex items-center justify-center">
                        <Box size={16} />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white">Upload Custom 3D Models (.glb)</h5>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Place interactive 3D elements natively into the website.</p>
                      </div>
                      <label className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-[10px] rounded-lg border border-zinc-700 transition cursor-pointer mt-2">
                        Browse .glb Files
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
                              <div className="relative aspect-video rounded-t-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                                <Box size={32} className="text-zinc-700" />
                                <span className="absolute bottom-2 right-2 text-[8px] text-zinc-500 font-mono bg-black/50 px-1 rounded">.GLB</span>
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
                    
`;

content = content.replace(targetStr, newGLBSection + targetStr);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
