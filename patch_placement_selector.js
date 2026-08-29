const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

// Update renderPlacementSelector signature
content = content.replace(
  /const renderPlacementSelector = \(photoUrl: string\) => \{/,
  'const renderPlacementSelector = (photoUrl: string, is3D = false) => {'
);

// Add 3D options in renderPlacementSelector
const selectorStart = `          <div className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider px-2 py-1 bg-amber-500/10 rounded-md mb-1 flex items-center justify-between">
            <span>Assign Picture to Section</span>
            <Sparkles size={10} className="text-amber-400" />
          </div>`;

const newSelectorStart = `          <div className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider px-2 py-1 bg-amber-500/10 rounded-md mb-1 flex items-center justify-between">
            <span>Assign to Section</span>
            <Sparkles size={10} className="text-amber-400" />
          </div>

          {is3D ? (
            <>
              <button
                onClick={() => {
                  handleAssignImage(photoUrl, { type: 'hero3d' });
                  setOpenSelectorUrl(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
              >
                <Sparkles size={12} className="text-amber-400 shrink-0" /> Hero 3D Model
              </button>
              <button
                onClick={() => {
                  handleAssignImage(photoUrl, { type: 'catalog3d' });
                  setOpenSelectorUrl(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
              >
                <Globe size={12} className="text-blue-400 shrink-0" /> Catalog 3D Model
              </button>
            </>
          ) : (
            <>`;

const closeTags = `
          {portfolioList.length > 0 && (
            <>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider px-2 pt-1.5 pb-0.5 border-t border-zinc-800">Portfolio Items</div>
              {portfolioList.map((p: any, idx: number) => (
                <button
                  key={\`port-\${idx}\`}
                  onClick={() => {
                    handleAssignImage(photoUrl, { type: 'portfolio', index: idx });
                    setOpenSelectorUrl(null);
                  }}
                  className="w-full text-left px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg truncate flex items-center gap-1.5 transition cursor-pointer"
                  title={p.title}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                  <span className="truncate">{p.title || \`Portfolio #\${idx + 1}\`}</span>
                </button>
              ))}
            </>
          )}
          </>
        )}
        </div>`;

content = content.replace(selectorStart, newSelectorStart);
content = content.replace(/\{portfolioList\.length > 0 && \([\s\S]*?\}\)[\s]*<\/div>/, closeTags);

// Update handleAssignImage for 3D
const handleAssignImageStart = `const handleAssignImage = async (
    imgUrl: string,
    target: { 
      type: 'hero' | 'about' | 'gallery' | 'service' | 'portfolio' | 'heroVideo' | 'section2Video' | 'showcaseCutout' | 'program1' | 'program2' | 'program3' | 'program4' | 'card1' | 'card2' | 'card3'; 
      index?: number 
    }
  ) => {`;

const newHandleAssignImageStart = `const handleAssignImage = async (
    imgUrl: string,
    target: { 
      type: 'hero' | 'about' | 'gallery' | 'service' | 'portfolio' | 'heroVideo' | 'section2Video' | 'showcaseCutout' | 'program1' | 'program2' | 'program3' | 'program4' | 'card1' | 'card2' | 'card3' | 'hero3d' | 'catalog3d'; 
      index?: number 
    }
  ) => {`;

content = content.replace(handleAssignImageStart, newHandleAssignImageStart);

const targetTypeHero = `if (target.type === 'hero') {
        currentContent.heroImage = imgUrl;
      }`;
const newTargetTypeHero = `if (target.type === 'hero') {
        currentContent.heroImage = imgUrl;
      } else if (target.type === 'hero3d') {
        currentContent.model3dUrl = imgUrl;
        currentContent.show3dHero = true;
      } else if (target.type === 'catalog3d') {
        currentContent.model3dUrl = imgUrl;
        currentContent.show3dCatalog = true;
      }`;

content = content.replace(targetTypeHero, newTargetTypeHero);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
