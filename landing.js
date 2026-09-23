(() => {
  const localTime = document.querySelector('[data-local-time]');
  if (localTime) {
    const updateClock = () => {
      const now = new Date();
      localTime.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
      localTime.dateTime = now.toISOString();
    };
    updateClock();
    setInterval(updateClock, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });
  }
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
  const startCardReveals = (skipIntro = false) => {
  if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    revealObserver = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        showCard(entry.target, Math.min(index, 2) * 55);
      });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
    cards.forEach(card => {
      if (skipIntro && card.matches('.identity-card')) return;
      card.classList.add('reveal-pending');
      revealObserver.observe(card);
      card.addEventListener('focusin', () => {
        card.classList.remove('reveal-pending');
        revealObserver.unobserve(card);
        revealAnimations.get(card)?.cancel();
      });
    });
  }
  };

  const playOpening = async () => {
    const root = document.documentElement;
    const intro = document.querySelector('.desk-page main > .identity-card');
    if (!root.classList.contains('opening-pending') || !intro || reducedMotion.matches) {
      root.classList.remove('opening-pending');
      clearTimeout(window.openingFallback);
      startCardReveals();
      return;
    }
    // Every refresh starts the opening at the top, not at a restored scroll offset.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const page = document.querySelector('.desk-page > .page');
    const scene = document.createElement('div');
    scene.className = 'opening-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.inert = true;
    const copy = intro.cloneNode(true);
    copy.removeAttribute('tabindex');
    copy.removeAttribute('data-flip');
    const target = intro.getBoundingClientRect();
    const left = (innerWidth - target.width) / 2;
    const top = (innerHeight - target.height) / 2;
    const openingWidth = innerWidth;
    const openingHeight = innerHeight;
    Object.assign(copy.style, { width: `${target.width}px`, height: `${target.height}px`, left: `${left}px`, top: `${top}px` });
    const garden = document.createElement('div');
    garden.className = 'opening-garden';
    // Use the original PNG's alpha silhouette, tinted without new image assets.
    const flowerPalette = ['#b9b2e4', '#edcc75', '#adcdb7', '#e9afb5', '#9fc8df', '#edb98c', '#c0b5dd', '#e8cf87', '#b5ceb3', '#e6b4c9', '#a9c9dc', '#e9b797'];
    // A dense, staggered field: adjacent silhouettes intentionally overlap.
    const blooms = Array.from({ length: 72 }, (_, index) => {
      // Keep the established composition, with fewer flowers across the field.
      if (index % 3 === 1) return null;
      const column = index % 12;
      const row = Math.floor(index / 12);
      const x = column * 9.1 + (row % 2 ? 3 : -2) + Math.sin(index * 2.4) * 3;
      const y = row * 20 + Math.cos(index * 1.7) * 5;
      // Thin the center without changing the dense, overlapping outer edge.
      if (x > 24 && x < 76 && y > 24 && y < 76 && (column + row) % 2 === 0) return null;
      const size = 130 + ((index * 73) % 170);
      const angle = (index * 47) % 360;
      const color = flowerPalette[(index * 5 + row) % flowerPalette.length];
      const bloom = document.createElement('span');
      bloom.className = 'opening-bloom';
      Object.assign(bloom.style, { left: `${x}%`, top: `${y}%`, width: `${size}px`, height: `${size}px`, backgroundColor: color });
      garden.append(bloom);
      return { bloom, angle };
    }).filter(Boolean);
    scene.append(garden, copy);
    document.body.append(scene);
    const wasInert = page.inert;
    page.inert = true;
    const animations = [];
    let finished = false;
    const finish = (reason = 'complete') => {
      if (finished) return;
      finished = true;
      root.dataset.openingResult = typeof reason === 'string' ? reason : reason.type;
      clearTimeout(window.openingFallback);
      window.removeEventListener('resize', onOpeningResize);
      window.removeEventListener('pagehide', finish);
      document.removeEventListener('keydown', skip);
      reducedMotion.removeEventListener('change', finish);
      animations.forEach(animation => animation.cancel());
      scene.remove();
      page.inert = wasInert;
      startCardReveals(true);
      root.classList.remove('opening-pending');
      if (!reducedMotion.matches) {
        page.querySelectorAll('.header, footer').forEach(element => element.animate(
          [{ opacity: 0 }, { opacity: 1 }], { duration: 480, easing: 'ease-out' }
        ));
      }
    };
    const skip = event => { if (event.key === 'Escape' || event.key === 'Tab') finish(); };
    // Scrollbar/layout settling can dispatch resize without a real window resize.
    const onOpeningResize = () => {
      if (Math.abs(innerWidth - openingWidth) > 48 || Math.abs(innerHeight - openingHeight) > 48) finish('resize');
    };
    window.addEventListener('resize', onOpeningResize);
    window.addEventListener('pagehide', finish);
    document.addEventListener('keydown', skip);
    reducedMotion.addEventListener('change', finish);
    clearTimeout(window.openingFallback);
    window.openingFallback = setTimeout(finish, 4500);
    const animate = (element, frames, duration, easing = 'cubic-bezier(.22,.75,.2,1)') => {
      if (finished) throw new Error('Opening skipped');
      const animation = element.animate(frames, { duration, easing, fill: 'forwards' });
      animations.push(animation);
      return animation.finished;
    };
    try {
      const flower = copy.querySelector('.identity-flower');
      const bounds = flower.getBoundingClientRect();
      const x = innerWidth / 2 - bounds.left - bounds.width / 2;
      const y = innerHeight / 2 - bounds.top - bounds.height / 2;
      const centered = `translate(${x}px, ${y}px) scale(2.5)`;
      flower.style.transform = centered;
      await Promise.race([flower.decode(), new Promise(resolve => setTimeout(resolve, 600))]);
      scene.dataset.stage = 'flower';
      await animate(flower, [{ transform: `${centered} rotate(-100deg)`, opacity: 0 }, { transform: `${centered} rotate(260deg)`, opacity: 1 }], 750);
      scene.dataset.stage = 'content';
      await Promise.all([
        ...blooms.map(({ bloom, angle }) => animate(bloom, [
          { opacity: 1, transform: `translate(-50%, -50%) scale(.8) rotate(${angle - 22}deg)` },
          { opacity: 1, transform: `translate(-50%, -50%) scale(1) rotate(${angle}deg)` }
        ], 620)),
        animate(flower, [{ transform: `${centered} rotate(260deg)` }, { transform: 'translate(0, 0) scale(1) rotate(360deg)' }], 480),
        ...[...copy.querySelector('.identity-front').children].filter(child => child !== flower).map(child =>
          animate(child, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }], 480))
      ]);
      scene.dataset.stage = 'border';
      await animate(copy.querySelector('.identity-front'), [{ borderColor: 'transparent' }, { borderColor: getComputedStyle(intro).getPropertyValue('--border').trim() }], 280);
      scene.dataset.stage = 'landing';
      await Promise.all([
        animate(garden, [{ opacity: 1 }, { opacity: 0 }], 460),
        animate(copy, [{ transform: 'translate(0, 0)' }, { transform: `translate(${target.left - left}px, ${target.top - top}px)` }], 680)
      ]);
    } catch (error) {
      // Asset errors or interrupted animations must never block the portfolio.
      if (!finished) console.warn('Opening animation could not finish:', error);
    } finally {
      finish();
    }
  };
  playOpening();
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver?.disconnect();
    cards.forEach(card => card.classList.remove('reveal-pending'));
    revealAnimations.forEach(animation => animation.cancel());
    revealAnimations.clear();
  });

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const stage = gallery.querySelector('.photo-stack-stage');
    const photos = [...stage.querySelectorAll('img')];
    const status = gallery.querySelector('[role="status"]');
    let active = 0;
    let switching = false;
    const render = () => {
      photos.forEach((photo, index) => {
        const offset = (index - active + photos.length) % photos.length;
        photo.dataset.stackPosition = offset === 0 ? 'front' : offset === 1 ? 'middle' : 'back';
      });
      const next = photos[(active + 1) % photos.length];
      stage.setAttribute('aria-label', `Show next photo: ${next.dataset.photoTitle}`);
      status.textContent = `Photo ${active + 1} of ${photos.length}: ${photos[active].dataset.photoTitle}. Activate to show the next photo.`;
    };
    const advance = () => {
      if (switching) return;
      switching = true;
      if (!reducedMotion.matches) stage.classList.add('is-switching');
      const delay = reducedMotion.matches ? 0 : 230;
      setTimeout(() => {
        active = (active + 1) % photos.length;
        render();
        stage.classList.remove('is-switching');
        setTimeout(() => { switching = false; }, reducedMotion.matches ? 0 : 300);
      }, delay);
    };
    render();
    stage.addEventListener('click', advance);
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
  let resizeFocusedCard;
  window.addEventListener('resize', () => resizeFocusedCard?.());
  function closeCard() { viewer.close(); }
  viewer.addEventListener('click', event => {
    if (event.target === viewer) closeCard();
  });
  viewer.addEventListener('close', () => {
    resizeFocusedCard = null;
    document.body.classList.remove('card-open');
    page.inert = false;
    viewer.replaceChildren();
    sourceCard?.focus({ preventScroll: true });
  });
  function openCard(card) {
    sourceCard = card;
    const sourceStyle = getComputedStyle(card);
    const width = parseFloat(sourceStyle.width);
    const height = parseFloat(sourceStyle.height);
    const focused = card.cloneNode(true);
    focused.classList.remove('reveal-pending');
    focused.classList.add('focused-card');
    focused.removeAttribute('id');
    focused.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    focused.querySelectorAll('img').forEach(img => img.loading = 'eager');
    // Keep the thumbnail's actual layout, scaling text, padding and artwork together.
    focused.style.width = width + 'px';
    focused.style.height = height + 'px';
    focused.style.minHeight = '0';
    focused.style.aspectRatio = 'auto';
    const stage = document.createElement('div');
    stage.className = 'card-focus-stage';
    const scaleLayer = document.createElement('div');
    scaleLayer.className = 'card-focus-scale';
    scaleLayer.style.width = width + 'px';
    scaleLayer.style.height = height + 'px';
    scaleLayer.append(focused);
    stage.append(scaleLayer);
    focused.tabIndex = 0;
    // A second click on a linked card still opens its original destination.
    viewer.replaceChildren(stage);
    viewer.showModal();
    resizeFocusedCard = () => {
      const padding = getComputedStyle(viewer);
      const availableWidth = viewer.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight) - 32;
      const availableHeight = viewer.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom) - 32;
      const scale = Math.max(.1, Math.min(Math.min(Math.max(width, 480), 900) / width, availableWidth / width, availableHeight / height));
      stage.style.width = width * scale + 'px';
      stage.style.height = height * scale + 'px';
      scaleLayer.style.transform = `scale(${scale})`;
    };
    resizeFocusedCard();
    page.inert = true;
    document.body.classList.add('card-open');
    focused.focus({ preventScroll: true });
    const canTilt = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    focused.addEventListener('pointermove', event => {
      if (!canTilt.matches || event.pointerType === 'touch') return;
      const area = stage.getBoundingClientRect();
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
    if (card.matches('.cover-player, [data-gallery], [data-flip]')) return;
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
