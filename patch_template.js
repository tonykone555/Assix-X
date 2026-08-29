const fs = require('fs');
let content = fs.readFileSync('services/siteTemplate.ts', 'utf8');

const heroRegex = /case 'hero':[\s\S]*?(?=case 'beforeafter':)/;

const newHero = `case 'hero':
        return \`
        <!-- HERO SECTION (IMAGE-MATCHING LAYOUT) -->
        <section class="relative min-h-[95vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-white pt-24 pb-8 px-4 sm:px-6">
          \${content.heroVideo ? \`
          <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover z-0 opacity-70">
            <source src="\${content.heroVideo}" type="video/mp4">
          </video>
          \` : \`
          <div class="absolute inset-0 z-0 bg-cover bg-center opacity-70" style="background-image: url('\${heroBgImage}');"></div>
          \`}
          <!-- Overlay to ensure readability -->
          <div class="absolute inset-0 z-0 bg-black/40"></div>
          
          <div class="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto mt-4 sm:mt-10">
            
            <!-- Top Dark Card for Titles -->
            <div class="w-full bg-[#1A1A1A]/95 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl border border-white/5">
              <h1 class="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase">
                \${content.heroTitle || companyName}
              </h1>
              \${content.heroSubtitle ? \`
              <div class="mt-8 pt-8 border-t border-white/10">
                <h2 class="text-xl sm:text-2xl text-white/90 tracking-widest font-light uppercase">
                  \${content.heroSubtitle}
                </h2>
              </div>
              \` : ''}
            </div>

            <!-- Action Button placed OUTSIDE the card, directly on the background -->
            <button onclick="openReservationModal()" class="mt-12 bg-white text-black hover:bg-zinc-200 rounded-[2rem] px-10 py-5 font-bold text-lg sm:text-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 inline-flex items-center justify-center">
              \${content.ctaButton || 'Découvrir nos services'}
            </button>

          </div>

          <!-- Bottom Stats Card -->
          <div class="relative z-10 w-full max-w-lg mx-auto mt-auto pt-16">
            <div class="w-full bg-[#1A1A1A]/95 backdrop-blur-xl rounded-[2.5rem] p-6 text-center shadow-2xl border border-white/5 flex flex-col items-center justify-center">
                <div class="text-5xl sm:text-6xl font-black text-white">\${stats[0]?.value || '+1000'}</div>
                <div class="text-xs sm:text-sm text-white/50 font-medium tracking-wide mt-2">\${stats[0]?.label || 'Clients accueillis'}</div>
            </div>
          </div>
        </section>
        \`;
      `;

content = content.replace(heroRegex, newHero);

const scriptInjectStr = `</script>\n</body>\n</html>`;

const modalScript = `

  <!-- DYNAMIC RESERVATION MODAL SCRIPT -->
  <script>
    // Configuration based on niche
    const nicheQuestions = {
      default: {
        step1: { q: "What do you need done?", opts: ["Service", "Consultation", "Emergency"] },
        step2: { q: "How big, roughly?", opts: ["Small", "Medium", "Large"] }
      },
      landscaping: {
        step1: { q: "What do you need done?", opts: ["Driveway", "Patio", "Garden", "Lawn Care"] },
        step2: { q: "How big, roughly?", opts: ["Small", "Medium", "Large", "Full Property"] }
      },
      plumbing: {
        step1: { q: "What is the issue?", opts: ["Leak", "Clog", "Install", "Emergency"] },
        step2: { q: "Where is it located?", opts: ["Kitchen", "Bathroom", "Basement", "Outside"] }
      },
      electrical: {
        step1: { q: "What service do you need?", opts: ["Repair", "Installation", "Inspection", "Panel Upgrade"] },
        step2: { q: "Property Type?", opts: ["Residential", "Commercial", "Industrial"] }
      },
      cleaning: {
        step1: { q: "Type of cleaning?", opts: ["Standard", "Deep Clean", "Move In/Out"] },
        step2: { q: "Number of Bedrooms?", opts: ["1-2", "3-4", "5+"] }
      },
      roofing: {
        step1: { q: "What do you need?", opts: ["Repair", "Replacement", "Inspection"] },
        step2: { q: "Type of roof?", opts: ["Asphalt", "Metal", "Flat", "Tile"] }
      }
    };

    // Determine questions based on the sector keywords
    const sectorKeyword = "\${sector}".toLowerCase();
    let currentQuestions = nicheQuestions.default;
    for (const key in nicheQuestions) {
      if (sectorKeyword.includes(key)) {
        currentQuestions = nicheQuestions[key];
        break;
      }
    }

    let currentStep = 1;
    let answers = {};

    window.openReservationModal = function() {
      currentStep = 1;
      answers = {};
      renderModalStep();
    };

    function closeReservationModal() {
      const modal = document.getElementById('reservation-modal');
      if (modal) modal.remove();
    }

    function renderModalStep() {
      let modal = document.getElementById('reservation-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reservation-modal';
        modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
        document.body.appendChild(modal);
      }

      let innerHTML = '';
      if (currentStep === 1) {
        innerHTML = getStepHTML(1, 3, currentQuestions.step1.q, currentQuestions.step1.opts, 'step1');
      } else if (currentStep === 2) {
        innerHTML = getStepHTML(2, 3, currentQuestions.step2.q, currentQuestions.step2.opts, 'step2');
      } else if (currentStep === 3) {
        // Final contact info step
        innerHTML = \`
          <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-slide-up text-center">
            <button onclick="closeReservationModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Final Step</div>
            <h2 class="text-2xl font-black text-black mb-6">Where should we send your quote?</h2>
            <form onsubmit="submitReservation(event)" class="space-y-4">
              <input type="text" id="res-name" placeholder="Your Name" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black">
              <input type="tel" id="res-phone" placeholder="Phone Number" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black">
              <button type="submit" class="w-full py-4 mt-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition">Get My Quote</button>
            </form>
          </div>
        \`;
      } else if (currentStep === 4) {
        innerHTML = \`
          <div class="bg-white rounded-3xl w-full max-w-md p-10 shadow-2xl relative animate-slide-up text-center">
            <button onclick="closeReservationModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 class="text-3xl font-black text-black mb-2">Request Sent!</h2>
            <p class="text-gray-500 font-medium">We will contact you shortly with your estimate.</p>
            <button onclick="closeReservationModal()" class="mt-8 px-8 py-3 bg-gray-100 text-black font-bold rounded-xl hover:bg-gray-200 transition">Done</button>
          </div>
        \`;
      }
      modal.innerHTML = innerHTML;
    }

    function getStepHTML(step, totalSteps, question, options, answerKey) {
      const dots = Array.from({length: totalSteps}).map((_, i) => 
        \`<div class="w-2 h-2 rounded-full \${i + 1 === step ? 'bg-green-500' : (i + 1 < step ? 'bg-green-200' : 'bg-gray-200')}"></div>\`
      ).join('');

      const buttons = options.map(opt => 
        \`<button onclick="selectOption('\${answerKey}', '\${opt}')" class="w-full py-4 px-6 text-center text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl hover:border-black hover:shadow-md transition shadow-sm">\${opt}</button>\`
      ).join('');

      return \`
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-slide-up">
          <button onclick="closeReservationModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div class="text-center mb-6">
            <div class="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4">ONE QUESTION AT A TIME</div>
            <div class="text-xs font-bold text-gray-400 mb-3">STEP \${step} OF \${totalSteps}</div>
            <div class="flex items-center justify-center gap-2 mb-8">\${dots}</div>
            <h2 class="text-3xl font-black text-black leading-tight">\${question}</h2>
          </div>
          <div class="space-y-3 flex flex-col items-center">
            \${buttons}
          </div>
        </div>
      \`;
    }

    window.selectOption = function(key, value) {
      answers[key] = value;
      currentStep++;
      renderModalStep();
    };

    window.submitReservation = function(e) {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const phone = document.getElementById('res-phone').value;
      answers['name'] = name;
      answers['phone'] = phone;
      console.log('Lead submitted:', answers);
      
      // Submit to Netlify forms if needed
      try {
        const formData = new FormData();
        formData.append('form-name', 'quote-request');
        Object.keys(answers).forEach(k => formData.append(k, answers[k]));
        fetch('/', { method: 'POST', body: formData }).catch(e => console.log(e));
      } catch (err) {}

      currentStep++;
      renderModalStep();
    };
  </script>
</script>\n</body>\n</html>`;

content = content.replace(scriptInjectStr, modalScript);

// Adding keyframes for animations used in modal
const styleRegex = /<\/style>/;
const animationCSS = `
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .animate-fade-in { animation: fade-in 0.25s ease-out forwards; }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  </style>`;

content = content.replace(styleRegex, animationCSS);

fs.writeFileSync('services/siteTemplate.ts', content);
