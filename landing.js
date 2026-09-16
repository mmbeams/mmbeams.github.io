(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...document.querySelectorAll('main > .card')];
  const revealAnimations = new Map();
  let revealObserver;
  const showCard = (card, delay = 0) => {
    card.classList.remove('reveal-pending');
    revealObserver?.unobserve(card);
    if (reducedMotion.matches || card.contains(document.activeElement)) return;
    const animation = card.animate([
      { opacity: 0, translate: '0 32px' },
      { opacity: 1, translate: '0 0' }
    ], { duration: 620, delay, easing: 'cubic-bezier(.22, .75, .2, 1)', fill: 'backwards' });
    revealAnimations.set(card, animation);
    animation.finished.then(() => revealAnimations.delete(card)).catch(() => {});
  };
  if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    revealObserver = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        showCard(entry.target, Math.min(index, 2) * 55);
      });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
    cards.forEach(card => {
      card.classList.add('reveal-pending');
      revealObserver.observe(card);
      card.addEventListener('focusin', () => {
        card.classList.remove('reveal-pending');
        revealObserver.unobserve(card);
        revealAnimations.get(card)?.cancel();
      });
    });
  }
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver?.disconnect();
    cards.forEach(card => card.classList.remove('reveal-pending'));
    revealAnimations.forEach(animation => animation.cancel());
    revealAnimations.clear();
  });

  // Keep real page links and browser history; animate only ordinary tab clicks.
  const nav = document.querySelector('.header nav');
  if (nav) {
    const selected = nav.querySelector('[aria-current="page"]');
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    nav.prepend(indicator);
    let destination = selected;
    let navigationTimer;
    const positionIndicator = link => {
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.height = link.offsetHeight + 'px';
      indicator.style.top = link.offsetTop + 'px';
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    positionIndicator(selected);
    nav.classList.add('has-indicator');
    requestAnimationFrame(() => nav.classList.add('indicator-ready'));
    new ResizeObserver(() => positionIndicator(destination)).observe(nav);
    nav.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
      event.preventDefault();
      clearTimeout(navigationTimer);
      destination = link;
      positionIndicator(link);
      if (link === selected) return;
      navigationTimer = setTimeout(() => location.assign(link.href), 320);
    });
    window.addEventListener('pageshow', () => {
      clearTimeout(navigationTimer);
      destination = selected;
      nav.classList.remove('indicator-ready');
      positionIndicator(selected);
      requestAnimationFrame(() => nav.classList.add('indicator-ready'));
    });
  }
  const page = document.querySelector('.page');
  const viewer = document.createElement('dialog');
  viewer.className = 'card-view';
  viewer.setAttribute('aria-label', 'Focused card. Press Escape or click outside the card to close.');
  document.body.append(viewer);
  let sourceCard;
  function closeCard() { viewer.close(); }
  viewer.addEventListener('click', event => {
    if (event.target === viewer) closeCard();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('card-open');
    page.inert = false;
    viewer.replaceChildren();
    sourceCard?.focus({ preventScroll: true });
  });
  function openCard(card) {
    sourceCard = card;
    const bounds = card.getBoundingClientRect();
    const focused = card.cloneNode(true);
    focused.classList.remove('reveal-pending');
    focused.classList.add('focused-card');
    focused.removeAttribute('id');
    focused.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    focused.querySelectorAll('img').forEach(img => img.loading = 'eager');
    focused.style.setProperty('--focus-width', Math.min(Math.max(bounds.width, 480), 900) + 'px');
    focused.style.setProperty('--focus-height', bounds.height + 'px');
    const ratio = getComputedStyle(card).aspectRatio;
    if (ratio !== 'auto') {
      const [width, height = 1] = ratio.split('/').map(Number);
      focused.dataset.proportional = '';
      focused.style.setProperty('--focus-ratio', width / height);
    }
    focused.tabIndex = 0;
    // A second click on a linked card still opens its original destination.
    viewer.replaceChildren(focused);
    viewer.showModal();
    page.inert = true;
    document.body.classList.add('card-open');
    focused.focus({ preventScroll: true });
    const canTilt = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const area = focused.getBoundingClientRect();
    focused.addEventListener('pointermove', event => {
      if (!canTilt.matches || event.pointerType === 'touch') return;
      const x = Math.max(-1, Math.min(1, (event.clientX - area.left) / area.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - area.top) / area.height * 2 - 1));
      focused.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
      focused.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
    });
    focused.addEventListener('pointerleave', () => {
      focused.style.setProperty('--tilt-x', '0deg');
      focused.style.setProperty('--tilt-y', '0deg');
    });
  }
  document.querySelectorAll('main .card').forEach(card => {
    // The embedded player is interactive in place rather than a cloned modal.
    if (card.matches('.cover-player')) return;
    if (!card.matches('a, button')) card.tabIndex = 0;
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      // Explicit links inside text cards retain their normal behavior.
      if (event.target.closest('a, button') && event.target.closest('a, button') !== card) return;
      event.preventDefault();
      openCard(card);
    });
    card.addEventListener('keydown', event => {
      if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openCard(card);
      }
    });
  });
  document.querySelectorAll('.cover-player').forEach(card => {
    const audio = card.querySelector('audio');
    const play = card.querySelector('[data-audio="play"]');
    const previous = card.querySelector('[data-audio="previous"]');
    const next = card.querySelector('[data-audio="next"]');
    let tracks = [];
    let index = 0;
    let request = 0;
    const status = card.querySelector('.preview-status');
    const sync = () => {
      card.classList.toggle('is-playing', !audio.paused);
      play.setAttribute('aria-label', audio.paused ? 'Play song preview' : 'Pause song preview');
      play.title = play.getAttribute('aria-label');
    };
    const start = async () => {
      const current = ++request;
      status.textContent = 'Loading preview…';
      try {
        await audio.play();
        if (current === request) status.textContent = 'Playing preview · full playlist on Spotify';
      } catch (error) {
        if (current === request && error.name !== 'AbortError') status.textContent = 'Preview unavailable. Try next or open Spotify.';
      }
    };
    const changeTrack = step => {
      if (!tracks.length) return;
      ++request;
      audio.pause();
      index = (index + step + tracks.length) % tracks.length;
      const track = tracks[index];
      card.querySelector('.playlist-bottom h2').textContent = track.title;
      card.querySelector('.playlist-bottom > p').textContent = track.artist + ' · blv';
      const cover = card.querySelector('.playlist-cover');
      cover.src = track.cover;
      cover.alt = 'Album cover for ' + track.title + ' by ' + track.artist;
      audio.src = track.preview;
      start();
    };
    play.addEventListener('click', () => {
      if (!audio.paused) { ++request; audio.pause(); }
      else start();
    });
    previous.addEventListener('click', () => changeTrack(-1));
    next.addEventListener('click', () => changeTrack(1));
    fetch('playlist-tracks.json').then(response => {
      if (!response.ok) throw new Error('Playlist unavailable');
      return response.json();
    }).then(data => {
      tracks = data;
      previous.disabled = next.disabled = tracks.length < 2;
    }).catch(() => { status.textContent = 'Only the first preview is available. Full playlist on Spotify.'; });
    audio.addEventListener('play', sync);
    audio.addEventListener('pause', () => { sync(); status.textContent = 'Preview paused · full playlist on Spotify'; });
    audio.addEventListener('ended', () => { if (tracks.length > 1) changeTrack(1); else sync(); });
    audio.addEventListener('error', () => { sync(); status.textContent = 'Preview unavailable. Open the playlist on Spotify.'; });
  });
  const copyButton = document.querySelector('#copy-email');
  if (!copyButton) return;
  const original = copyButton.innerHTML;
  let resetTimer;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText('moirahuang18@gmail.com');
      copyButton.textContent = 'Email copied ✓';
      status.textContent = 'Email address copied to clipboard.';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { copyButton.innerHTML = original; }, 2500);
    } catch {
      status.textContent = 'Email Moira at moirahuang18@gmail.com';
      copyButton.textContent = 'moirahuang18@gmail.com';
    }
  });
})();
