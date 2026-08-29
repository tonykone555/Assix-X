const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

// The new GIF UI is currently located at:
// {activeTab === 'gif' && ( ... newGifUI ... )}
// followed by {/* INTERACTIVE OUTREACH CHANNEL PLAYBOOK */}

// Let's just find the exact block and replace it correctly.
const regex = /\{activeTab === 'gif' && \([\s\S]*?(?=\{activeTab === '3d-studio' && \()/;
const match = content.match(regex);
if (match) {
  // we want to keep the newGifUI part but remove the INTERACTIVE OUTREACH CHANNEL PLAYBOOK up to 3d-studio.
}
