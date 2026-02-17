(() => {
  const focusable = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  function setTrap(container) {
    const nodes = [...container.querySelectorAll(focusable)];
    if (!nodes.length) return () => {};
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    function onKey(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  }

  document.querySelectorAll('.lang-dropdown').forEach((drop) => {
    const btn = drop.querySelector('.lang-pill');
    btn?.addEventListener('click', () => drop.classList.toggle('open'));
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) drop.classList.remove('open'); });
  });

  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeDrawerBtn = document.querySelector('.drawer-close');
  let releaseDrawerTrap = null;

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    releaseDrawerTrap?.();
  }
  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.classList.add('no-scroll');
    releaseDrawerTrap = setTrap(drawer);
    drawer.querySelector('a,button')?.focus();
  }
  burger?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  const modal = document.querySelector('.modal');
  const openModal = document.querySelectorAll('[data-open-privacy]');
  const closeModal = document.querySelectorAll('[data-close-privacy]');
  let releaseModalTrap = null;

  function hideModal() {
    modal?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    releaseModalTrap?.();
  }
  function showModal() {
    modal?.classList.add('open');
    document.body.classList.add('no-scroll');
    releaseModalTrap = setTrap(modal);
    modal.querySelector('.modal-close-x')?.focus();
  }
  openModal.forEach((btn) => btn.addEventListener('click', showModal));
  closeModal.forEach((btn) => btn.addEventListener('click', hideModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      hideModal();
      document.querySelectorAll('.lang-dropdown').forEach((d) => d.classList.remove('open'));
    }
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach((i) => { if (i !== item) i.classList.remove('active'); });
      item.classList.toggle('active');
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
