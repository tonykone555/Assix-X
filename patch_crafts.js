const fs = require('fs');
let content = fs.readFileSync('services/siteTemplate.ts', 'utf8');

const newSection = `
      case 'crafts':
        if (!content.services || content.services.length === 0) return '';
        return \`
        <!-- CRAFTS ACCORDION SECTION (INTERACTIVE) -->
        <section class="py-24 bg-[#F5F5F0]">
          <div class="max-w-7xl mx-auto px-6">
            <div class="mb-12">
              <h4 class="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">What We Make</h4>
              <h2 class="text-4xl md:text-5xl font-serif text-slate-800">Four crafts, <span class="italic text-amber-600">one roof.</span></h2>
            </div>

            <!-- Accordion Container -->
            <div class="flex flex-col lg:flex-row w-full h-[800px] lg:h-[600px] gap-2 lg:gap-4">
              \${content.services.slice(0, 4).map((srv, idx) => \`
                <!-- Panel -->
                <div class="relative group flex-1 hover:flex-[4] lg:hover:flex-[5] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden rounded-xl cursor-pointer">
                  
                  <!-- Background Image -->
                  <img src="\${sectorImgs[\`portfolio\${idx + 1}\`] || sectorImgs.about1}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" referrerpolicy="no-referrer" />
                  
                  <!-- Darken Overlay -->
                  <div class="absolute inset-0 bg-black/50 lg:bg-black/30 group-hover:bg-black/10 transition-all duration-700"></div>

                  <!-- Desktop Unexpanded Text (Rotated) -->
                  <div class="hidden lg:flex absolute inset-0 items-center justify-center p-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <h3 class="text-white font-serif tracking-widest uppercase -rotate-90 whitespace-nowrap text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      \${srv.title}
                    </h3>
                  </div>

                  <!-- Mobile Unexpanded Text -->
                  <div class="flex lg:hidden absolute inset-0 items-end justify-start p-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <h3 class="text-white font-serif tracking-widest uppercase text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      \${srv.title}
                    </h3>
                  </div>

                  <!-- Expanded Content -->
                  <div class="absolute inset-x-0 bottom-0 p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent h-[80%] pointer-events-none">
                    <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                      <h3 class="text-3xl md:text-5xl font-serif text-white mb-3 flex items-center gap-3">
                        <span class="text-amber-400/80 italic font-light text-2xl md:text-4xl">0\${idx + 1}.</span> 
                        <span class="leading-none">\${srv.title}</span>
                      </h3>
                      <p class="text-white/90 text-sm md:text-base max-w-lg leading-relaxed font-light">
                        \${srv.desc}
                      </p>
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        </section>
        \`;
`;

// Insert the new case right before case 'about':
content = content.replace("case 'about':", newSection + "\n      case 'about':");

// Add 'crafts' to the default layout array right after hero
content = content.replace("['hero', 'beforeafter', 'about'", "['hero', 'crafts', 'beforeafter', 'about'");

fs.writeFileSync('services/siteTemplate.ts', content);
