const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const trustTabUI = `
              {activeTab === 'trust' && (
                <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto space-y-8 text-left">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">
                      <ShieldCheck size={24} className="text-yellow-400" /> 
                      Trust & Authority Multipliers
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-2xl">
                      Configure high-trust local proof elements. We inject 5-star reviews, Google Maps proximity indicators, and bespoke trust badges straight into the generated design to double your conversion rate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CUSTOM TRUST BADGES */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Award size={16} className="text-yellow-400" />
                        Dynamic Trust Badge Studio
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Generate custom laurels and badges tailored specifically to this lead's city and niche.
                      </p>
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Target City</label>
                          <input 
                            type="text" 
                            value={badgeCity} 
                            onChange={(e) => setBadgeCity(e.target.value)} 
                            className="w-full bg-[#141418] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., Paris"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Niche / Award Name</label>
                          <input 
                            type="text" 
                            value={badgeNiche} 
                            onChange={(e) => setBadgeNiche(e.target.value)} 
                            className="w-full bg-[#141418] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., Best Dental Clinic"
                          />
                        </div>
                        <button
                          onClick={generateNicheReviews}
                          disabled={generatingReviews}
                          className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold rounded-lg text-xs transition border border-yellow-500/30"
                        >
                          {generatingReviews ? 'Generating Badges...' : 'Generate New Badges'}
                        </button>
                      </div>
                    </div>

                    {/* REVIEWS */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Star size={16} className="text-blue-400 fill-current" />
                        Simulated Local Reviews
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        These simulated reviews will be placed in the generated templates to show social proof.
                      </p>
                      <div className="space-y-2 pt-2">
                        {nicheReviews.length > 0 ? (
                          nicheReviews.map((rev, idx) => (
                            <div key={idx} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left">
                              <div className="flex text-yellow-400 mb-1">
                                <Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" />
                              </div>
                              <p className="text-[10px] text-zinc-300 italic mb-1">"{rev.text}"</p>
                              <p className="text-[9px] text-zinc-500 font-bold">— {rev.author}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] text-zinc-500">No reviews generated yet.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
`;

const insertStr = "{activeTab === 'template-maker' && (";
content = content.replace(insertStr, trustTabUI + "\n              " + insertStr);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
