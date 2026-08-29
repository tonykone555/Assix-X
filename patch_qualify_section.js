const fs = require('fs');
let content = fs.readFileSync('services/siteTemplate.ts', 'utf8');

// 1. Add 'qualify' to layout if enabled
const defaultLayoutTarget = "const defaultLayout = ['hero', 'crafts', 'beforeafter', 'about', 'services', 'portfolio', 'whyus', 'steps', 'reviews', 'faq', 'devis', 'map'];";
const defaultLayoutReplacement = `
  const defaultLayout = ['hero', 'crafts', 'beforeafter', 'about', 'services', 'portfolio', 'whyus', 'steps', 'reviews', 'faq', 'devis', 'map'];
  if (content.enableSmartQualify) {
    // Replace 'devis' with 'qualify'
    const devisIndex = defaultLayout.indexOf('devis');
    if (devisIndex !== -1) {
      defaultLayout[devisIndex] = 'qualify';
    } else {
      defaultLayout.push('qualify');
    }
  }
`;
content = content.replace(defaultLayoutTarget, defaultLayoutReplacement);

// 2. Add 'case 'qualify':' to the renderSection switch
const qualifyCase = `
      case 'qualify':
        return \`
        <!-- IN-PAGE SMART QUALIFICATION SECTION -->
        <section class="py-24 bg-zinc-50 border-t border-zinc-200" id="qualify-funnel">
          <div class="max-w-4xl mx-auto px-6 text-center">
            <div class="mb-12">
              <span class="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 block mb-3">Instant Booking</span>
              <h2 class="text-3xl md:text-5xl font-black text-zinc-900 mb-4">Ready to start?</h2>
              <p class="text-zinc-500 max-w-xl mx-auto">Get an instant estimate and book your service without filling out any long forms.</p>
            </div>
            
            <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 p-8 md:p-14 max-w-2xl mx-auto">
               <div id="inline-qualify-root">
                 <!-- Injected by script below -->
               </div>
            </div>
          </div>
        </section>
        \`;
      case 'devis':
`;
content = content.replace("case 'devis':", qualifyCase);

// 3. Update the injected script to support BOTH modal and inline rendering
const scriptTarget = "window.openReservationModal = function() {";
const scriptReplacement = `
    let inlineStep = 1;
    let inlineAnswers = {};

    function renderInlineQualify() {
      const root = document.getElementById('inline-qualify-root');
      if (!root) return;

      let html = '';
      if (inlineStep === 1) {
        html = getStepHTML(1, 3, currentQuestions.step1.q, currentQuestions.step1.opts, 'step1', true);
      } else if (inlineStep === 2) {
        html = getStepHTML(2, 3, currentQuestions.step2.q, currentQuestions.step2.opts, 'step2', true);
      } else if (inlineStep === 3) {
        const leadPhone = "\${phone}".replace(/[^0-9]/g, '');
        const message = encodeURIComponent(\\\`Hello, I would like to book a service:\\n\\n- \${currentQuestions.step1.q}: \${inlineAnswers.step1}\\n- \${currentQuestions.step2.q}: \${inlineAnswers.step2}\\n\\nPlease let me know your availability.\\\`);
        const waLink = \\\`https://wa.me/\${leadPhone}?text=\${message}\\\`;

        html = \\\`
          <div class="text-center animate-fade-in">
            <div class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Step 3 of 3</div>
            <h2 class="text-3xl font-black text-black mb-4">Perfect.</h2>
            <p class="text-gray-500 font-medium mb-8">We have matched your request with our availability. Book instantly via WhatsApp without filling out forms.</p>
            <div class="space-y-3 max-w-sm mx-auto">
              <a href="\\\${waLink}" target="_blank" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20bd5a] transition shadow-lg hover:-translate-y-0.5">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Book instantly via WhatsApp
              </a>
            </div>
          </div>
        \\\`;
      }
      root.innerHTML = html;
    }

    window.selectInlineOption = function(key, value) {
      inlineAnswers[key] = value;
      inlineStep++;
      renderInlineQualify();
    };

    // Initialize inline if present
    document.addEventListener("DOMContentLoaded", function() {
      renderInlineQualify();
    });

    window.openReservationModal = function() {`;

content = content.replace("window.openReservationModal = function() {", scriptReplacement);

// We need to modify getStepHTML so it supports both modal (close button) and inline (no close button)
const oldGetStepHTML = "function getStepHTML(step, totalSteps, question, options, answerKey) {";
const newGetStepHTML = `function getStepHTML(step, totalSteps, question, options, answerKey, isInline = false) {
      const dots = Array.from({length: totalSteps}).map((_, i) => 
        \\\`<div class="w-2 h-2 rounded-full \\\${i + 1 === step ? 'bg-green-500' : (i + 1 < step ? 'bg-green-200' : 'bg-gray-200')}"></div>\\\`
      ).join('');

      const funcName = isInline ? 'selectInlineOption' : 'selectOption';

      const buttons = options.map(opt => 
        \\\`<button onclick="\\\${funcName}('\\\${answerKey}', '\\\${opt}')" class="w-full py-4 px-6 text-center text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl hover:border-black hover:shadow-md transition shadow-sm">\\\${opt}</button>\\\`
      ).join('');

      return \\\`
        <div class="\\\${isInline ? 'animate-fade-in text-center' : 'bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-slide-up'}">
          \\\${isInline ? '' : \\\`<button onclick="closeReservationModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>\\\`}
          <div class="text-center mb-6">
            <div class="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4">ONE QUESTION AT A TIME</div>
            <div class="text-xs font-bold text-gray-400 mb-3">STEP \\\${step} OF \\\${totalSteps}</div>
            <div class="flex items-center justify-center gap-2 mb-8">\\\${dots}</div>
            <h2 class="text-3xl font-black text-black leading-tight">\\\${question}</h2>
          </div>
          <div class="space-y-3 flex flex-col items-center \\\${isInline ? 'max-w-sm mx-auto' : ''}">
            \\\${buttons}
          </div>
        </div>
      \\\`;
    }`;

// Since we're replacing the whole getStepHTML function, let's find it.
const funcStart = content.indexOf("function getStepHTML(");
const funcEnd = content.indexOf("window.selectOption =", funcStart);
if (funcStart !== -1 && funcEnd !== -1) {
    content = content.substring(0, funcStart) + newGetStepHTML + "\n\n    " + content.substring(funcEnd);
}

fs.writeFileSync('services/siteTemplate.ts', content);
