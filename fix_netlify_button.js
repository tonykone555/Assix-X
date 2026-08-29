const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const originalBtn = `<button
                              onClick={() => handleDownloadTemplateZip(tmpl.id, tmpl.name)}
                              disabled={downloadingTemplateId === tmpl.id}
                              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                            >
                              <Download size={13} />
                              {downloadingTemplateId === tmpl.id ? 'Packaging...' : 'Download ZIP'}
                            </button>`;

const newBtn = `<button
                              onClick={() => handleDownloadTemplateZip(tmpl.id, tmpl.name)}
                              disabled={downloadingTemplateId === tmpl.id}
                              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                            >
                              <Download size={13} />
                              {downloadingTemplateId === tmpl.id ? 'Packaging...' : 'Download ZIP'}
                            </button>
                            <a
                              href="https://app.netlify.com/drop"
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md text-center"
                            >
                              <Zap size={13} />
                              Deploy ZIP to Netlify
                            </a>`;

content = content.replace(originalBtn, newBtn);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
