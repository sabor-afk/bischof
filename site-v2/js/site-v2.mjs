import {setupCoverage,COVERAGE_CITIES,findCoverageCity} from './coverage-v2.mjs';
import {setupGlobalMotion,setupScenePointerMotion} from './motion-v2.mjs';
/** Bischof V2 — no external JS dependencies, safe for native node tests. */
const CONTACT_PHONE='5547999743400';

/** Confirmamos apenas municípios informados na lista comercial, nunca datas presumidas. */
export function getLeadCoverage(city,uf){
  const name=String(city??'').trim(),state=String(uf??'').trim().toUpperCase();
  if(!name||!state)return {status:'empty',city:null};
  const found=findCoverageCity(name);
  if(!found||found.uf!==state)return {status:'unknown',city:null};
  return {status:found.frequency==='quinzenal'?'biweekly':'served',city:found};
}

/** Máscara apenas local, sem chamadas a serviços de consulta de CEP. */
export function normalizeCep(text){
  const digits=String(text??'').replace(/\D/g,'').slice(0,8);
  return digits.length>5?`${digits.slice(0,5)}-${digits.slice(5)}`:digits;
}

export function buildWhatsAppMessage(formData){
  const value=name=>String(formData.get(name)??'').trim();
  const city=value('cidade'),state=value('estado');
  const coverage=getLeadCoverage(city,state);
  const selected=coverage.city;
  const place=(selected?selected.name:city)+(state?' / '+state:'');
  const lines=[
    'Olá! Vim pelo site da Bischof Distribuidora e gostaria de conversar sobre os produtos para o meu estabelecimento.','',
    `Nome / empresa: ${value('nome')}`
  ];
  const street=value('logradouro'),number=value('numero'),neighborhood=value('bairro'),cep=normalizeCep(value('cep'));
  if(street||number||neighborhood||cep){
    const pieces=[street,number?`nº ${number}`:'',neighborhood,cep?`CEP ${cep}`:'',place].filter(Boolean);
    lines.push(`Endereço do estabelecimento: ${pieces.join(', ')}`);
  } else {
    // Compatibilidade com formulários antigos sem endereço.
    lines.push(`Cidade: ${place}`);
  }
  if(value('negocio'))lines.push(`Tipo de negócio: ${value('negocio')}`);
  if(value('whatsapp'))lines.push(`Meu WhatsApp: ${value('whatsapp')}`);
  const interests=[...new Set(formData.getAll('interesse').map(s=>String(s).trim()).filter(Boolean))];
  if(interests.length)lines.push(`Produtos de interesse: ${interests.join(', ')}`);
  if(coverage.status==='biweekly')lines.push('Cobertura: cidade informada como atendida a cada 15 dias (confirmar próxima data com a equipe).');
  else if(coverage.status==='served')lines.push('Cobertura: cidade incluída na lista de atendimento (confirmar programação com a equipe).');
  else lines.push('Gostaria de verificar a possibilidade de atendimento nesta cidade.');
  if(value('mensagem'))lines.push(`Observações: ${value('mensagem')}`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(phone,message){
  const digits=String(phone).replace(/\D/g,'');
  return `https://wa.me/${digits}?text=${encodeURIComponent(String(message))}`;
}

export function setupNavigation(doc,win){
  const toggle=doc.querySelector('[data-menu-toggle]');
  const menu=doc.querySelector('[data-mobile-menu]');
  if(!toggle||!menu)return;
  const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');};
  const open=()=>{menu.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Fechar menu');};
  toggle.addEventListener('click',(e)=>{e.stopPropagation?.();menu.hidden?open():close()});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  doc.addEventListener('keydown',(e)=>{if(e.key==='Escape')close()});
  doc.addEventListener('click',(e)=>{if(!menu.hidden&&!menu.contains?.(e.target)&&!toggle.contains?.(e.target))close()});
  if(win?.addEventListener)win.addEventListener('resize',()=>{if(win.innerWidth>=1024)close()});
}
/** Reversible reveal, including when users scroll back up. Invisible content is never
 * a prerequisite for reading; no observer or reduced-motion preference fails open. */
export function setupReveal(doc,win){
  const elements=[...(doc.querySelectorAll?.('[data-reveal]')??[])];
  if(win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||!win.IntersectionObserver)return ()=>{};
  const observer=new win.IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting)entry.target.classList.add('is-visible');
      else entry.target.classList.remove('is-visible');
    }
  },{rootMargin:'0px 0px -52px 0px',threshold:.06});
  elements.forEach(el=>observer.observe(el));
  doc.body?.classList?.add('has-motion');
  return ()=>{observer.disconnect?.();doc.body?.classList?.remove('has-motion')};
}

/** Accent strokes grow when sections enter and retract once fully out of view. */
export function setupSectionAccents(doc,win){
  if(win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||!win.IntersectionObserver)return ()=>{};
  const sections=[...(doc.querySelectorAll?.('[data-section-motion]')??[])];
  const observer=new win.IntersectionObserver(entries=>{
    for(const entry of entries)entry.target.classList.toggle('in-view',entry.isIntersecting);
  },{rootMargin:'0px 0px -8% 0px',threshold:.04});
  sections.forEach(section=>observer.observe(section));
  return ()=>observer.disconnect?.();
}

/** 3D accents only for mouse-like pointers; reset at once on exit. */
export function setupCardTilt(doc,win){
  if(win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||
     !win.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches)return ()=>{};
  const cleanup=[];
  const raf=win.requestAnimationFrame?.bind(win)??(cb=>{cb();return 0});
  const cancel=win.cancelAnimationFrame?.bind(win);
  for(const card of doc.querySelectorAll?.('[data-tilt]')??[]){
    let frame=0,pending=null;
    const paint=()=>{
      frame=0;
      if(!pending)return;
      const event=pending;pending=null;
      // A área que recebe o ponteiro não gira; só o conteúdo visual interno.
      const rect=card.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
      const y=Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
      const isBrandSlot=card.classList?.contains('brand-slot');
      card.style.setProperty('--tilt-x',`${(-y*(isBrandSlot?6.5:4)).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y',`${(x*(isBrandSlot?9:4)).toFixed(2)}deg`);
    };
    const move=event=>{
      if(event.pointerType&&event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
      pending={clientX:event.clientX,clientY:event.clientY};
      if(!frame)frame=raf(paint);
    };
    const reset=()=>{
      if(frame&&cancel)cancel(frame);
      frame=0;pending=null;
      card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');
    };
    card.addEventListener('pointermove',move,{passive:true});
    card.addEventListener('pointerleave',reset);
    cleanup.push(()=>{card.removeEventListener?.('pointermove',move);card.removeEventListener?.('pointerleave',reset);reset()});
  }
  return ()=>cleanup.forEach(fn=>fn());
}

export function setupFaq(doc){
  doc.querySelectorAll('[data-faq-question]').forEach(button=>{
    const region=doc.getElementById(button.getAttribute('aria-controls'));
    if(!region)return;
    button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));region.hidden=expanded});
  });
}
export function setupProductGallery(doc){
  for(const gallery of doc.querySelectorAll('[data-product-gallery]')){
    const tabs=[...gallery.querySelectorAll('[data-product-tab]')];
    const main=gallery.querySelector('[data-product-main]');
    const line=gallery.querySelector('[data-product-line]');
    const title=gallery.querySelector('[data-product-title]');
    for(const tab of tabs)tab.addEventListener('click',()=>{
      const image=tab.querySelector('img');
      if(!image)return;
      main.src=image.src;main.alt=tab.dataset.description||image.alt||'';
      line.textContent=tab.dataset.line||'';title.textContent=tab.dataset.title||'';
      tabs.forEach(t=>t.setAttribute('aria-pressed',String(t===tab)));
    });
  }
}
export function setupLeadForm(doc,win){
  const form=doc.querySelector('[data-lead-form]');if(!form)return;
  const preview=doc.querySelector('[data-message-preview]');
  const result=doc.querySelector('[data-lead-result]');
  const link=doc.querySelector('[data-whatsapp-link]');
  const copy=doc.querySelector('[data-copy-message]');
  const status=doc.querySelector('[data-copy-status]');
  const city=form.querySelector('[name="cidade"]');
  const state=form.querySelector('[name="estado"]');
  const postal=form.querySelector('[name="cep"]');
  postal?.addEventListener('input',()=>{
    const masked=normalizeCep(postal.value);
    if(postal.value!==masked)postal.value=masked;
  });
  const signal=doc.querySelector('[data-lead-coverage]');
  const list=doc.querySelector('#cidadesCobertura');
  const edit=doc.querySelector('[data-edit-lead]');
  let current='';
  function updateSuggestions(){
    if(!list)return;
    const uf=state.value;
    list.replaceChildren(...COVERAGE_CITIES.filter(c=>!uf||uf===c.uf).map(c=>{
      const option=doc.createElement('option');option.value=c.name;option.label=`${c.name} / ${c.uf}`;return option;
    }));
  }
  function updateCoverage(){
    if(!signal)return;
    const c=getLeadCoverage(city.value,state.value);
    signal.dataset.status=c.status;
    if(c.status==='served')signal.textContent=`✓ ${c.city.name} / ${c.city.uf}: cidade atendida. Consulte a programação com a equipe.`;
    else if(c.status==='biweekly')signal.textContent=`✓ ${c.city.name} / ${c.city.uf}: atendimento a cada 15 dias. Confirme a próxima passagem.`;
    else if(c.status==='unknown')signal.textContent='Não encontramos essa cidade na lista atual. Podemos verificar a possibilidade pelo WhatsApp.';
    else signal.textContent='Digite sua cidade e selecione o estado para consultar a cobertura.';
  }
  updateSuggestions();updateCoverage();
  state.addEventListener('change',()=>{updateSuggestions();updateCoverage()});
  city.addEventListener('input',updateCoverage);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    current=buildWhatsAppMessage(new FormData(form));
    preview.textContent=current;
    link.href=buildWhatsAppUrl(CONTACT_PHONE,current);
    status.textContent='';
    result.hidden=false;
    result.scrollIntoView({behavior:win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?'auto':'smooth',block:'start'});
  });
  form.addEventListener('input',()=>{if(!result.hidden)result.hidden=true});
  form.addEventListener('change',()=>{if(!result.hidden)result.hidden=true});
  edit?.addEventListener('click',()=>{result.hidden=true;form.querySelector('[name="nome"]')?.focus()});
  copy?.addEventListener('click',async()=>{
    if(!current)return;
    try{await (win?.navigator?.clipboard??navigator.clipboard).writeText(current);status.textContent='Mensagem copiada! Cole no WhatsApp.'}
    catch{preview.focus();status.textContent='Selecione e copie a mensagem acima manualmente.'}
  });
}

export function setupBrandImageFallback(doc){
  doc.querySelectorAll('img.brand-image').forEach(img=>{
    const stage=img.closest?.('.brand-logo-stage') || img.parentElement;
    if(!stage)return;
    const loaded=()=>{stage.dataset.logoState=img.naturalWidth>0?'loaded':'missing';};
    img.addEventListener('load',loaded);
    img.addEventListener('error',()=>{
      // O domínio github.io antigo não tinha todos os arquivos publicados.
      // Usa o repositório original; em caso de bloqueio, tenta CDN pública.
      const current=String(img.src||'');
      const relative=current.match(/(?:^|\/)img\/(logo-[a-z-]+\.webp)$/);
      if(relative && !current.includes('raw.githubusercontent.com') &&
         !current.includes('cdn.jsdelivr.net') && !img.dataset?.logoRawTried){
        img.dataset.logoRawTried='1';
        img.src=`https://raw.githubusercontent.com/sabor-afk/bischof/main/img/${relative[1]}`;
      } else if(!img.dataset?.logoCdnTried && current.includes('raw.githubusercontent.com')){
        img.dataset.logoCdnTried='1';
        img.src=current.replace('https://raw.githubusercontent.com/sabor-afk/bischof/main/',
          'https://cdn.jsdelivr.net/gh/sabor-afk/bischof@main/');
      } else stage.dataset.logoState='missing';
    });
    if(img.complete)loaded();
  });
}


if(typeof document!=='undefined'){
  const start=()=>{
    setupNavigation(document,window);
    setupReveal(document,window);
    setupSectionAccents(document,window);
    setupGlobalMotion(document,window);
    setupScenePointerMotion(document,window);
    setupCardTilt(document,window);
    setupFaq(document);
    setupLeadForm(document,window);
    setupBrandImageFallback(document);
    setupProductGallery(document);
    // O SVG do mapa (34 pontos) é construído só quando alguém solicitar a consulta.
    const coverageTrigger=document.querySelector('[data-open-coverage]');
    coverageTrigger?.addEventListener('click',()=>{
      setupCoverage(document,window)?.openDialog?.();
    },{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
}
