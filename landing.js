(() => {
  const shell=document.querySelector('.site-shell');
  const loader=document.querySelector('.loader');
  const roll=document.querySelector('.roll');
  const buttons=[...document.querySelectorAll('.rail-button')];
  const cursor=document.createElement('div');
  cursor.className='cursor-square';
  document.body.appendChild(cursor);
  window.addEventListener('pointermove', e=>{
    cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';
  },{passive:true});
  const petals=[...loader.querySelectorAll('.loader-petal')];
  const finishLoading=()=>{
    loader.classList.add('is-done');
    shell.classList.add('is-ready');
  };
  const placePetals=t=>{
    // One cubic arc, repeated by the four SVG groups at 90-degree intervals.
    // The circles keep their radius; the central square never moves.
    const x=18*t*(1-t);
    const y=-10*t*t*(3-2*t);
    petals.forEach(petal=>{
      petal.setAttribute('cx',x);
      petal.setAttribute('cy',y);
    });
  };
  const fillPetals=progress=>{
    // Shrink the centered stroke inward so the outer radius stays exactly 8.
    const stroke=.75*(1-progress);
    petals.forEach(petal=>{
      petal.setAttribute('r',8-stroke/2);
      petal.setAttribute('stroke-width',stroke);
      petal.setAttribute('fill-opacity',1-Math.pow(1-progress,.25));
    });
    loader.querySelector('.loader-core').setAttribute('opacity',progress===1?1:0);
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    fillPetals(1); placePetals(1);
    setTimeout(finishLoading,250);
  }else{
    const retract=()=>{
      const started=performance.now();
      const logo=loader.querySelector('.loader-logo');
      logo.style.transformOrigin='50% 50%';
      const tick=now=>{
        const elapsed=now-started;
        const progress=Math.min(1,elapsed/200);
        // Retract and shrink in one continuous, accelerating movement.
        const eased=progress*progress;
        placePetals(1-eased);
        logo.style.transform=`scale(${1-eased})`;
        if(progress<1) requestAnimationFrame(tick);
        else finishLoading();
      };
      requestAnimationFrame(tick);
    };
    const started=performance.now();
    const unfold=now=>{
      const elapsed=now-started;
      const fill=Math.max(0,Math.min(1,(elapsed-350)/350));
      fillPetals(fill*fill*(3-2*fill));
      const progress=Math.max(0,Math.min(1,(elapsed-780)/950));
      // Strong acceleration out of the overlap, then a soft final landing.
      const eased=progress<.5?16*Math.pow(progress,5):1-Math.pow(-2*progress+2,5)/2;
      placePetals(eased);
      if(progress<1) requestAnimationFrame(unfold);
      else setTimeout(retract,250);
    };
    requestAnimationFrame(unfold);
  }

  // The year stays visible; only its two digits roll during scroll motion.
  const year = document.querySelector('.date-marker span');
  year.textContent = '';
  year.append('[');
  const digits = [...'26'].map(value => {
    const slot = document.createElement('span');
    slot.className = 'year-digit';
    const strip = document.createElement('span');
    strip.className = 'year-strip';
    const cells = Array.from({length:3}, () => {
      const cell = document.createElement('span');
      strip.appendChild(cell);
      return cell;
    });
    slot.appendChild(strip);
    year.appendChild(slot);
    return {slot, strip, cells, value:Number(value), position:Number(value), finishDelay:0};
  });
  year.append(']');
  year.setAttribute('aria-label', '[26]');
  digits.forEach(digit => digit.slot.setAttribute('aria-hidden', 'true'));
  let yearRaf = 0, yearMotion = 0, yearTick = 0, yearDirection = 1, yearFinish = 0;
  const renderYear = () => digits.forEach(digit => {
    const base = Math.floor(digit.position);
    digit.cells.forEach((cell,index) => { cell.textContent = ((base+index-1)%10+10)%10; });
    digit.strip.style.transform = `translateY(${-100/3*(1+digit.position-base)}%)`;
  });
  const tickYear = now => {
    const dt = Math.min(40,now-yearTick)/1000;
    yearTick = now;
    if (!yearFinish && now-yearMotion > 140) {
      yearFinish = now;
      digits.forEach((digit,index) => {
        digit.finishDelay = index * 70;
        digit.start = digit.position;
        digit.target = yearDirection > 0
          ? Math.ceil((digit.position+2-digit.value)/10)*10+digit.value
          : Math.floor((digit.position-2-digit.value)/10)*10+digit.value;
      });
    }
    const progress = yearFinish ? Math.min(1,(now-yearFinish)/450) : 0;
    digits.forEach((digit,index) => {
      const localProgress = yearFinish ? Math.min(1,Math.max(0,(now-yearFinish-digit.finishDelay)/380)) : 0;
      digit.position = yearFinish
        ? digit.start+(digit.target-digit.start)*(1-Math.pow(1-localProgress,4))
        : digit.position+yearDirection*(10+index*3)*dt;
    });
    renderYear();
    if (yearFinish && progress === 1) {
      digits.forEach(digit => { digit.position = digit.value; });
      renderYear();
      yearRaf = 0;
    } else yearRaf = requestAnimationFrame(tickYear);
  };
  const spinYear = direction => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    yearDirection = direction;
    yearMotion = performance.now();
    yearFinish = 0;
    if (!yearRaf) { yearTick = yearMotion; yearRaf = requestAnimationFrame(tickYear); }
  };
  renderYear();

  const fixedCopy = document.querySelector('.frame-copy').cloneNode(true);
  fixedCopy.classList.add('fixed-copy');
  fixedCopy.setAttribute('aria-live', 'polite');
  roll.appendChild(fixedCopy);
  let copyKey = '', copyRevision = 0;
  const copyAnimations = [];
  const showCopy = (frame, direction = 1, animate = true) => {
    const key = frame.dataset.title + '\n' + frame.dataset.subtitle;
    if (key === copyKey) return;
    const previous = [...fixedCopy.children].map(label => label.dataset.text || label.textContent || '');
    copyKey = key;
    const revision = ++copyRevision;
    copyAnimations.splice(0).forEach(animation => animation.cancel());
    [...fixedCopy.children].forEach((label, line) => {
      const text = line === 0 ? frame.dataset.title : frame.dataset.subtitle;
      label.textContent = text;
      label.classList.remove('is-reeling');
      label.dataset.text = text;
      if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const node = label.firstChild;
      if (!node) return;
      const box = label.getBoundingClientRect();
      const overlay = document.createElement('span');
      overlay.className = 'copy-reels';
      overlay.setAttribute('aria-hidden', 'true');
      let offset = 0;
      [...text].forEach((char, index) => {
        const range = document.createRange();
        range.setStart(node, offset); offset += char.length; range.setEnd(node, offset);
        if (!char.trim()) return;
        const rect = range.getBoundingClientRect();
        const height = rect.height + 4;
        const slot = document.createElement('span');
        slot.className = 'copy-reel-slot';
        slot.style.cssText = `left:${rect.left-box.left}px;top:${rect.top-box.top-2}px;width:${rect.width+1}px;height:${height}px`;
        const strip = document.createElement('span');
        const alphabet = /[A-Z]/.test(char) ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : /[a-z]/.test(char) ? 'abcdefghijklmnopqrstuvwxyz' : '0123456789';
        const origin = Math.max(0, alphabet.indexOf(char));
        const from = previous[line][index] || char;
        const letters=[from, ...[3,2,1].map(n => alphabet[(origin-direction*n+alphabet.length)%alphabet.length]), char];
        if(direction<0) letters.reverse();
        letters.forEach(letter => {
          const cell = document.createElement('span');
          cell.textContent = letter;
          cell.style.cssText = `display:block;height:${height}px;line-height:${height}px`;
          strip.appendChild(cell);
        });
        slot.appendChild(strip); overlay.appendChild(slot);
        const distance = height*4;
        const animation = strip.animate(
          direction > 0 ? [{transform:`translateY(0)`},{transform:`translateY(${-distance}px)`}] : [{transform:`translateY(${-distance}px)`},{transform:'translateY(0)'}],
          {duration:380, delay:Math.min(index*4,72), easing:'cubic-bezier(.33,1,.68,1)', fill:'both'}
        );
        copyAnimations.push(animation);
      });
      label.appendChild(overlay);
      label.classList.add('is-reeling');
    });
    Promise.all(copyAnimations.map(animation => animation.finished)).then(() => {
      if (revision !== copyRevision) return;
      [...fixedCopy.children].forEach(label => { label.textContent = label.dataset.text; label.classList.remove('is-reeling'); });
      copyAnimations.length = 0;
    }, () => {});
  };
  const syncCopy = (track, direction = 1, animate = true) => {
    if (!track.getClientRects().length) return;
    const center = track.getBoundingClientRect().top + track.clientHeight/2;
    let nearest, distance = Infinity;
    for (const frame of track.children) {
      const rect = frame.getBoundingClientRect();
      const delta = Math.abs((rect.top+rect.bottom)/2-center);
      if (delta < distance) { nearest = frame; distance = delta; }
    }
    if (nearest) showCopy(nearest, direction, animate);
  };

  const detail = document.createElement('section');
  detail.className = 'project-detail';
  detail.hidden = true;
  detail.setAttribute('aria-hidden','true');
  detail.innerHTML = `<button class="detail-close" type="button" aria-label="Back to projects">×</button><div class="detail-inner"><div class="detail-header"><div class="detail-switcher"><button class="detail-tab is-active" data-view="gallery">Gallery</button><button class="detail-tab" data-view="case">Case study</button></div><h1 class="detail-title"></h1></div><div class="detail-hero"><div class="detail-placeholder"></div></div><div class="detail-content"><p class="detail-kicker">Gallery</p><p class="detail-description">Project details and selected work will be added here.</p></div></div>`;
  document.body.appendChild(detail);
  const detailTitle=detail.querySelector('.detail-title');
  const detailPlaceholder=detail.querySelector('.detail-placeholder');
  const detailKicker=detail.querySelector('.detail-kicker');
  const detailDescription=detail.querySelector('.detail-description');
  const detailGallery=document.createElement('div');
  detailGallery.className='detail-gallery';
  detail.querySelector('.detail-inner').appendChild(detailGallery);
  document.querySelectorAll('[data-cover]').forEach(frame=>{ const cover=new Image(); cover.src=frame.dataset.cover; });
  let detailOpen=false, detailTransitionImage=null, detailTransitionTimer=0;
  const clearDetailTransition=()=>{
    clearTimeout(detailTransitionTimer);
    if(detailTransitionImage){ detailTransitionImage.remove(); detailTransitionImage=null; }
    detail.classList.remove('is-opening');
  };
  const closeProject=()=>{
    clearDetailTransition();
    detail.classList.remove('is-open'); detail.setAttribute('aria-hidden','true'); detailOpen=false;
    detailTransitionTimer=setTimeout(()=>{detail.hidden=true},420);
  };
  const openProject=frame=>{
    const image=frame.querySelector('.image-hover')||frame.querySelector('.image-unhover');
    const from=image.getBoundingClientRect();
    clearDetailTransition();
    detail.hidden=false; detailOpen=true; detail.scrollTop=0;
    detailTitle.textContent=frame.dataset.title.replace(/\n/g,' ');
    detailPlaceholder.style.backgroundImage=`url("${frame.dataset.cover || image.getAttribute('src')}")`;
    detailGallery.replaceChildren();
    (frame.dataset.gallery || '').split(',').filter(Boolean).forEach((src,index)=>{
      const picture=document.createElement('img'); picture.src=src;
      picture.alt=`${detailTitle.textContent} — ${index+1}`; picture.loading='lazy';
      detailGallery.appendChild(picture);
    });
    detail.querySelectorAll('.detail-tab').forEach(tab=>tab.classList.toggle('is-active',tab.dataset.view==='gallery'));
    detailKicker.textContent='Gallery';
    detailDescription.textContent=frame.dataset.subtitle;
    detail.classList.add('is-open','is-opening'); detail.setAttribute('aria-hidden','false');

    // Start at the thumbnail left edge and reveal toward the right while
    // moving into the detail bounds. Keep the central crop at the start.
    const target=detail.querySelector('.detail-hero').getBoundingClientRect();
    const transitionImage=document.createElement('div');
    transitionImage.className='detail-transition-image';
    transitionImage.setAttribute('aria-hidden','true');
    const artwork=document.createElement('div');
    artwork.className='detail-transition-artwork';
    artwork.style.backgroundImage=detailPlaceholder.style.backgroundImage;
    transitionImage.appendChild(artwork);
    Object.assign(transitionImage.style,{
      left:`${target.left}px`,top:`${target.top}px`,
      width:`${target.width}px`,height:`${target.height}px`
    });
    detail.appendChild(transitionImage);
    detailTransitionImage=transitionImage;
    const scale=from.height/target.height;
    const crop=Math.max(0,(target.width-from.width/scale)/2);
    const x=from.left-target.left;
    const y=from.top-target.top;
    const timing={
      duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:820,
      easing:'cubic-bezier(.22,.75,.25,1)',fill:'both'
    };
    artwork.animate([
      {transform:`translateX(${-crop}px)`},
      {transform:'translateX(0)'}
    ],timing);
    const animation=transitionImage.animate([
      {transform:`translate(${x}px,${y}px) scale(${scale})`,clipPath:`inset(0 ${crop*2}px 0 0)`},
      {transform:'translate(0,0) scale(1)',clipPath:'inset(0 0px)'}
    ],timing);
    animation.finished.then(()=>{
      if(detailOpen && detailTransitionImage===transitionImage) clearDetailTransition();
    },()=>{});
  };
  detail.querySelector('.detail-close').addEventListener('click',closeProject);
  detail.querySelectorAll('.detail-tab').forEach(tab=>tab.addEventListener('click',()=>{
    detail.querySelectorAll('.detail-tab').forEach(item=>item.classList.toggle('is-active',item===tab));
    const caseView=tab.dataset.view==='case'; detailKicker.textContent=caseView?'Case study':'Gallery'; // Both views share project content until separate case study material is supplied.
  }));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&detailOpen) closeProject()});

  const controllers=new Map();
  document.querySelectorAll('.film-track').forEach(track=>{
    const originals=[...track.children];
    originals.forEach(frame => {
      const copy = frame.querySelector('.frame-copy');
      copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      frame.dataset.title = copy.querySelector('h2').textContent;
      frame.dataset.subtitle = copy.querySelector('p').textContent;
      copy.remove();
    });
    track.addEventListener('pointerover', event=>{
      const frame=event.target.closest('.film-frame');
      if(frame && track.contains(frame)) frame.classList.add('is-hovered');
    });
    track.addEventListener('pointerout', event=>{
      const frame=event.target.closest('.film-frame');
      if(frame && !frame.contains(event.relatedTarget)) frame.classList.remove('is-hovered');
    });
    track.addEventListener('click', event=>{
      const image=event.target.closest('.frame-image');
      const frame=image?.closest('.film-frame');
      if(frame && track.contains(frame)){
        track.querySelectorAll('.film-frame.is-selected').forEach(item=>item.classList.remove('is-selected'));
        frame.classList.add('is-selected');
        openProject(frame);
      }
    });
    let yearPosition = track.scrollTop;
    track.addEventListener('scroll', () => {
      const delta = track.scrollTop-yearPosition;
      yearPosition = track.scrollTop;
      if (delta && Math.abs(delta)<track.clientHeight*2) {
        spinYear(Math.sign(delta));
      }
      syncCopy(track, Math.sign(delta) || 1);
    }, {passive:true});
    let step=0,timer,animation=0,snapping=false;
    let glide=0,gliding=false,destination=0,glidePosition=0,lastTick=0,lastInput=0;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const visible=()=>track.getClientRects().length>0;
    const interrupt=()=>{
      cancelAnimationFrame(animation);
      cancelAnimationFrame(glide);gliding=false;
      snapping=false;
      clearTimeout(timer);
      timer=setTimeout(settle,180);
    };
    const settle=()=>{
      if(!visible()||!step||snapping||gliding) return;
      const center=track.getBoundingClientRect().top+track.clientHeight/2;
      let delta=Infinity;
      for(const frame of track.children){
        const rect=frame.getBoundingClientRect();
        const distance=rect.top+rect.height/2-center;
        if(Math.abs(distance)<Math.abs(delta)) delta=distance;
      }
      if(Math.abs(delta)<1){roll.classList.remove('is-scrolling');return;}
      const start=track.scrollTop;
      const target=start+delta;
      const started=performance.now();
      const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:360;
      snapping=true;
      roll.classList.add('is-scrolling');
      const tick=now=>{
        if(!visible()){snapping=false;return;}
        const progress=duration?Math.min(1,(now-started)/duration):1;
        track.scrollTop=start+delta*(1-Math.pow(1-progress,3));
        if(progress<1) animation=requestAnimationFrame(tick);
        else {
          track.scrollTop=target;
          snapping=false;
          roll.classList.remove('is-scrolling');
        }
      };
      animation=requestAnimationFrame(tick);
    };
    for(const event of ['touchstart','pointerdown','keydown']){
      track.addEventListener(event,interrupt,{passive:true});
    }
    const glideTick=now=>{
      if(!visible()){gliding=false;return;}
      const dt=Math.min(40,now-lastTick||16.7);
      lastTick=now;
      // Keep subpixel motion in memory; scrollTop can round and stall easing.
      const remainder=destination-glidePosition;
      glidePosition+=remainder*(1-Math.exp(-dt/75));
      track.scrollTop=glidePosition;
      if(now-lastInput>90 && (Math.abs(destination-glidePosition)<1 || now-lastInput>300)){
        track.scrollTop=destination;
        gliding=false;
        clearTimeout(timer);timer=setTimeout(settle,100);
      }else glide=requestAnimationFrame(glideTick);
    };
    track.addEventListener('wheel',event=>{
      if(event.ctrlKey||reduced.matches||!step||!visible()) return;
      event.preventDefault();
      cancelAnimationFrame(animation);snapping=false;
      clearTimeout(timer);
      if(!gliding) destination=glidePosition=track.scrollTop;
      const unit=event.deltaMode===1?16:event.deltaMode===2?track.clientHeight:1;
      destination=Math.max(0,Math.min(track.scrollHeight-track.clientHeight,destination+Math.max(-step,Math.min(step,event.deltaY*unit))));
      lastInput=performance.now();
      roll.classList.add('is-scrolling');
      if(!gliding){gliding=true;lastTick=lastInput;glide=requestAnimationFrame(glideTick);}
    },{passive:false});
    const measure=()=>{
      if(!visible()) return;
      step=originals.length>1 ? originals[1].getBoundingClientRect().top-originals[0].getBoundingClientRect().top : originals[0].getBoundingClientRect().height;
      track.scrollTop=Math.max(0,Math.min(track.scrollTop,track.scrollHeight-track.clientHeight));
    };
    const reset=()=>{
      cancelAnimationFrame(animation);snapping=false;
      cancelAnimationFrame(glide);gliding=false;
      measure();track.scrollTop=0;
      syncCopy(track, 1, !!copyKey);
      clearTimeout(timer);
      timer=setTimeout(settle,180);
    };
    track.addEventListener('scroll',()=>{
      if(!visible()||!step||snapping||gliding) return;
      roll.classList.add('is-scrolling');
      clearTimeout(timer);timer=setTimeout(settle,180);
    },{passive:true});
    new ResizeObserver(measure).observe(track);
    controllers.set(track,reset);
    reset();
  });
  buttons.forEach(button=>button.addEventListener('click',()=>{
    buttons.forEach(item=>{item.classList.toggle('is-active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    shell.dataset.roll=button.dataset.roll;
    const target=document.querySelector(`.film-track[data-roll="${button.dataset.roll}"]`);
    target.hidden=false;
    controllers.get(target)();
  }));
})();
