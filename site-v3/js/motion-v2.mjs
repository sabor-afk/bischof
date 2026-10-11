/** Bischof Experience — one reversible motion scheduler, no external libraries. */
export function clamp01(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
}
export function sectionProgress(top,height,viewport){
  const v=Math.max(1,Number(viewport)||1);
  const h=Math.max(0,Number(height)||0);
  return clamp01((v-(Number(top)||0))/(v+h));
}
export function easeInOut(value){
  const p=clamp01(value);
  return p*p*(3-2*p);
}
export function calculateScrollProgress(scrollY,scrollHeight,viewport){
  const size=(Number(scrollHeight)||0)-(Number(viewport)||0);
  return size<=0?0:clamp01((Number(scrollY)||0)/size);
}
const round=(n)=>String(Math.round(n*1000)/1000);

/** Reads every section before writing any style, and uses only passive wheel/scroll. */
export function setupGlobalMotion(doc,win){
  const reduced=win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  // Mesmo no modo de movimento reduzido, o indicador do menu e cabecalho continuam atualizados.
  const sections=[...(doc.querySelectorAll?.('[data-journey]')??[])];
  if(!sections.length)return ()=>{};
  const progress=doc.querySelector?.('[data-scroll-progress]');
  const header=doc.querySelector?.('[data-header]');
  const navLinks=[...(doc.querySelectorAll?.('.desktop-nav a[href^="#"]')??[])];
  let queued=false, active=true, frame=0;
  const raf=win.requestAnimationFrame?.bind(win)??(cb=>cb());
  const cancel=win.cancelAnimationFrame?.bind(win);

  function paint(){
    queued=false;
    if(!active || doc.visibilityState==='hidden')return;
    const viewport=Math.max(1,Number(win.innerHeight)||1);
    const width=Math.max(1,Number(win.innerWidth)||1);
    const fullMotion=!reduced && width>=1024 && viewport>=540;
    const gentleMotion=!reduced && width>=768 && viewport>=540;
    const scrollY=Math.max(0,Number(win.scrollY)||0);
    const pageHeight=doc.documentElement?.scrollHeight??viewport;
    // All DOM reads first. No per-card measurements and no forced layout in the write loop.
    const geometries=sections.map(s=>({section:s,rect:s.getBoundingClientRect()}));
    const values=geometries.map(({section,rect})=>{
      const p=sectionProgress(rect.top,rect.height,viewport);
      const eased=easeInOut(p);
      const distance=(.5-eased);
      const id=section.id||'';
      const visible=rect.bottom>0 && rect.top<viewport;
      return {section,id,p,eased,distance,visible};
    });
    if(progress)progress.style.setProperty('--scroll-progress',round(calculateScrollProgress(scrollY,pageHeight,viewport)));
    header?.classList?.toggle?.('is-scrolled',scrollY>24);
    if(navLinks.length){
      const current=[...geometries].reverse().find(({rect})=>rect.top<=viewport*.48 && rect.bottom>viewport*.28)?.section.id
        || geometries.reduce((nearest,{section,rect})=>Math.abs(rect.top)<nearest.distance?{id:section.id,distance:Math.abs(rect.top)}:nearest,{id:'inicio',distance:Infinity}).id;
      for(const link of navLinks)link.classList?.toggle?.('current',link.getAttribute?.('href')==='#'+current);
    }
    doc.body?.classList?.toggle?.('has-site-motion',gentleMotion);
    for(const {section,id,p,eased,distance,visible} of values){
      // Reset variables too when resized to mobile, so stale desktop state cannot survive.
      const on=gentleMotion && visible;
      const shift=on ? distance*(id==='inicio'?48:32) : 0;
      const turn=on ? distance*(id==='marcas'?5:6) : 0;
      const depth=on ? (eased-.5)*26 : 0;
      const entry=on ? easeInOut(clamp01(p/.42)) : 1;
      const exit=on ? easeInOut(clamp01((p-.65)/.35)) : 0;
      const style=section.style;
      style?.setProperty('--m-progress',round(p));
      style?.setProperty('--m-shift',`${round(shift)}px`);
      style?.setProperty('--m-turn',`${round(turn)}deg`);
      style?.setProperty('--m-depth',`${round(depth)}px`);
      style?.setProperty('--m-entry',round(entry));
      style?.setProperty('--m-exit',round(exit));
      if(id==='inicio'){
        style?.setProperty('--m-truck-x',`${round(fullMotion?eased*28:0)}px`);
        style?.setProperty('--m-truck-y',`${round(fullMotion?eased*38:0)}px`);
        style?.setProperty('--m-truck-rotate',`${round(fullMotion?-eased*4:0)}deg`);
        style?.setProperty('--m-truck-scale',round(fullMotion?1+eased*.035:1));
      }
      if(id==='marcas'){
        style?.setProperty('--m-brand-tilt','0deg'); // Cards animate individually; a rotating hit-target grid caused hover loss.
        style?.setProperty('--m-brand-yaw',`${round(fullMotion?distance*16:0)}deg`);
        style?.setProperty('--m-brand-lift',`${round(fullMotion?distance*25:0)}px`);
      }
      if(id==='catalogo'){
        style?.setProperty('--m-catalog-scale',round(fullMotion?1.035+eased*.07:1));
        // Obvious, reversible category-box motion instead of a ~1px static tilt.
        style?.setProperty('--m-pack-yaw',`${round(fullMotion?(eased-.5)*80:0)}deg`);
        style?.setProperty('--m-pack-sway',`${round(fullMotion?(eased-.5)*70:0)}px`);
        style?.setProperty('--m-pack-lift',`${round(fullMotion?(eased-.5)*32:0)}px`);
        style?.setProperty('--m-pack-depth',`${round(fullMotion?Math.sin(p*Math.PI)*36:0)}px`);
      }
      if(id==='regioes'){
        style?.setProperty('--m-route-draw',round(on?eased:1));
        style?.setProperty('--m-route-yaw',`${round(fullMotion?(eased-.5)*68:0)}deg`);
        style?.setProperty('--m-route-slide',`${round(fullMotion?(eased-.5)*52:0)}px`);
        style?.setProperty('--m-route-depth',`${round(fullMotion?Math.sin(p*Math.PI)*30:0)}px`);
      }
    }
  }
  function queue(){
    if(!active || queued || doc.visibilityState==='hidden')return;
    queued=true;
    frame=raf(paint);
  }
  function onVisible(){if(doc.visibilityState!=='hidden')queue()}
  paint();
  win.addEventListener?.('scroll',queue,{passive:true});
  win.addEventListener?.('resize',queue,{passive:true});
  doc.addEventListener?.('visibilitychange',onVisible);
  return ()=>{
    active=false;
    win.removeEventListener?.('scroll',queue);
    win.removeEventListener?.('resize',queue);
    doc.removeEventListener?.('visibilitychange',onVisible);
    if(queued&&cancel)cancel(frame);
    doc.body?.classList?.remove?.('has-site-motion');
  };
}

/** Desktop pointer parallax for decorative scenes. No handlers on cards, no click traps. */
export function setupScenePointerMotion(doc,win){
  if(win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ||
     !win.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches) return ()=>{};
  const cleanup=[];
  for(const scene of doc.querySelectorAll?.('.catalog-visual, .coverage-cards')??[]){
    const move=(e)=>{
      if(win.innerWidth<1024 || win.innerHeight<540)return;
      const rect=scene.getBoundingClientRect();
      if(!rect.width || !rect.height)return;
      const x=clamp01((e.clientX-rect.left)/rect.width)*2-1;
      const y=clamp01((e.clientY-rect.top)/rect.height)*2-1;
      scene.style.setProperty('--scene-pointer-yaw',`${round(x*15)}deg`);
      scene.style.setProperty('--scene-pointer-pitch',`${round(-y*7)}deg`);
    };
    const reset=()=>{
      scene.style.setProperty('--scene-pointer-yaw','0deg');
      scene.style.setProperty('--scene-pointer-pitch','0deg');
    };
    scene.addEventListener('pointermove',move,{passive:true});
    scene.addEventListener('pointerleave',reset);
    cleanup.push(()=>{scene.removeEventListener('pointermove',move);scene.removeEventListener('pointerleave',reset);reset()});
  }
  return ()=>cleanup.forEach(fn=>fn());
}
