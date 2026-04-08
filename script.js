document.addEventListener('DOMContentLoaded', function () {

  // ─── CURSOR ───
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('button,a,.service-card,.g-item,.testi-card,.step-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width = '6px'; cur.style.height = '6px';
      curR.style.width = '52px'; curR.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width = '12px'; cur.style.height = '12px';
      curR.style.width = '36px'; curR.style.height = '36px';
    });
  });

  // ─── NAV SCROLL ───
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── SVG LATICE ───
  const hero = document.querySelector('.hero');

  // Paleta: samo roze tonovi
  const petalPalettes = [
    { fill: '#f2a0b5', inner: '#e8799a' },
    { fill: '#fad0de', inner: '#f2a0b5' },
    { fill: '#fce8ef', inner: '#f2a0b5' },
    { fill: '#e8799a', inner: '#c45e7a' },
    { fill: '#f5b8cc', inner: '#e8799a' },
  ];

  // SVG latica — elipsa sa unutrašnjim prelivom
  function createSvgPetal() {
    const pal = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
    const w = 10 + Math.random() * 12;   // 10–22px širina
    const h = 20 + Math.random() * 18;   // 20–38px visina
    const opacity = 0.55 + Math.random() * 0.35;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.overflow = 'visible';

    const defs = document.createElementNS(svgNS, 'defs');
    const gradId = 'pg_' + Math.random().toString(36).slice(2);
    const grad = document.createElementNS(svgNS, 'radialGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('cx', '35%'); grad.setAttribute('cy', '30%');
    grad.setAttribute('r', '65%');
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#fff');
    stop1.setAttribute('stop-opacity', '0.45');
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', pal.inner);
    stop2.setAttribute('stop-opacity', '1');
    grad.appendChild(stop1); grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Osnova latice
    const base = document.createElementNS(svgNS, 'ellipse');
    base.setAttribute('cx', w / 2); base.setAttribute('cy', h / 2);
    base.setAttribute('rx', w / 2); base.setAttribute('ry', h / 2);
    base.setAttribute('fill', pal.fill);
    base.setAttribute('opacity', opacity);

    // Preliv za dubinu
    const shine = document.createElementNS(svgNS, 'ellipse');
    shine.setAttribute('cx', w / 2); shine.setAttribute('cy', h / 2);
    shine.setAttribute('rx', w / 2); shine.setAttribute('ry', h / 2);
    shine.setAttribute('fill', `url(#${gradId})`);

    // Centralna žilica
    const vein = document.createElementNS(svgNS, 'line');
    vein.setAttribute('x1', w / 2); vein.setAttribute('y1', h * 0.12);
    vein.setAttribute('x2', w / 2); vein.setAttribute('y2', h * 0.88);
    vein.setAttribute('stroke', pal.inner);
    vein.setAttribute('stroke-width', '0.4');
    vein.setAttribute('stroke-opacity', '0.4');

    svg.appendChild(base);
    svg.appendChild(shine);
    svg.appendChild(vein);
    return svg;
  }

  const COUNT = 15;
  for (let i = 0; i < COUNT; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'petal';

    const startX   = Math.random() * 100;           // % horizontalno
    const dur      = 10 + Math.random() * 8;        // 10–18s (srednje)
    const delay    = -(Math.random() * dur);         // odmah vidljive od starta
    const driftX   = (Math.random() - 0.5) * 140;   // blagi horizontalni drift
    const rotStart = Math.random() * 360;
    const rotEnd   = rotStart + 200 + Math.random() * 300;

    wrapper.style.cssText = [
      `left: ${startX}%`,
      `animation-duration: ${dur}s`,
      `animation-delay: ${delay}s`,
      `--drift-x: ${driftX}px`,
      `--rot-start: ${rotStart}deg`,
      `--rot-end: ${rotEnd}deg`,
    ].join(';');

    wrapper.appendChild(createSvgPetal());
    hero.appendChild(wrapper);
  }

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  revealEls.forEach(r => obs.observe(r));

  // ─── SMOOTH NAV LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── LIGHTBOX ───
  const overlay   = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');

  const gItems = Array.from(document.querySelectorAll('.g-item'));
  let current = 0;

  function openLightbox(index) {
    current = index;
    const item = gItems[current];
    const img  = item.querySelector('.g-img');
    const lbl  = item.querySelector('.g-label');
    lbImg.src             = img.src;
    lbImg.alt             = img.alt;
    lbCaption.textContent = lbl ? lbl.textContent : '';
    lbCounter.textContent = `${current + 1} / ${gItems.length}`;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() { current = (current - 1 + gItems.length) % gItems.length; openLightbox(current); }
  function showNext() { current = (current + 1) % gItems.length; openLightbox(current); }

  gItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  e => { e.stopPropagation(); showPrev(); });
  lbNext.addEventListener('click',  e => { e.stopPropagation(); showNext(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

});
