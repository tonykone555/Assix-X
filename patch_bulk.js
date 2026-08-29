const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '<Upload size={10} /> Upload CSV';

const replacementStr = `
                        <button
                          onClick={async () => {
                            const ungenerated = leads.filter(l => !l.deployedWebsiteUrl);
                            if (ungenerated.length === 0) {
                              showNotification("All leads already have generated websites!");
                              return;
                            }
                            showNotification(\`🚀 Launching auto-generation for \${ungenerated.length} leads...\`);
                            let successCount = 0;
                            for (const l of ungenerated) {
                              try {
                                showNotification(\`Generating site for \${l.name || l.companyName}...\`);
                                const res = await fetch('/api/leads/generate-site-preview', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ lead: l, language: 'auto', templateStyle: 'premium-dark' })
                                });
                                const data = await res.json();
                                if (data.url) {
                                  successCount++;
                                  setLeads(prev => prev.map(lead => lead.leadId === l.leadId ? { ...lead, deployedWebsiteUrl: data.url } : lead));
                                }
                              } catch(e) {
                                console.error(e);
                              }
                            }
                            showNotification(\`✅ Completed! Generated \${successCount} websites.\`);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[9px] tracking-widest uppercase rounded shadow-sm transition cursor-pointer select-none"
                          title="Auto-generate websites for all leads missing one based on their niche"
                        >
                          <Globe size={11} /> Auto-Generate Websites
                        </button>
                        <label className="flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-[9px] font-extrabold tracking-widest uppercase rounded shadow-sm transition cursor-pointer select-none">
                          <Upload size={10} /> Upload CSV`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', content);
