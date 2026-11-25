(() => {
  const mobile=matchMedia('(max-width: 767px)');
  const shell=document.querySelector('.site-shell');
  const loader=document.querySelector('.loader');
  const roll=document.querySelector('.roll');
  const buttons=[...document.querySelectorAll('.rail-button')];
  document.body.appendChild(document.querySelector('.rail'));
  const intro=document.querySelector('.intro-copy');
  const mobileIntro=intro.cloneNode(true);
  mobileIntro.classList.add('mobile-intro');
  roll.appendChild(mobileIntro);
  const oldSpacer=intro.closest('.film-spacer');
  roll.appendChild(intro);oldSpacer.remove();
  const welcome=document.createElement('article');
  welcome.className='film-frame welcome-frame';welcome.dataset.detailDisabled='true';
  welcome.innerHTML='<div class="frame-image welcome-content"><p>hi, i&#39;m moira :)</p>'+intro.querySelector('.intro-popover').innerHTML+'<p>i explore the intersection of</p><p>ai/human/philosophy/aesthetic</p></div><div class="frame-copy"><h2></h2><p></p><p class="project-category"></p></div>';
  document.querySelector('.film-track[data-roll="work"]').prepend(welcome);

  const cornerLinks=document.createElement('div');cornerLinks.className='home-corners';
  const music=document.createElement('button');music.type='button';music.className='corner-music';music.setAttribute('aria-label','Open music player');music.setAttribute('aria-expanded','false');
  music.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17V5l11-2v12"/><path d="M9 5l11-2v3L9 8Z" fill="currentColor"/><ellipse cx="6" cy="17" rx="3" ry="2.5" fill="currentColor"/><ellipse cx="17" cy="15" rx="3" ry="2.5" fill="currentColor"/></svg>';
  const musicPanel=document.createElement('div');musicPanel.className='music-panel';musicPanel.setAttribute('aria-hidden','true');musicPanel.inert=true;musicPanel.id='spotify-player';music.setAttribute('aria-controls',musicPanel.id);
  let musicHideTimer;
  const closeMusic=()=>{
    clearTimeout(musicHideTimer);
    musicPanel.inert=true;musicPanel.classList.remove('is-open');musicPanel.setAttribute('aria-hidden','true');music.setAttribute('aria-expanded','false');
  };
  const openMusic=()=>{
    clearTimeout(musicHideTimer);
    if(!musicPanel.firstElementChild){
      const player=document.createElement('iframe');player.src='https://open.spotify.com/embed/playlist/2O2a0EjOAMLzZirBV7KEEo?utm_source=generator';player.title='Moira’s Spotify playlist';player.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';player.loading='lazy';
      musicPanel.appendChild(player);
    }
    musicPanel.inert=false;musicPanel.classList.add('is-open');musicPanel.setAttribute('aria-hidden','false');music.setAttribute('aria-expanded','true');
  };
  [music,musicPanel].forEach(element=>{
    element.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch') openMusic();});
    element.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch') musicHideTimer=setTimeout(closeMusic,120);});
    element.addEventListener('focusout',event=>{if(!music.contains(event.relatedTarget)&&!musicPanel.contains(event.relatedTarget)) closeMusic();});
  });
  music.addEventListener('click',event=>{
    if(event.detail===0||matchMedia('(hover: none)').matches){if(!musicPanel.classList.contains('is-open')) openMusic();else closeMusic();}
  });
  document.addEventListener('pointerdown',event=>{if(!music.contains(event.target)&&!musicPanel.contains(event.target)) closeMusic();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&musicPanel.classList.contains('is-open')){closeMusic();music.focus();}});
  cornerLinks.appendChild(musicPanel);
  const linkedin=document.querySelector('.personal-links a[aria-label="LinkedIn"]').cloneNode(true);linkedin.className='corner-linkedin';
  cornerLinks.append(music,linkedin);roll.appendChild(cornerLinks);

  // Each corner owns its trigger and preview; the clock is not inside the name trigger.
  const bindPreview=(wrapper,trigger,panel)=>{
    const show=open=>{wrapper.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));panel.inert=!open;};
    show(false);
    wrapper.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch') show(true);});
    wrapper.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch') show(false);});
    trigger.addEventListener('focus',()=>show(true));
    wrapper.addEventListener('focusout',event=>{if(!wrapper.contains(event.relatedTarget)) show(false);});
    trigger.addEventListener('click',event=>{if(trigger.tagName==='BUTTON'||matchMedia('(hover: none)').matches&&!wrapper.classList.contains('is-open')){event.preventDefault();show(!wrapper.classList.contains('is-open'));}});
    document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target)) show(false);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape') show(false);});
  };
  const worldClocks=[];
  [intro,mobileIntro].forEach(container=>{
    const time=container.querySelector('.shanghai-clock');
    const wrapper=document.createElement('div');wrapper.className='clock-corner';
    const trigger=document.createElement('button');trigger.type='button';trigger.className='clock-trigger';trigger.setAttribute('aria-label','World clock');
    trigger.appendChild(time);wrapper.appendChild(trigger);container.appendChild(wrapper);
    const panel=document.createElement('div');panel.className='world-clock corner-preview';
    [['Shanghai','Asia/Shanghai'],['New York','America/New_York'],['San Francisco','America/Los_Angeles']].forEach(([city,zone])=>{
      const row=document.createElement('div');row.className='world-clock-row';
      row.innerHTML='<div><small></small><div class="world-city"></div></div><div class="world-time"></div>';
      row.querySelector('.world-city').textContent=city;panel.appendChild(row);worldClocks.push({row,zone});
    });
    wrapper.appendChild(panel);bindPreview(wrapper,trigger,panel);
  });
  const linkedinWrapper=document.createElement('div');linkedinWrapper.className='linkedin-corner';
  linkedin.replaceWith(linkedinWrapper);linkedinWrapper.appendChild(linkedin);
  const socialExtras=document.createElement('div');socialExtras.className='corner-social-extras';
  const gmail=document.querySelector('.personal-links a[aria-label="Email mmbeams.mo@gmail.com"]').cloneNode(true);gmail.className='corner-social-link';
  const instagram=document.createElement('a');instagram.className='corner-social-link';instagram.setAttribute('aria-label','Instagram');instagram.href='https://www.instagram.com/mmfi1ms?jplx=cm82aGQzMWppZjIz';instagram.target='_blank';instagram.rel='noopener noreferrer';
  instagram.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>';
  socialExtras.append(gmail,instagram);linkedinWrapper.appendChild(socialExtras);
  document.querySelector('.personal-links').remove();
  const showSocial=open=>{
    linkedinWrapper.classList.toggle('social-open',open);socialExtras.inert=!open;
    socialExtras.setAttribute('aria-hidden',String(!open));
  };
  showSocial(false);
  linkedinWrapper.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch') showSocial(true);});
  linkedinWrapper.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch') showSocial(false);});
  linkedinWrapper.addEventListener('focusin',()=>showSocial(true));
  linkedinWrapper.addEventListener('focusout',event=>{if(!linkedinWrapper.contains(event.relatedTarget)) showSocial(false);});
  linkedin.addEventListener('click',event=>{if(matchMedia('(hover: none)').matches&&!linkedinWrapper.classList.contains('social-open')){event.preventDefault();showSocial(true);}});
  document.addEventListener('pointerdown',event=>{if(!linkedinWrapper.contains(event.target)) showSocial(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape') showSocial(false);});

  const clockFormat=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const updateClock=()=>{
    const now=new Date();
    const partsFor=zone=>Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
    const local=partsFor('Asia/Shanghai');
    const stamp=p=>Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
    const day=p=>Date.UTC(+p.year,+p.month-1,+p.day);
    worldClocks.forEach(({row,zone})=>{
      const p=partsFor(zone),difference=Math.round((stamp(p)-stamp(local))/3600000),dayDifference=Math.round((day(p)-day(local))/86400000);
      row.querySelector('small').textContent=(dayDifference<0?'Yesterday':dayDifference>0?'Tomorrow':'Today')+(difference?', '+(difference>0?'+':'')+difference+'HRS':'');
      row.querySelector('.world-time').innerHTML=(+p.hour%12||12)+':'+p.minute+'<span>'+ (+p.hour<12?'AM':'PM')+'</span>';
    });
    document.querySelectorAll('.shanghai-clock').forEach(clock=>{
      clock.textContent=clockFormat.format(now).replace(/:/g,' : ')+' CST';
      clock.dateTime=now.toISOString();
    });
  };
  updateClock();setInterval(updateClock,1000);
  [intro,mobileIntro].forEach(container=>{
    const profile=container.querySelector('.intro-profile');
    const handle=profile.querySelector('button');
    const name=document.createElement('a');name.className='intro-handle';name.textContent=handle.textContent;
    const homeURL=new URL(location.href);homeURL.searchParams.delete('project');homeURL.searchParams.delete('page');homeURL.hash='';name.href=homeURL.href;
    handle.replaceWith(name);
    profile.querySelector('.intro-popover').remove();
  });

  const themeToggle=document.querySelector('.theme-toggle');
  const navLogo=themeToggle.querySelector('.rail-logo');
  const rail=document.querySelector('.rail');
  const collapseNav=()=>{
    rail.classList.remove('is-expanded');
    const detailNav=mobile.matches && rail.classList.contains('has-detail');
    themeToggle.setAttribute('aria-label',detailNav?'Toggle navigation':'Dark mode');
    if(detailNav){themeToggle.setAttribute('aria-expanded','false');themeToggle.removeAttribute('aria-pressed');}
    else {themeToggle.removeAttribute('aria-expanded');themeToggle.setAttribute('aria-pressed',String(document.documentElement.dataset.theme==='dark'));}
  };
  const syncNav=()=>{
    collapseNav();
  };
  mobile.addEventListener('change',syncNav);syncNav();
  let logoReturn;
  themeToggle.addEventListener('pointerleave',()=>themeToggle.classList.remove('is-reset'));
  themeToggle.addEventListener('click',()=>{
    if(mobile.matches && rail.classList.contains('has-detail')){
      const expanded=rail.classList.toggle('is-expanded');
      themeToggle.setAttribute('aria-expanded',String(expanded));
      return;
    }
    const start=getComputedStyle(navLogo).transform;
    if(logoReturn) logoReturn.cancel();
    themeToggle.classList.add('is-reset');
    const dark=document.documentElement.dataset.theme!=='dark';
    document.documentElement.dataset.theme=dark?'dark':'light';
    themeToggle.setAttribute('aria-pressed',String(dark));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      logoReturn=navLogo.animate([
        {transform:start,offset:0},
        {transform:'rotate(-8deg)',offset:.58},
        {transform:'rotate(3deg)',offset:.8},
        {transform:'rotate(0deg)',offset:1}
      ],{duration:460,easing:'ease-out'});
    }
  });
  const cursor=document.createElement('div');
  cursor.className='cursor-square';
  cursor.setAttribute('aria-hidden','true');
  const cursorDate=document.createElement('span');
  cursorDate.className='cursor-date';
  cursor.appendChild(cursorDate);
  document.body.appendChild(cursor);
  // Read a small cached image sample; midtones need white rather than gray inversion.
  const contrastSamples=new WeakMap();
  const imageTone=(image,u,v)=>{
    if(!image?.complete||!image.naturalWidth) return null;
    let sample=contrastSamples.get(image);
    if(!sample||sample.src!==image.currentSrc){
      try{
        const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
        const context=canvas.getContext('2d',{willReadFrequently:true});
        context.drawImage(image,0,0,64,64);
        sample={src:image.currentSrc,data:context.getImageData(0,0,64,64).data};contrastSamples.set(image,sample);
      }catch{return null;}
    }
    const offset=(Math.max(0,Math.min(63,Math.floor(v*64)))*64+Math.max(0,Math.min(63,Math.floor(u*64))))*4;
    return (sample.data[offset]*.2126+sample.data[offset+1]*.7152+sample.data[offset+2]*.0722)/255;
  };
  const onMidtone=(x,y)=>{
    if(document.querySelector('.project-detail.is-open')) return false;
    const track=document.querySelector('.film-track[data-roll="work"]');
    if(!track.getClientRects().length) return false;
    const bounds=track.getBoundingClientRect();
    for(const imageBox of track.querySelectorAll('.frame-image:not(.welcome-content)')){
      const rect=imageBox.getBoundingClientRect();
      if(y<rect.top||y>rect.bottom) continue;
      const radius=Math.max(bounds.height*.95,rect.height*1.4);
      const normalized=Math.min(.92,Math.abs(y-bounds.top-bounds.height/2)/radius);
      const width=rect.width*(imageBox.classList.contains('has-sphere')?Math.sqrt(1-normalized*normalized):1);
      const u=(x-(rect.left+rect.width/2-width/2))/width,v=(y-rect.top)/rect.height;
      if(u<0||u>1) continue;
      const images=[...imageBox.querySelectorAll(':scope > img')];
      let tone=0,weight=0;
      for(const image of images){
        const scale=Math.max(rect.width/image.naturalWidth,rect.height/image.naturalHeight);
        const sourceU=(u*rect.width+(image.naturalWidth*scale-rect.width)/2)/(image.naturalWidth*scale);
        const sourceV=(v*rect.height+(image.naturalHeight*scale-rect.height)/2)/(image.naturalHeight*scale);
        const value=imageTone(image,sourceU,sourceV),opacity=parseFloat(getComputedStyle(image).opacity);
        if(value!==null){tone+=value*opacity;weight+=opacity;}
      }
      return weight>0&&tone/weight>.22&&tone/weight<.78;
    }
    return false;
  };
  let pointerX=0,pointerY=0,pointerVisible=false,cursorFrame=0;
  const updateCursor=()=>{
    cursorFrame=0;
    cursor.classList.toggle('on-midtone',pointerVisible&&onMidtone(pointerX,pointerY));
    const navBounds=rail.getBoundingClientRect();
    rail.classList.toggle('on-midtone',onMidtone(navBounds.left+navBounds.width/2,navBounds.top+navBounds.height/2));
    let nearest=null,nearestDistance=32;
    if(pointerVisible && !document.querySelector('.project-detail.is-open')){
      document.querySelectorAll('.film-track[data-roll="work"] .frame-image').forEach(image=>{
        if(!image.getClientRects().length || image.closest('[data-detail-disabled]')) return;
        const rect=image.getBoundingClientRect();
        if(rect.bottom<0 || rect.top>innerHeight) return;
        const dx=Math.max(rect.left-pointerX,0,pointerX-rect.right);
        const dy=Math.max(rect.top-pointerY,0,pointerY-rect.bottom);
        const distance=Math.hypot(dx,dy);
        if(distance<nearestDistance){nearest=image;nearestDistance=distance;}
      });
    }
    let label=nearest?'→':'';
    const openDetail=document.querySelector('.project-detail.is-open');
    if(pointerVisible && openDetail){
      const bounds=openDetail.querySelector('.detail-inner').getBoundingClientRect();
      const contentTop=Math.min(bounds.top,openDetail.querySelector('.detail-header').getBoundingClientRect().top);
      if(pointerX<bounds.left || pointerX>bounds.right || pointerY<contentTop) label='BACK';
      if(document.elementFromPoint(pointerX,pointerY)?.closest('.detail-next')) label='NEXT';
      if(document.elementFromPoint(pointerX,pointerY)?.closest('.detail-tab')) label='→';
    }
    if(pointerVisible){
      let navDistance=8;
      document.querySelectorAll('.rail .theme-toggle,.rail .rail-button').forEach(control=>{
        const rect=control.getBoundingClientRect();
        const distance=Math.hypot(Math.max(rect.left-pointerX,0,pointerX-rect.right),Math.max(rect.top-pointerY,0,pointerY-rect.bottom));
        if(distance<navDistance){
          navDistance=distance;
          label=control.classList.contains('theme-toggle')
            ? (document.documentElement.dataset.theme==='dark'?'WHITE':'BLACK')
            : (control.dataset.roll==='work'?'WORK':'PERSONAL');
        }
      });
    }
    const hovered=pointerVisible?document.elementFromPoint(pointerX,pointerY):null;
    const cornerInteractive=!!hovered?.closest('.intro-handle,.clock-trigger,.corner-music,.corner-linkedin,.corner-social-link[href]');
    if(hovered?.closest('.intro-profile')||cornerInteractive) label='';
    cursor.classList.toggle('is-near',!!label||cornerInteractive);
    cursorDate.textContent=label;
    if(label==='→') cursorDate.innerHTML='<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><path d="M6 6.5H18.5M12.5 .5L18.5 6.5L12.5 12.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
    cursorDate.classList.toggle('is-arrow',label==='→');
  };
  const scheduleCursor=()=>{if(!cursorFrame) cursorFrame=requestAnimationFrame(updateCursor);};
  window.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    pointerX=e.clientX;pointerY=e.clientY;pointerVisible=true;
    cursor.style.left=pointerX+'px';cursor.style.top=pointerY+'px';
    cursor.classList.add('is-visible');
    scheduleCursor();
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{
    pointerVisible=false;cursor.classList.remove('is-visible');scheduleCursor();
  });
  document.addEventListener('scroll',scheduleCursor,{capture:true,passive:true});
  window.addEventListener('resize',scheduleCursor,{passive:true});
  document.addEventListener('click',scheduleCursor);
  document.addEventListener('keydown',scheduleCursor);
  document.addEventListener('load',scheduleCursor,true);
  scheduleCursor();
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

  // Keep the project end date visible while its digits reel during scrolling.
  const year = document.querySelector('.date-marker span');
  year.textContent = '';
  const digits = [...'1226'].map((value,index) => {
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
  year.setAttribute('aria-label', '12 / 26');
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
    const progress = yearFinish ? Math.min(1,(now-yearFinish)/(380+(digits.length-1)*70)) : 0;
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
  let displayedDate = '';
  const syncDate = (frame, direction, animate) => {
    const match = (frame.dataset.date || '').match(/(\d{2})\/(\d{4})$/);
    const date = frame.dataset.displayDate || (match ? match[1]+match[2].slice(-2) : '');
    year.style.visibility = date ? 'visible' : 'hidden';
    if (!date || date === displayedDate) return;
    displayedDate = date;
    year.setAttribute('aria-label', date);
    digits.forEach((digit,index) => { digit.value = Number(date[index]); });
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spinYear(direction);
    } else {
      cancelAnimationFrame(yearRaf); yearRaf = 0; yearFinish = 0;
      digits.forEach(digit => { digit.position = digit.value; });
      renderYear();
    }
  };

  const fixedCopy = document.querySelector('.frame-copy').cloneNode(true);
  fixedCopy.classList.add('fixed-copy');
  fixedCopy.setAttribute('aria-live', 'polite');
  roll.appendChild(fixedCopy);
  let copyKey = '', copyRevision = 0;
  const copyAnimations = [];
  const showCopy = (frame, direction = 1, animate = true) => {
    const key = [frame.dataset.title, frame.dataset.subtitle, frame.dataset.category].join('\n');
    if (key === copyKey) return;
    const previous = [...fixedCopy.children].map(label => label.dataset.text || label.textContent || '');
    fixedCopy.classList.toggle('is-work',frame.closest('.film-track').dataset.roll==='work');
    copyKey = key;
    const revision = ++copyRevision;
    copyAnimations.splice(0).forEach(animation => animation.cancel());
    [...fixedCopy.children].forEach((label, line) => {
      const text = [frame.dataset.title, frame.dataset.subtitle, frame.dataset.category][line];
      label.textContent = text;
      label.classList.remove('is-reeling');
      label.dataset.text = text;
      if (!label.getClientRects().length || !animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      if(!frame.getClientRects().length) continue;
      const rect = frame.getBoundingClientRect();
      const delta = Math.abs((rect.top+rect.bottom)/2-center);
      if (delta < distance) { nearest = frame; distance = delta; }
    }
    if (nearest) {
      const empty=nearest.classList.contains('film-spacer')||nearest.classList.contains('welcome-frame');
      year.parentElement.style.visibility=nearest.classList.contains('film-spacer')?'hidden':'';
      fixedCopy.classList.toggle('is-empty',empty);
      fixedCopy.setAttribute('aria-hidden',String(empty));
      if (!empty) showCopy(nearest, direction, animate);
      syncDate(nearest, direction, animate);
    }
  };

  const detail = document.createElement('section');
  detail.className = 'project-detail';
  detail.hidden = true;
  detail.setAttribute('aria-hidden','true');
  detail.innerHTML = `<div class="detail-inner"><div class="detail-header"><div class="detail-switcher"><button class="detail-tab is-active" data-view="gallery">Gallery</button><button class="detail-tab" data-view="case">Case study</button></div><h1 class="detail-title"></h1></div><div class="detail-hero"><div class="detail-placeholder"></div></div><div class="detail-content"><div class="detail-meta detail-meta-left"><p class="detail-date"></p><p class="detail-role"></p></div><div class="detail-meta detail-meta-right"><p class="detail-category"></p><p class="detail-team"></p></div><p class="detail-description">Project details and selected work will be added here.</p></div></div>`;
  document.body.appendChild(detail);
  const detailTitle=detail.querySelector('.detail-title');
  const detailPlaceholder=detail.querySelector('.detail-placeholder');
  const detailDate=detail.querySelector('.detail-date');
  const detailRole=detail.querySelector('.detail-role');
  const detailTeam=detail.querySelector('.detail-team');
  const detailDescription=detail.querySelector('.detail-description');
  const gallerySizes={"images/projects/mmdesign/gallery/1.png":[3360,2200],"images/projects/mmdesign/gallery/2.png":[3360,2200],"images/projects/mmdesign/gallery/3.png":[1683,1102],"images/projects/mmdesign/gallery/4.png":[1122,735],"images/projects/mmdesign/gallery/5.png":[1134,1134],"images/projects/mmdesign/gallery/6.png":[1134,1134],"images/projects/mmdesign/gallery/7.png":[1134,1134],"images/projects/mmdesign/gallery/8.png":[1134,1134],"images/projects/mmdesign/gallery/9.png":[2276,930],"images/projects/mmdesign/gallery/10.png":[2292,930],"images/projects/mmdesign/gallery/11.png":[2276,1204],"images/projects/mmdesign/gallery/12.png":[1134,742],"images/projects/mmdesign/gallery/13.png":[1134,742],"images/projects/wavely/gallery/1-cb83deb5898a.png":[2292,1080],"images/projects/wavely/gallery/2-e08b04d0edf4.png":[2292,1058],"images/projects/wavely/gallery/3-863ceea04a3e.png":[2292,1058],"images/projects/wavely/gallery/4-cffdaad114d5.png":[2292,1058],"images/projects/wavely/gallery/5-fafb5d637c64.png":[2292,2134],"images/projects/wavely/gallery/6-325625068636.png":[2292,1058],"images/projects/wavely/gallery/7-07c68c5369f1.png":[2292,1058],"images/projects/wavely/gallery/8-8840dcf3baaa.png":[2292,1058],"images/projects/wavely/gallery/9-6000761a59fb.png":[2292,1058],"images/projects/wavely/gallery/10-99b78f7c242d.png":[2292,1058],"images/projects/wavely/gallery/11-786690442e85.png":[2292,1058],"images/projects/wavely/gallery/12-2fb4758dbc36.png":[2292,1058],"mmstudio/cover.png":[1080,1080],"images/mmstudio1.png":[1080,1080],"images/mmstudio2.png":[1080,1080],"images/mmstudio3.png":[1080,1080],"googleIO/cover.png":[3840,2160],"googleIO/1.png":[3840,2160],"googleIO/ooh1.png":[3840,2160],"googleIO/ooh2.png":[3840,2160],"googleIO/ooh3.png":[3840,2160],"googleIO/ooh5.png":[3840,2160],"googleIO/ooh4.png":[3840,2160],"googleIO/game1.png":[3840,2160],"googleIO/game2.png":[3840,2160],"googleIO/game3.png":[3840,2160],"googleIO/game4.png":[3840,2160],"images/google1.png":[2400,2400],"images/google2.png":[2160,2160],"images/google3.png":[2160,2160],"huawei/1.png":[3840,2160],"huawei/problem.png":[4000,3403],"huawei/solution1.png":[2880,1920],"huawei/solution2.png":[2880,1920],"huawei/solution3.png":[2880,1920],"huawei/motion1.gif":[2090,1520],"huawei/motion2.gif":[2090,1520],"huawei/motion3.gif":[2090,1520],"huawei/motion4.gif":[2090,1520],"huawei/element.png":[2844,320],"huawei/element2.png":[1372,256],"huawei/element3.png":[1372,256],"huawei/element4.png":[1372,880],"huawei/element5.png":[1372,880],"huawei/element6.png":[2844,964],"huawei/bg.png":[3080,1468],"images/huawei1.gif":[2090,1520],"images/huawei3.gif":[2090,1520],"letters/1.jpeg":[4160,5546],"letters/cover.jpeg":[4014,5352],"letters/2.jpeg":[4160,5546],"letters/3.jpeg":[4148,5531],"letters/live1.jpeg":[3024,4032],"letters/live2.jpeg":[3024,4032],"letters/live3.jpeg":[3024,4032],"letters/setup.png":[1534,1026],"letters/cover_bg.png":[6160,3566],"images/letters1.jpeg":[4014,5352],"images/letters2.jpeg":[4160,5546],"images/letters3.jpeg":[4148,5531]};
  const detailGallery=document.createElement('div');
  detailGallery.className='detail-gallery';
  detail.querySelector('.detail-inner').appendChild(detailGallery);
  let currentProject=null;
  const nextFooter=document.createElement('footer');
  nextFooter.className='detail-next';
  nextFooter.innerHTML='<span class="next-line" aria-hidden="true"></span><button type="button">NEXT</button>';
  detail.appendChild(nextFooter);
  nextFooter.querySelector('button').addEventListener('click',event=>{
    event.stopPropagation();
    const projects=[...document.querySelectorAll('.film-track[data-roll="work"] .film-frame:not([data-detail-disabled])')].sort((a,b)=>Number(a.dataset.rollOrder)-Number(b.dataset.rollOrder));
    const next=projects[(projects.indexOf(currentProject)+1)%projects.length];
    if(next) openProject(next,true);
  });
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  },{root:detail,threshold:0,rootMargin:'0px 0px -24px 0px'});
  const prepareReveals=()=>{
    revealObserver.disconnect();
    [detailDescription,...detailGallery.children,nextFooter].forEach(element=>{
      element.classList.add('detail-reveal');
      element.classList.remove('is-revealed');
      revealObserver.observe(element);
    });
  };
  const passwordGate=document.createElement('form');
  passwordGate.className='case-password';
  passwordGate.hidden=true;
  passwordGate.innerHTML=`<div class="password-panel"><div id="password-label">Password</div><div class="password-entry" role="group" aria-labelledby="password-label">${Array.from({length:4},(_,i)=>`<input type="password" inputmode="numeric" pattern="[0-9]" maxlength="1" autocomplete="off" required aria-label="Password digit ${i+1}" aria-describedby="password-error">`).join('')}</div><button type="submit">Enter</button><p id="password-error" role="status"></p></div>`;
  detail.querySelector('.detail-inner').appendChild(passwordGate);
  const passwordInputs=[...passwordGate.querySelectorAll('input')];
  const passwordError=passwordGate.querySelector('[role="status"]');
  const setPasswordGate=locked=>{
    detail.classList.toggle('is-locked',locked);
    passwordGate.hidden=!locked;
    passwordError.textContent='';
    passwordInputs.forEach(input=>{input.removeAttribute('aria-invalid');input.value='';});
    if(locked) passwordInputs[0].focus({preventScroll:true});
  };
  passwordInputs.forEach((input,index)=>{
    input.addEventListener('input',()=>{
      input.value=input.value.replace(/[^0-9]/g,'').slice(-1);
      passwordError.textContent='';
      passwordInputs.forEach(field=>field.removeAttribute('aria-invalid'));
      if(input.value && index<3){passwordInputs[index+1].focus();passwordInputs[index+1].select();}
    });
    input.addEventListener('keydown',event=>{
      if(event.key==='Backspace' && !input.value && index>0){passwordInputs[index-1].focus();passwordInputs[index-1].select();}
      if(event.key==='ArrowLeft' && index>0){event.preventDefault();passwordInputs[index-1].focus();passwordInputs[index-1].select();}
      if(event.key==='ArrowRight' && index<3){event.preventDefault();passwordInputs[index+1].focus();passwordInputs[index+1].select();}
    });
    input.addEventListener('paste',event=>{
      event.preventDefault();
      const digits=event.clipboardData.getData('text').replace(/[^0-9]/g,'').slice(0,4-index);
      [...digits].forEach((digit,offset)=>{passwordInputs[index+offset].value=digit;});
      passwordInputs[Math.min(3,index+digits.length)].focus();
    });
  });
  passwordGate.addEventListener('submit',event=>{
    event.preventDefault();
    if(passwordInputs.map(input=>input.value).join('')==='1118') setPasswordGate(false);
    else {
      passwordError.textContent='Incorrect password';
      passwordInputs.forEach(input=>{input.setAttribute('aria-invalid','true');input.value='';});
      passwordInputs[0].focus();
    }
  });
  document.querySelectorAll('[data-cover]').forEach(frame=>{ const cover=new Image(); cover.src=frame.dataset.cover; });
  let detailOpen=false, detailTransitionImage=null, detailTransitionTimer=0;
  const clearDetailTransition=()=>{
    clearTimeout(detailTransitionTimer);
    if(detailTransitionImage){ detailTransitionImage.remove(); detailTransitionImage=null; }
    detail.classList.remove('is-opening');
  };
  const setProjectURL=slug=>{
    const url=new URL(location.href);
    url.searchParams.delete('page');
    if(slug) url.searchParams.set('project',slug);else url.searchParams.delete('project');
    if(url.href!==location.href) history.pushState(null,'',url);
  };
  const closeProject=(updateURL=true)=>{
    if(updateURL) setProjectURL(null);
    document.title='Moira Huang — Film roll';
    clearDetailTransition();
    detail.querySelectorAll('video').forEach(video=>video.pause());
    rail.classList.remove('has-detail');
    collapseNav();
    detail.classList.remove('is-open'); detail.setAttribute('aria-hidden','true'); detailOpen=false;
    detailTransitionTimer=setTimeout(()=>{detail.hidden=true},420);
  };
  detail.addEventListener('click',event=>{
    if(event.target.closest('.detail-next')) return;
    const bounds=detail.querySelector('.detail-inner').getBoundingClientRect();
    const contentTop=Math.min(bounds.top,detail.querySelector('.detail-header').getBoundingClientRect().top);
    if(detailOpen && (event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<contentTop)) closeProject();
  });
  const openProject=(frame,fromNext=false,updateURL=true)=>{
    if(frame.hasAttribute('data-detail-disabled')) return;
    currentProject=frame;
    if(updateURL) setProjectURL(frame.dataset.projectSlug);
    document.title=frame.dataset.title+' — Moira Huang';
    const image=frame.querySelector('.image-hover')||frame.querySelector('.image-unhover');
    const from=image.getBoundingClientRect();
    clearDetailTransition();
    setPasswordGate(false);
    detail.hidden=false; detailOpen=true; detail.scrollTop=0;
    rail.classList.add('has-detail');collapseNav();
    detailTitle.textContent=frame.dataset.title.replace(/\n/g,' ');
    detail.querySelector('.detail-switcher').hidden=frame.dataset.caseStudy!=='true';
    detailPlaceholder.style.backgroundImage=`url("${frame.dataset.cover || image.getAttribute('src')}")`;
    detailGallery.replaceChildren();
    const thirdImages=new Set((frame.dataset.galleryThirds || "").split(",").map(Number));
    detailGallery.classList.toggle("has-thirds",thirdImages.size>1);
    const pairedImages=new Set((frame.dataset.galleryPairs || "").split(",").map(Number));
    (frame.dataset.gallery || '').split(',').filter(Boolean).forEach((src,index)=>{
      const isVideo=/\.(mp4|webm|mov)(?:\?|$)/i.test(src);
      const picture=document.createElement(isVideo?'video':'img'); picture.src=src;
      const label=`${detailTitle.textContent} — ${index+1}`;
      if(isVideo){
        const cleanVideo=frame.dataset.cleanVideo==='true';
        picture.controls=!cleanVideo;picture.playsInline=true;picture.preload='metadata';picture.setAttribute('aria-label',label);
      }
      else {picture.alt=label;picture.loading='lazy';}
      if(gallerySizes[src]) [picture.width,picture.height]=gallerySizes[src];
      if(pairedImages.has(index+1)) picture.classList.add("gallery-half");
      if(thirdImages.has(index+1)) picture.classList.add("gallery-third");
      if(isVideo && frame.dataset.cleanVideo==='true'){
        const player=document.createElement('div');player.className='clean-player';
        const controls=document.createElement('div');controls.className='clean-controls';
        const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Play';toggle.setAttribute('aria-label','Play video');
        const seek=document.createElement('input');seek.type='range';seek.min='0';seek.max='100';seek.step='.1';seek.value='0';seek.disabled=true;seek.setAttribute('aria-label','Video progress');
        toggle.addEventListener('click',()=>{if(picture.paused) picture.play().catch(()=>{});else picture.pause();});
        const sync=()=>{toggle.textContent=picture.paused?'Play':'Pause';toggle.setAttribute('aria-label',picture.paused?'Play video':'Pause video');};
        picture.addEventListener('play',sync);picture.addEventListener('pause',sync);picture.addEventListener('ended',sync);
        picture.addEventListener('loadedmetadata',()=>{seek.disabled=!Number.isFinite(picture.duration);});
        picture.addEventListener('timeupdate',()=>{if(picture.duration) seek.value=String(picture.currentTime/picture.duration*100);});
        seek.addEventListener('input',()=>{if(Number.isFinite(picture.duration)) picture.currentTime=Number(seek.value)/100*picture.duration;});
        controls.append(toggle,seek);player.append(picture,controls);detailGallery.appendChild(player);
      }else detailGallery.appendChild(picture);
    });
    detail.querySelectorAll('.detail-tab').forEach(tab=>tab.classList.toggle('is-active',tab.dataset.view==='gallery'));
    detailDescription.textContent=frame.dataset.subtitle ? `"${frame.dataset.subtitle}"` : '';
    detailDate.textContent=frame.dataset.date || '';
    detailRole.textContent=frame.dataset.role || '';
    detail.querySelector('.detail-category').textContent=frame.dataset.category || '';
    detailTeam.textContent=frame.dataset.team || '';
    prepareReveals();
    detail.classList.add('is-open','is-opening'); detail.setAttribute('aria-hidden','false');
    if(fromNext){detail.classList.remove('is-opening');return;}

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
  detail.querySelectorAll('.detail-tab').forEach(tab=>tab.addEventListener('click',()=>{
    if(tab.dataset.view==='case'&&currentProject?.dataset.caseStudyUrl){
      window.open(currentProject.dataset.caseStudyUrl,'_blank','noopener,noreferrer');
      return;
    }
    detail.querySelectorAll('.detail-tab').forEach(item=>item.classList.toggle('is-active',item===tab));
    detail.scrollTop=0;
    setPasswordGate(tab.dataset.view==='case');
  }));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&detailOpen) closeProject()});

  const personalImage=document.querySelector('.personal-image');
  const personalStage=document.createElement('div');personalStage.className='personal-stage';
  personalImage.replaceWith(personalStage);
  const personalWindow=document.createElement('div');personalWindow.className='personal-window';
  personalWindow.tabIndex=0;personalWindow.setAttribute('role','region');personalWindow.setAttribute('aria-label','Personal photos — scroll to browse');
  const photos=['images/personal/1.png','images/personal/2.jpg','images/personal/3.jpg'];
  for(let cycle=0;cycle<3;cycle++) photos.forEach((src,index)=>{
    const photo=document.createElement('img');photo.src=src;photo.alt=`Personal photo ${index+1}`;photo.draggable=false;
    if(cycle!==1) photo.setAttribute('aria-hidden','true');
    personalWindow.appendChild(photo);
  });
  personalImage.src='images/personal/frame.png';personalImage.alt='Personal photo frame';
  personalStage.append(personalWindow,personalImage);
  let personalStep=0;
  const measurePersonal=()=>{
    const frame=personalStage.getBoundingClientRect();
    if(!frame.width||!frame.height) return;
    const oldStep=personalStep;
    const photoHeight=frame.height*1072/1106;
    const openingTop=frame.top+frame.height*16/1106;
    personalWindow.style.left=(frame.left+frame.width*374/1106)+'px';
    personalWindow.style.width=(frame.width*714/1106)+'px';
    personalWindow.style.setProperty('--personal-photo-height',photoHeight+'px');
    personalWindow.style.paddingTop=openingTop+'px';
    personalWindow.style.paddingBottom=Math.max(0,innerHeight-openingTop-photoHeight)+'px';
    personalStep=photoHeight+8;
    personalWindow.scrollTop=oldStep?personalWindow.scrollTop/oldStep*personalStep:3*personalStep;
  };
  const resetPersonal=()=>{measurePersonal();personalWindow.scrollTop=3*personalStep;};
  let personalTimer=0,personalAnimation=0,personalSnapping=false,personalTouch=false;
  const settlePersonal=()=>{
    if(!personalStep||personalTouch) return;
    const start=personalWindow.scrollTop,target=Math.round(start/personalStep)*personalStep;
    const started=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:200;
    personalSnapping=true;
    const tick=now=>{
      const progress=duration?Math.min(1,(now-started)/duration):1;
      personalWindow.scrollTop=start+(target-start)*(1-Math.pow(1-progress,3));
      if(progress<1) personalAnimation=requestAnimationFrame(tick);
      else personalSnapping=false;
    };
    personalAnimation=requestAnimationFrame(tick);
  };
  personalWindow.addEventListener('scroll',()=>{
    if(!personalStep||personalSnapping) return;
    const cycle=3*personalStep;
    if(personalWindow.scrollTop<cycle-personalStep/2) personalWindow.scrollTop+=cycle;
    else if(personalWindow.scrollTop>=2*cycle-personalStep/2) personalWindow.scrollTop-=cycle;
    clearTimeout(personalTimer);personalTimer=setTimeout(settlePersonal,120);
  },{passive:true});
  personalWindow.addEventListener('touchstart',()=>{personalTouch=true;cancelAnimationFrame(personalAnimation);personalSnapping=false;clearTimeout(personalTimer);},{passive:true});
  for(const event of ['touchend','touchcancel']) personalWindow.addEventListener(event,()=>{personalTouch=false;clearTimeout(personalTimer);personalTimer=setTimeout(settlePersonal,90);},{passive:true});
  // Route page-wide wheel input to the personal film strip exactly once.
  document.addEventListener('wheel',event=>{
    if(shell.dataset.roll!=='about'||detailOpen||event.ctrlKey||event.target.closest('.music-panel,.world-clock')) return;
    event.preventDefault();
    cancelAnimationFrame(personalAnimation);personalSnapping=false;
    clearTimeout(personalTimer);
    personalWindow.scrollBy({top:event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?personalWindow.clientHeight:1),behavior:'instant'});
  },{passive:false});
  new ResizeObserver(measurePersonal).observe(personalStage);
  window.addEventListener('resize',measurePersonal);
  const controllers=new Map();
  document.querySelectorAll('.film-track').forEach(track=>{
    const originals=[...track.querySelectorAll('.film-frame')];
    if(!originals.length){ controllers.set(track,()=>{track.scrollTop=0;resetPersonal();}); return; }
    originals.forEach((frame,index) => {
      frame.dataset.rollOrder=index;
      const copy = frame.querySelector('.frame-copy');
      copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      frame.dataset.title = copy.querySelector('h2').textContent;
      frame.dataset.projectSlug=frame.dataset.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      frame.dataset.subtitle = copy.querySelector('p').textContent;
      frame.dataset.category = copy.querySelector('.project-category').textContent;
      copy.classList.add('mobile-copy');
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
      if(frame && track.contains(frame) && !frame.hasAttribute('data-detail-disabled')){
        track.querySelectorAll('.film-frame.is-selected').forEach(item=>item.classList.remove('is-selected'));
        frame.classList.add('is-selected');
        openProject(frame);
      }
    });
    // Every horizontal slice uses the same viewport-centered sphere.
    const sphereLayers=originals.map(frame=>{
      const image=frame.querySelector('.frame-image');
      const layer=document.createElement('div');layer.className='sphere-surface';layer.setAttribute('aria-hidden','true');
      const slices=Array.from({length:40},(_,index)=>{
        const slice=document.createElement('div');slice.className='sphere-slice';
        for(const source of image.querySelectorAll('img')){
          const copy=source.cloneNode();copy.alt='';
          slice.appendChild(copy);
        }
        if(frame.classList.contains('welcome-frame')){
          const text=document.createElement('div');text.className='sphere-text';
          for(const paragraph of image.querySelectorAll(':scope > p')) text.appendChild(paragraph.cloneNode(true));
          slice.appendChild(text);
        }
        layer.appendChild(slice);return slice;
      });
      image.appendChild(layer);return {frame,image,slices};
    });
    let sphereRaf=0;
    const renderSphere=()=>{
      sphereRaf=0;
      const bounds=track.getBoundingClientRect();
      const center=bounds.top+bounds.height/2;
      const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
      sphereLayers.forEach(({frame,image,slices})=>{
        const rect=frame.getBoundingClientRect();
        if(rect.bottom<bounds.top-rect.height||rect.top>bounds.bottom+rect.height) return;
        const radius=Math.max(bounds.height*.95,rect.height*1.4);
        image.classList.toggle('has-sphere',!reducedMotion);
        slices.forEach((slice,index)=>{
          // Overlap rasterized edges without rescaling each slice's source image.
          const pixel=1/(window.devicePixelRatio || 1);
          const top=Math.max(0,Math.floor(rect.height*index/40/pixel)*pixel-pixel);
          const bottom=Math.min(rect.height,Math.ceil(rect.height*(index+1)/40/pixel)*pixel+pixel);
          slice.style.top=`${top}px`;
          slice.style.height=`${bottom-top}px`;
          for(const copy of slice.children){copy.style.height=`${rect.height}px`;copy.style.top=`${-top}px`;}
          const y=rect.top+rect.height*(index+.5)/40-center;
          const normalized=Math.min(.92,Math.abs(y)/radius);
          const width=Math.sqrt(1-normalized*normalized);
          slice.style.transform=`scaleX(${reducedMotion?1:width})`;
        });
      });
    };
    const scheduleSphere=()=>{if(!sphereRaf) sphereRaf=requestAnimationFrame(renderSphere);};
    track.addEventListener('scroll',scheduleSphere,{passive:true});
    new ResizeObserver(scheduleSphere).observe(track);
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',scheduleSphere);
    let yearPosition = track.scrollTop;
    track.addEventListener('scroll', () => {
      normalizeLoop();
      const delta = track.scrollTop-yearPosition;
      yearPosition = track.scrollTop;
      if (delta && Math.abs(delta)<track.clientHeight*2) {
        spinYear(Math.sign(delta));
      }
      syncCopy(track, Math.sign(delta) || 1);
    }, {passive:true});
    let step=0,timer,animation=0,snapping=false,touchActive=false;
    let glide=0,gliding=false,destination=0,glidePosition=0,lastTick=0,lastInput=0;
    // Recycle the actual cards, retaining media and project identity without duplicate galleries.
    const normalizeLoop=()=>{
      if(!step||snapping||!visible()) return;
      let shift=0;
      const lower=step*2,upper=step*(originals.length-3);
      while(track.scrollTop+shift<lower){track.prepend(track.lastElementChild);shift+=step;}
      while(track.scrollTop+shift>upper){track.appendChild(track.firstElementChild);shift-=step;}
      if(shift){track.scrollTop+=shift;yearPosition+=shift;glidePosition+=shift;destination+=shift;}
    };
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const visible=()=>track.getClientRects().length>0;
    const interrupt=()=>{
      cancelAnimationFrame(animation);
      cancelAnimationFrame(glide);gliding=false;
      snapping=false;
      clearTimeout(timer);
      timer=setTimeout(settle,mobile.matches?90:180);
    };
    const settle=()=>{
      if(touchActive||!visible()||!step||snapping||gliding) return;
      if(track.scrollTop<=1){roll.classList.remove('is-scrolling');return;}
      const center=track.getBoundingClientRect().top+track.clientHeight/2;
      let delta=Infinity;
      for(const frame of track.children){
        if(!frame.getClientRects().length) continue;
        const rect=frame.getBoundingClientRect();
        const distance=rect.top+rect.height/2-center;
        if(Math.abs(distance)<Math.abs(delta)) delta=distance;
      }
      if(Math.abs(delta)<1){roll.classList.remove('is-scrolling');return;}
      const start=track.scrollTop;
      const target=start+delta;
      const started=performance.now();
      const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:(mobile.matches?200:360);
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
          normalizeLoop();
          roll.classList.remove('is-scrolling');
        }
      };
      animation=requestAnimationFrame(tick);
    };
    for(const event of ['touchstart','pointerdown','keydown']){
      track.addEventListener(event,interrupt,{passive:true});
    }
    track.addEventListener('touchstart',()=>{touchActive=true;},{passive:true});
    for(const event of ['touchend','touchcancel']) track.addEventListener(event,()=>{touchActive=false;clearTimeout(timer);timer=setTimeout(settle,mobile.matches?90:180);},{passive:true});
    const glideTick=now=>{
      if(!visible()){gliding=false;return;}
      const dt=Math.min(40,now-lastTick||16.7);
      lastTick=now;
      // Keep subpixel motion in memory; scrollTop can round and stall easing.
      const remainder=destination-glidePosition;
      glidePosition+=remainder*(1-Math.exp(-dt/75));
      track.scrollTop=glidePosition;
      normalizeLoop();
      if(now-lastInput>90 && (Math.abs(destination-glidePosition)<1 || now-lastInput>300)){
        track.scrollTop=destination;
        gliding=false;
        clearTimeout(timer);timer=setTimeout(settle,mobile.matches?50:100);
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
      const previousStep=step;
      const first=track.firstElementChild;
      step=first.getBoundingClientRect().height+parseFloat(getComputedStyle(first).marginBottom);
      if(previousStep) track.scrollTop=track.scrollTop/previousStep*step;

    };
    const reset=()=>{
      cancelAnimationFrame(animation);snapping=false;
      cancelAnimationFrame(glide);gliding=false;
      track.append(...originals);
      const lead=Math.floor(originals.length/2);
      for(let i=0;i<lead;i++) track.prepend(track.lastElementChild);
      measure();track.scrollTop=lead*step;yearPosition=track.scrollTop;
      scheduleSphere();
      syncCopy(track, 1, !!copyKey);
      clearTimeout(timer);
      roll.classList.remove('is-scrolling');
    };
    track.addEventListener('scroll',()=>{
      if(!visible()||!step||snapping||gliding) return;
      roll.classList.add('is-scrolling');
      clearTimeout(timer);timer=setTimeout(settle,mobile.matches?90:180);
    },{passive:true});
    new ResizeObserver(measure).observe(track);
    controllers.set(track,reset);
    reset();
  });
  const selectCollection=(collection,updateURL=true)=>{
    if(detailOpen) closeProject(false);
    collapseNav();
    buttons.forEach(item=>{const active=item.dataset.roll===collection;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
    shell.dataset.roll=collection;
    const target=document.querySelector(`.film-track[data-roll="${collection}"]`);
    target.hidden=false;controllers.get(target)();
    document.title=collection==='about'?'Personal — Moira Huang':'Moira Huang — Film roll';
    if(updateURL){
      const url=new URL(location.href);url.searchParams.delete('project');
      if(collection==='about') url.searchParams.set('page','personal');else url.searchParams.delete('page');
      if(url.href!==location.href) history.pushState(null,'',url);
    }
  };
  buttons.forEach(button=>button.addEventListener('click',()=>selectCollection(button.dataset.roll)));
  const goHome=()=>selectCollection('work');
  document.querySelectorAll('a.intro-handle').forEach(link=>link.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
    event.preventDefault();goHome();
  }));
  const restoreRoute=()=>{
    const slug=new URL(location.href).searchParams.get('project');
    const frame=[...document.querySelectorAll('.film-frame:not([data-detail-disabled])')].find(frame=>frame.dataset.projectSlug===slug);
    if(frame){
      shell.dataset.roll='work';
      buttons.forEach(button=>{const active=button.dataset.roll==='work';button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
      openProject(frame,true,false);
    }else selectCollection(new URL(location.href).searchParams.get('page')==='personal'?'about':'work',false);
  };
  window.addEventListener('popstate',restoreRoute);
  restoreRoute();
})();
