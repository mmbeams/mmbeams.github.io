(() => {
  const mobile=matchMedia('(max-width: 767px)');
  const shell=document.querySelector('.site-shell');
  const loader=document.querySelector('.loader');
  const roll=document.querySelector('.roll');
  const buttons=[...document.querySelectorAll('.rail-button')];
  document.body.appendChild(document.querySelector('.rail'));
  // Scroll-linked letter motion uses stable offsets, so scrolling back reverses it exactly.
  const intro=document.querySelector('.intro-copy');
  const introTrack=intro.closest('.film-track');
  const mobileIntro=intro.cloneNode(true);
  mobileIntro.classList.add('mobile-intro');
  roll.appendChild(mobileIntro);
  const walker=document.createTreeWalker(intro,NodeFilter.SHOW_TEXT);
  const introNodes=[];
  while(walker.nextNode()) introNodes.push(walker.currentNode);
  const introLetters=[];
  introNodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    for(const character of node.textContent){
      if(/\s/.test(character)){fragment.append(character);continue;}
      const letter=document.createElement('span');
      letter.className='intro-letter';
      letter.textContent=character;
      const index=introLetters.length;
      introLetters.push({letter,delay:((index*37+13)%61)/100,distance:16+(index*19)%23});
      fragment.appendChild(letter);
    }
    node.replaceWith(fragment);
  });
  const updateIntro=()=>{
    const travel=Math.max(30,Math.min(80,introTrack.querySelector('.film-spacer').offsetHeight*.4));
    const progress=mobile.matches?0:Math.min(1,Math.max(0,introTrack.scrollTop/travel));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    introLetters.forEach(({letter,delay,distance})=>{
      const local=Math.max(0,Math.min(1,(progress-delay)/(1-delay)));
      const eased=local*local*(3-2*local);
      letter.style.opacity=1-eased;
      letter.style.transform=`translateY(${reduced?0:-distance*eased}px)`;
    });
  };
  introTrack.addEventListener('scroll',updateIntro,{passive:true});
  new ResizeObserver(updateIntro).observe(introTrack);
  updateIntro();

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
  let pointerX=0,pointerY=0,pointerVisible=false,cursorFrame=0;
  const updateCursor=()=>{
    cursorFrame=0;
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
    let label=nearest?'CHECK':'';
    const openDetail=document.querySelector('.project-detail.is-open');
    if(pointerVisible && openDetail){
      const bounds=openDetail.querySelector('.detail-inner').getBoundingClientRect();
      if(pointerX<bounds.left || pointerX>bounds.right) label='BACK';
      if(document.elementFromPoint(pointerX,pointerY)?.closest('.detail-next')) label='NEXT';
    }
    if(pointerVisible){
      let navDistance=8;
      document.querySelectorAll('.rail .theme-toggle,.rail .rail-button').forEach(control=>{
        const rect=control.getBoundingClientRect();
        const distance=Math.hypot(Math.max(rect.left-pointerX,0,pointerX-rect.right),Math.max(rect.top-pointerY,0,pointerY-rect.bottom));
        if(distance<navDistance){
          navDistance=distance;
          label=control.classList.contains('theme-toggle')
            ? (document.documentElement.dataset.theme==='dark'?'white':'black')
            : (control.dataset.roll==='work'?'work':'personal');
        }
      });
    }
    cursor.classList.toggle('is-near',!!label);
    cursorDate.textContent=label;
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
  const digits = [...'2612'].map((value,index) => {
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
  year.setAttribute('aria-label', '2612');
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
    const date = match ? match[2].slice(-2)+match[1] : '';
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
      const empty=nearest.classList.contains('film-spacer');
      fixedCopy.classList.toggle('is-empty',empty);
      fixedCopy.setAttribute('aria-hidden',String(empty));
      if (!empty) { showCopy(nearest, direction, animate); syncDate(nearest, direction, animate); }
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
    const projects=[...document.querySelectorAll('.film-track[data-roll="work"] .film-frame:not([data-detail-disabled])')];
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
  const closeProject=()=>{
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
    if(detailOpen && (event.clientX<bounds.left || event.clientX>bounds.right)) closeProject();
  });
  const openProject=(frame,fromNext=false)=>{
    if(frame.hasAttribute('data-detail-disabled')) return;
    currentProject=frame;
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
    detail.querySelectorAll('.detail-tab').forEach(item=>item.classList.toggle('is-active',item===tab));
    detail.scrollTop=0;
    setPasswordGate(tab.dataset.view==='case');
  }));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&detailOpen) closeProject()});

  const controllers=new Map();
  document.querySelectorAll('.film-track').forEach(track=>{
    const originals=[...track.querySelectorAll('.film-frame')];
    if(!originals.length){ controllers.set(track,()=>{track.scrollTop=0;}); return; }
    originals.forEach(frame => {
      const copy = frame.querySelector('.frame-copy');
      copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      frame.dataset.title = copy.querySelector('h2').textContent;
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
    let yearPosition = track.scrollTop;
    track.addEventListener('scroll', () => {
      const delta = track.scrollTop-yearPosition;
      yearPosition = track.scrollTop;
      if (delta && Math.abs(delta)<track.clientHeight*2) {
        spinYear(Math.sign(delta));
      }
      syncCopy(track, Math.sign(delta) || 1);
    }, {passive:true});
    let step=0,timer,animation=0,snapping=false,touchActive=false;
    let glide=0,gliding=false,destination=0,glidePosition=0,lastTick=0,lastInput=0;
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
      step=originals.length>1 ? originals[1].getBoundingClientRect().top-originals[0].getBoundingClientRect().top : originals[0].getBoundingClientRect().height;
      track.scrollTop=Math.max(0,Math.min(track.scrollTop,track.scrollHeight-track.clientHeight));
    };
    const reset=()=>{
      cancelAnimationFrame(animation);snapping=false;
      cancelAnimationFrame(glide);gliding=false;
      measure();track.scrollTop=0;
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
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if(detailOpen) closeProject();
    collapseNav();
    buttons.forEach(item=>{item.classList.toggle('is-active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    shell.dataset.roll=button.dataset.roll;
    const target=document.querySelector(`.film-track[data-roll="${button.dataset.roll}"]`);
    target.hidden=false;
    controllers.get(target)();
  }));
})();
