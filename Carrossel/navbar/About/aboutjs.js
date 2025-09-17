/* about.js (versão debug com logs) */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const leftBtn = document.querySelector('.left-arrow');
  const rightBtn = document.querySelector('.right-arrow');

  console.log('[INIT] DOMContentLoaded');
  console.log('[INIT] carousel:', carousel);
  console.log('[INIT] leftBtn:', leftBtn);
  console.log('[INIT] rightBtn:', rightBtn);

  if (!carousel) {
    console.warn('[ERRO] Carrossel não encontrado (selector ".carousel").');
    return;
  }

  // util
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const debounce = (fn, ms = 120) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  // métricas
  let cards = Array.from(carousel.querySelectorAll('.card'));
  let gap = 16;
  let cardWidth = 0;
  let cardsPerView = 1;
  let scrollAmount = Math.round(carousel.clientWidth / 3);

  const getGapFromCSS = () => {
    const cs = getComputedStyle(carousel);
    const gapStr = cs.getPropertyValue('gap') || cs.getPropertyValue('column-gap') || cs.getPropertyValue('columnGap') || '16px';
    return parseFloat(gapStr) || 16;
  };

  const calculateMetrics = () => {
    cards = Array.from(carousel.querySelectorAll('.card'));
    gap = getGapFromCSS();
    if (cards.length) {
      cardWidth = Math.round(cards[0].getBoundingClientRect().width);
      const single = cardWidth + gap;
      cardsPerView = Math.max(1, Math.floor(carousel.clientWidth / single) || 1);
      scrollAmount = Math.max(1, Math.round(single * cardsPerView));
    } else {
      cardWidth = Math.round(carousel.clientWidth / 3);
      cardsPerView = 1;
      scrollAmount = Math.round(carousel.clientWidth / 3);
    }
    console.log('[METRICS] cardWidth:', cardWidth, 'gap:', gap, 'cardsPerView:', cardsPerView, 'scrollAmount:', scrollAmount);
  };

  const updateArrowState = () => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (leftBtn) leftBtn.disabled = carousel.scrollLeft <= 5;
    if (rightBtn) rightBtn.disabled = carousel.scrollLeft >= (max - 5);
    console.log('[STATE] scrollLeft:', carousel.scrollLeft, 'max:', max);
  };

  const scrollToDirection = (dir) => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    const target = clamp(Math.round(carousel.scrollLeft + dir * scrollAmount), 0, Math.max(0, max));
    console.log('[ACTION] scrollToDirection dir=', dir, 'target=', target);
    carousel.scrollTo({ left: target, behavior: 'smooth' });
  };

  // init
  calculateMetrics();
  updateArrowState();

  window.addEventListener('resize', debounce(() => { 
    console.log('[EVENT] resize');
    calculateMetrics(); 
    updateArrowState(); 
  }, 120));

  window.addEventListener('load', () => { 
    console.log('[EVENT] window.load'); 
    calculateMetrics(); 
    updateArrowState(); 
  });

  if (leftBtn) {
    leftBtn.addEventListener('click', (e) => {
      console.log('[EVENT] leftBtn.click');
      e.preventDefault();
      scrollToDirection(-1);
    });
  }
  if (rightBtn) {
    rightBtn.addEventListener('click', (e) => {
      console.log('[EVENT] rightBtn.click');
      e.preventDefault();
      scrollToDirection(1);
    });
  }

  // pointer drag
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  carousel.addEventListener('pointerdown', (ev) => {
    console.log('[EVENT] pointerdown', ev.clientX);
    isPointerDown = true;
    startX = ev.clientX;
    startScrollLeft = carousel.scrollLeft;
    carousel.classList.add('dragging');
    try { ev.target.setPointerCapture(ev.pointerId); } catch (err) {}
  });
  carousel.addEventListener('pointermove', (ev) => {
    if (!isPointerDown) return;
    const dx = ev.clientX - startX;
    carousel.scrollLeft = startScrollLeft - dx;
    console.log('[EVENT] pointermove dx=', dx, 'scrollLeft=', carousel.scrollLeft);
  });
  const releasePointer = (ev) => {
    if (!isPointerDown) return;
    console.log('[EVENT] pointerup/pointercancel');
    isPointerDown = false;
    carousel.classList.remove('dragging');
    try { ev.target.releasePointerCapture && ev.target.releasePointerCapture(ev.pointerId); } catch (err) {}
    updateArrowState();
  };
  carousel.addEventListener('pointerup', releasePointer);
  carousel.addEventListener('pointercancel', releasePointer);
  carousel.addEventListener('pointerleave', releasePointer);

  carousel.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      console.log('[EVENT] wheel deltaY=', e.deltaY);
      carousel.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      console.log('[EVENT] keydown ArrowLeft');
      scrollToDirection(-1);
    } else if (e.key === 'ArrowRight') {
      console.log('[EVENT] keydown ArrowRight');
      scrollToDirection(1);
    }
  });

  carousel.addEventListener('scroll', debounce(() => {
    console.log('[EVENT] scroll scrollLeft=', carousel.scrollLeft);
    updateArrowState();
  }, 60));

  setTimeout(() => { 
    console.log('[TIMEOUT] recalc metrics');
    calculateMetrics(); 
    updateArrowState(); 
  }, 300);
});
