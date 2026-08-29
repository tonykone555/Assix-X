const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const targetHtml = `                <div className="w-px h-4 bg-zinc-800 mx-1"></div>`;

const replacementHtml = `                <div className="w-px h-4 bg-zinc-800 mx-1"></div>

                {/* Smart Qualify Toggle */}
                <label className="flex items-center gap-1.5 bg-[#121212] px-2.5 py-1.5 rounded-lg border border-[#1F1F1F] text-[10px] font-bold tracking-widest uppercase text-zinc-300 cursor-pointer shrink-0 hover:bg-[#1A1A1A] transition">
                  <input 
                    type="checkbox" 
                    className="accent-amber-500 w-3 h-3"
                    checked={!!siteData?.content?.enableSmartQualify}
                    onChange={async (e) => {
                      const enabled = e.target.checked;
                      if (!siteData) return;
                      setModifying(true);
                      try {
                        const parsed = { ...siteData.content, enableSmartQualify: enabled };
                        const res = await fetch('/api/leads/modify-content', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: parsed, lead })
                        });
                        const data = await res.json();
                        if (data.url) {
                          setSiteData({ ...siteData, previewUrl: data.url, content: data.content });
                        }
                      } catch (err) {}
                      setModifying(false);
                    }}
                  />
                  Smart Qualify Flow
                </label>`;

content = content.replace(targetHtml, replacementHtml);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
