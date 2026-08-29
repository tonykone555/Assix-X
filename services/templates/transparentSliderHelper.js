export function renderTransparentSliderSection(sliderConfig) {
  if (!sliderConfig || typeof sliderConfig !== 'object') return '';
  
  const items = sliderConfig.items || sliderConfig.sliderItems || [];
  if (!Array.isArray(items) || items.length === 0) return '';

  const speed = parseFloat(sliderConfig.speed) || 20;
  const direction = sliderConfig.direction === 'right' ? 'reverse' : 'normal';
  const itemScale = parseInt(sliderConfig.itemScale) || 180;
  const itemGap = parseInt(sliderConfig.itemGap) || 40;
  const enableRotate = sliderConfig.enableRotate !== false;
  const enableShadow = sliderConfig.enableShadow !== false;
  const enable3dTilt = sliderConfig.enable3dTilt !== false;
  const themeBg = sliderConfig.themeBg || 'dark';

  const bgStyle =
    themeBg === 'light' ? 'background:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;color:#0f172a;' :
    themeBg === 'gold' ? 'background:linear-gradient(90deg,#1c1204 0%,#08080a 50%,#1c1204 100%);border-top:1px solid rgba(201,169,106,.3);border-bottom:1px solid rgba(201,169,106,.3);color:#fff;' :
    themeBg === 'cyber' ? 'background:#030812;border-top:1px solid rgba(6,182,212,.3);border-bottom:1px solid rgba(6,182,212,.3);color:#fff;' :
    'background:#070d18;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);color:#fff;';

  // Duplicate array 3 times for seamless infinite continuous scroll
  const displayItems = [...items, ...items, ...items];

  const itemsHtml = displayItems.map((item) => {
    const url = typeof item === 'string' ? item : (item.url || item.src || item.img);
    const title = typeof item === 'object' ? (item.title || item.name || '') : '';
    const subtitle = typeof item === 'object' ? (item.subtitle || item.desc || '') : '';

    if (!url) return '';

    return `
      <div class="marquee-card-item" style="flex-shrink:0;width:${itemScale}px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:12px;transition:transform 0.3s ease;">
        <div style="position:relative;width:100%;height:${itemScale}px;display:flex;align-items:center;justify-content:center;">
          <img src="${url}" alt="${title || 'Cutout'}" style="max-width:100%;max-height:100%;object-fit:contain;${enableShadow ? 'filter:drop-shadow(0 18px 24px rgba(0,0,0,0.65));' : ''}${enableRotate ? 'animation:spinPlate 35s linear infinite;' : ''}${enable3dTilt ? 'transform:perspective(600px) rotateY(-8deg) rotateX(8deg);' : ''}" loading="lazy" />
        </div>
        ${title ? `<div style="font-size:12px;font-weight:800;margin-top:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:${itemScale}px;">${title}</div>` : ''}
        ${subtitle ? `<div style="font-size:10px;opacity:0.75;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:${itemScale}px;">${subtitle}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
  <!-- INFINITE TRANSPARENT OBJECT ROLLING SLIDER -->
  <section class="transparent-slider-section" id="transparentSliderSection" style="position:relative;overflow:hidden;padding:30px 0;z-index:20;${bgStyle}">
    <style>
      @keyframes marqueeInfinite {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-33.33333%); }
      }
      @keyframes spinPlate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .marquee-track-container {
        display: flex;
        overflow: hidden;
        width: 100%;
        position: relative;
        mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
      }
      .marquee-animated-track {
        display: flex;
        align-items: center;
        gap: ${itemGap}px;
        width: max-content;
        animation: marqueeInfinite ${speed}s linear infinite ${direction};
      }
      .marquee-animated-track:hover {
        animation-play-state: paused;
      }
    </style>
    <div class="marquee-track-container">
      <div class="marquee-animated-track" id="marqueeAnimatedTrack">
        ${itemsHtml}
      </div>
    </div>
  </section>
  `;
}
