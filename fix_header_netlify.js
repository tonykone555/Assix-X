const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const originalBtn = `<button
              onClick={handleDownloadZip}
              disabled={downloadingZip || !siteData}
              className="text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition disabled:opacity-50 flex items-center gap-1 tracking-wider uppercase"
            >
              <Download size={13} /> ZIP
            </button>`;

const newBtn = `<button
              onClick={handleDownloadZip}
              disabled={downloadingZip || !siteData}
              className="text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition disabled:opacity-50 flex items-center gap-1 tracking-wider uppercase"
            >
              <Download size={13} /> ZIP
            </button>
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-cyan-500 hover:text-cyan-300 transition flex items-center gap-1 tracking-wider uppercase"
              title="Deploy ZIP to Netlify"
            >
              <Zap size={13} /> NETLIFY
            </a>`;

content = content.replace(originalBtn, newBtn);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
