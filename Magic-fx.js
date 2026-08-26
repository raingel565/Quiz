/* ============================================================
   MAGIC FX — фоновые анимации: искры, свечи, совы.
   Всё нарисовано кодом (SVG/CSS), без внешних картинок.
   Подключается после styles.css и перед основным <script>.
   ============================================================ */

function initMagicFX(containerId){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.getElementById(containerId);
  if(!host) return;

  // ---------- искры ----------
  const emberN = 22;
  for(let i=0;i<emberN;i++){
    const s = document.createElement('span');
    s.style.left = (Math.random()*100)+'vw';
    s.style.setProperty('--drift', (Math.random()*60-30)+'px');
    s.style.animationDuration = (10 + Math.random()*10)+'s';
    s.style.animationDelay = (Math.random()*12)+'s';
    host.appendChild(s);
  }

  if(reduced) return; // свечи и совы — чисто декоративное движение, уважаем настройку ОС

  // ---------- свечи ----------
  const candleSVG = `
    <svg viewBox="0 0 40 90" width="100%" height="100%">
      <ellipse class="flame" cx="20" cy="14" rx="6" ry="11" fill="url(#flameGrad)"/>
      <circle cx="20" cy="18" r="4" fill="rgba(255,235,180,.9)"/>
      <rect x="16" y="24" width="8" height="4" fill="#3a2a12"/>
      <path d="M10 28 h20 v46 q0 6 -10 6 q-10 0 -10 -6 z" fill="url(#waxGrad)"/>
      <path d="M10 30 q10 5 20 0" stroke="rgba(0,0,0,.15)" fill="none" stroke-width="1"/>
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff3c4"/>
          <stop offset="45%" stop-color="#e9b23a"/>
          <stop offset="100%" stop-color="#b23a24" stop-opacity=".2"/>
        </radialGradient>
        <linearGradient id="waxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#efe0c3"/>
          <stop offset="55%" stop-color="#d8c7a2"/>
          <stop offset="100%" stop-color="#b9a67d"/>
        </linearGradient>
      </defs>
    </svg>`;
  const positions = [
    { cls:'left',  style:'left:2.5%; top:20%;' },
    { cls:'right', style:'right:2.5%; top:58%;' }
  ];
  positions.forEach(p=>{
    const c = document.createElement('div');
    c.className = 'candle-deco ' + p.cls;
    c.style.cssText = p.style;
    c.innerHTML = candleSVG;
    host.appendChild(c);
  });

  // ---------- совы ----------
  const owlSVG = `
    <svg viewBox="0 0 60 40" width="100%" height="100%">
      <g class="wing left">
        <path d="M28 18 C14 8, 2 12, 0 20 C10 20, 20 22, 28 22 Z" fill="currentColor"/>
      </g>
      <g class="wing right">
        <path d="M32 18 C46 8, 58 12, 60 20 C50 20, 40 22, 32 22 Z" fill="currentColor"/>
      </g>
      <ellipse cx="30" cy="22" rx="9" ry="11" fill="currentColor"/>
      <circle cx="30" cy="12" r="7" fill="currentColor"/>
      <path d="M24 8 q2 -5 4 -1 z M36 8 q-2 -5 -4 -1 z" fill="currentColor"/>
    </svg>`;

  function spawnOwl(){
    // внешний div — только полёт (WAAPI), внутренний — только зеркалирование (CSS).
    // Так две системы анимации transform не конфликтуют друг с другом.
    const el = document.createElement('div');
    el.className = 'owl';
    const inner = document.createElement('div');
    inner.className = 'owl-inner';
    inner.innerHTML = owlSVG;
    el.appendChild(inner);
    host.appendChild(el);

    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -60 : window.innerWidth + 60;
    const endX = fromLeft ? window.innerWidth + 60 : -60;
    const y1 = window.innerHeight * (0.08 + Math.random()*0.55);
    const y2 = y1 + (Math.random()*90 - 45);
    const y3 = y1 + (Math.random()*70 - 35);
    const duration = 15000 + Math.random()*9000;

    el.style.top = y1 + 'px';
    el.style.left = startX + 'px';
    if(!fromLeft) inner.classList.add('flip'); // силуэт от природы смотрит вправо — отражаем для полёта налево

    const anim = el.animate([
      { transform: `translate(0px, 0px) rotate(0deg)`, offset: 0 },
      { transform: `translate(${(endX-startX)*0.5}px, ${y2-y1}px) rotate(${fromLeft? -4:4}deg)`, offset: 0.5 },
      { transform: `translate(${endX-startX}px, ${y3-y1}px) rotate(0deg)`, offset: 1 }
    ], { duration: duration, easing: 'ease-in-out', fill: 'forwards' });

    anim.onfinish = () => el.remove();
  }

  function scheduleOwl(){
    const delay = 9000 + Math.random()*14000;
    setTimeout(()=>{ spawnOwl(); scheduleOwl(); }, delay);
  }
  setTimeout(spawnOwl, 3000);
  scheduleOwl();
}
