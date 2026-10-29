(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const exhibits = [...document.querySelectorAll('.exhibit')];
  const running = new Set();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches || !Element.prototype.animate) continue;
      for (const [selector, offset, duration] of [['.exhibit-title', 22, 850], ['.exhibit-float', 48, 700], ['.exhibit-caption', 12, 650]]) {
        const element = entry.target.querySelector(selector);
        const animation = element.animate([{ opacity: 0, translate: `0 ${offset}px` }, { opacity: 1, translate: '0 0' }], { duration, easing: 'cubic-bezier(.22,.75,.2,1)' });
        running.add(animation);
        animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
      }
    }
  }, { threshold: .12 }) : null;
  exhibits.forEach(exhibit => {
    observer?.observe(exhibit);
    const anchor = exhibit.querySelector('.exhibit-cover');
    const area = exhibit.querySelector('.exhibit-float');
    const reset = () => { anchor.style.removeProperty('--rx'); anchor.style.removeProperty('--ry'); };
    area.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = area.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      anchor.style.setProperty('--rx', `${-y * 4}deg`);
      anchor.style.setProperty('--ry', `${x * 4}deg`);
    });
    area.addEventListener('pointerleave', reset);
    anchor.addEventListener('blur', reset);
    anchor.addEventListener('focus', () => { observer?.unobserve(exhibit); running.forEach(animation => animation.cancel()); });
    reduced.addEventListener('change', reset);
  });
  reduced.addEventListener('change', () => { if (reduced.matches) running.forEach(animation => animation.cancel()); });
})();
