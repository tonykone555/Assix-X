const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const oldHeader = `<div className="h-14 px-4 bg-[#111111] border-b border-[#1C1C1E] flex items-center justify-between shrink-0 select-none overflow-x-auto">
          <div className="flex items-center gap-6">
            <Globe size={18} className="text-zinc-500 shrink-0 ml-1" />
            
            <div className="flex items-center gap-1">`;

const newHeader = `<div className="h-14 px-2 sm:px-4 bg-[#111111] border-b border-[#1C1C1E] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none flex-1 pr-4" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            <Globe size={18} className="text-zinc-500 shrink-0 ml-1 hidden sm:block" />
            
            <div className="flex items-center gap-1 shrink-0">`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
