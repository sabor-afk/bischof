import {STATE_SHAPES} from './state-shapes-v2.mjs';
/** Regiões atendidas informadas pela Bischof em outubro de 2026.
 * Centroides geográficos: https://github.com/kelvins/municipios-brasileiros (csv/municipios.csv).
 * A localização é aproximada (centro municipal), não representa endereço de cliente nem trajeto real.
 * Atualize somente esta lista quando o cronograma ou cobertura mudar.
 */
const lines=`Joinville|SC|-26.3045|-48.8487
Itaiópolis|SC|-26.339|-49.9092
Canoinhas|SC|-26.1766|-50.395
Registro|SP|-24.4979|-47.8449
Rio Negro|PR|-26.095|-49.7982
Juquiá|SP|-24.3101|-47.6426
Itapoá|SC|-26.1158|-48.6182
Garuva|SC|-26.0292|-48.852
Mafra|SC|-26.1159|-49.8086
Araquari|SC|-26.3754|-48.7188
São Mateus do Sul|PR|-25.8677|-50.384|quinzenal
Luiz Alves|SC|-26.7151|-48.9322
Balneário Camboriú|SC|-26.9926|-48.6352
Navegantes|SC|-26.8943|-48.6546
São João do Itaperiú|SC|-26.6213|-48.7683
São Francisco do Sul|SC|-26.2579|-48.6344
Bela Vista do Toldo|SC|-26.2746|-50.4664
Guaratuba|PR|-25.8817|-48.5752
Penha|SC|-26.7754|-48.6465
Jaraguá do Sul|SC|-26.4851|-49.0713
Guaramirim|SC|-26.4688|-49.0026
Massaranduba|SC|-26.6109|-49.0054
Guarapuava|PR|-25.3902|-51.4623
Pomerode|SC|-26.7384|-49.1785
Blumenau|SC|-26.9155|-49.0709
Irati|PR|-25.4697|-50.6493
Prudentópolis|PR|-25.2111|-50.9754
Ponta Grossa|PR|-25.0916|-50.1668
Palmeira|PR|-25.4257|-50.007
Guamiranga|PR|-25.1912|-50.8021
Rio do Sul|SC|-27.2156|-49.643|quinzenal
Jacupiranga|SP|-24.6963|-48.0064
Paranaguá|PR|-25.5161|-48.5225
Curitiba|PR|-25.4195|-49.2646`;
export const COVERAGE_CITIES=Object.freeze(lines.split('\n').map(s=>{
  const [name,uf,latitude,longitude,frequency='a_definir']=s.split('|');
  return Object.freeze({name,uf,lat:Number(latitude),lng:Number(longitude),frequency});
}));
export function normalizeCityName(name){return String(name??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[‐‑–—-]/g,' ').replace(/\s+/g,' ').trim();}
export function findCoverageCity(term){
  const q=normalizeCityName(term);
  if(q.length<2)return null;
  const exact=COVERAGE_CITIES.filter(c=>normalizeCityName(c.name)===q);
  if(exact.length===1)return exact[0];
  if(q.length<3)return null;
  const prefix=COVERAGE_CITIES.filter(c=>normalizeCityName(c.name).startsWith(q));
  return prefix.length===1?prefix[0]:null;
}
export function buildCoverageMessage(name,uf='',served=false){
  const place=[String(name||'').slice(0,90),uf].filter(Boolean).join('/');
  return served
    ?`Olá! Consultei a cobertura no site da Bischof. Vi que atendem ${place}. Poderiam me informar as condições e a programação de entregas?`
    :`Olá! Consultei a cobertura no site da Bischof e não encontrei ${place||'minha cidade'} na lista. Gostaria de verificar a possibilidade de atendimento.`;
}
// Projeção Web Mercator: coordenadas dos pontos e costa geográfica em escala comum.
const MAP_ZOOM=5.7, CENTER={lat:-24.65,lng:-49.4};
function project({lat,lng},zoom=MAP_ZOOM){
  const scale=256*2**zoom;
  const latitude=Math.max(-85.051128,Math.min(85.051128,Number(lat)))*Math.PI/180;
  return {x:(Number(lng)+180)/360*scale,y:(1-Math.asinh(Math.tan(latitude))/Math.PI)/2*scale};
}
const origin=project(CENTER);
export function mapCoords(city){
  const p=project(city);
  return {x:400+p.x-origin.x,y:240+p.y-origin.y};
}

const SVG_NS='http://www.w3.org/2000/svg';
const colorByState={SC:'#45d6bd',PR:'#f3b55d',SP:'#78aafa'};
function makeSvg(doc,tag,attrs){const el=doc.createElementNS(SVG_NS,tag);for(const [k,v] of Object.entries(attrs||{}))el.setAttribute(k,String(v));return el;}
export function setupCoverage(doc,win){
  const dialog=doc.querySelector('[data-coverage-dialog]');
  if(!dialog)return;
  const trigger=doc.querySelector('[data-open-coverage]');
  const close=dialog.querySelector('[data-close-coverage]');
  const search=dialog.querySelector('[data-coverage-search]');
  const result=dialog.querySelector('[data-coverage-result]');
  const map=dialog.querySelector('[data-coverage-map]');
  const list=dialog.querySelector('[data-coverage-list]');
  const messageLink=dialog.querySelector('[data-coverage-whatsapp]');
  const mapLabel=dialog.querySelector('[data-map-label]');
  let selected=null,filter='ALL',lastFocus=null;
  const isOpen=()=>!dialog.hidden;
  const coords=new Map(COVERAGE_CITIES.map(c=>[`${c.uf}:${c.name}`,mapCoords(c)]));
  const svg=makeSvg(doc,'svg',{viewBox:'0 0 800 480',role:'group','aria-label':'Mapa de localização aproximada das 34 cidades com atendimento informado em Santa Catarina, Paraná e São Paulo'});
  // Contornos geográficos REAIS de SC, PR e SP (IBGE / CC0), vetoriais e offline.
  for (const uf of ['SP','PR','SC']) {
    const state=makeSvg(doc,'path',{d:STATE_SHAPES[uf],class:`map-real-state state-${uf.toLowerCase()}`, 'data-state-path':uf,'aria-hidden':'true'});
    svg.append(state);
  }
  const coastCaption=makeSvg(doc,'text',{x:684,y:350,class:'map-ocean-label','aria-hidden':'true'});
  coastCaption.textContent='ATLÂNTICO';svg.append(coastCaption);
  for(let x=50;x<780;x+=65)svg.append(makeSvg(doc,'line',{x1:x,y1:18,x2:x,y2:462,class:'map-gridline'}));
  for(let y=45;y<470;y+=60)svg.append(makeSvg(doc,'line',{x1:25,y1:y,x2:780,y2:y,class:'map-gridline'}));
  // Estado não é representado por um polígono fictício; só os centros das cidades são pontos geográficos.
  [['SP',345,125],['PR',285,232],['SC',298,345]].forEach(([uf,x,y])=>{
    const t=makeSvg(doc,'text',{x,y,class:'map-state-label'});t.textContent=uf;svg.append(t);
  });
  const dots=new Map();
  for(const c of COVERAGE_CITIES){
    const p=coords.get(`${c.uf}:${c.name}`),g=makeSvg(doc,'g',{class:'map-pin',tabindex:'0',role:'button','aria-label':`${c.name}, ${c.uf}${c.frequency==='quinzenal'?', atendimento quinzenal':''}`});
    g.dataset.city=c.name;g.dataset.uf=c.uf;
    g.append(makeSvg(doc,'circle',{cx:p.x,cy:p.y,r:11,class:'map-hit'}));
    g.append(makeSvg(doc,'circle',{cx:p.x,cy:p.y,r:4.9,fill:colorByState[c.uf],class:'map-dot'}));
    const title=makeSvg(doc,'title');title.textContent=`${c.name} / ${c.uf}`;g.append(title);
    g.addEventListener('click',()=>choose(c));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(c)}});
    svg.append(g);dots.set(c,g);
  }
  // Localização de referência: nomes dentro do mapa dão escala e orientação.
  const landmarks=[
    ['Guarapuava','PR',-40,9],['Ponta Grossa','PR',-72,-13],
    ['Curitiba','PR',10,-25],['Joinville','SC',12,23],
    ['Blumenau','SC',-76,20],['Registro','SP',14,-20],
  ];
  for(const [name,uf,dx,dy] of landmarks){
    const c=COVERAGE_CITIES.find(x=>x.name===name&&x.uf===uf);
    if(!c)continue;
    const {x,y}=coords.get(`${uf}:${name}`);
    const text=makeSvg(doc,'text',{x:x+dx,y:y+dy,class:'map-landmark-label','aria-hidden':'true'});
    text.textContent=name;svg.append(text);
  }
  const selectedLabel=makeSvg(doc,'g',{class:'map-selection-label','aria-hidden':'true'});
  const selectedPlate=makeSvg(doc,'rect',{x:0,y:0,width:126,height:31,rx:7});
  const selectedText=makeSvg(doc,'text',{x:9,y:20});
  selectedLabel.append(selectedPlate,selectedText);selectedLabel.style.display='none';svg.append(selectedLabel);
  function updateMapSelectedLabel(city){
    if(!city){selectedLabel.style.display='none';return;}
    const {x,y}=coords.get(`${city.uf}:${city.name}`);
    const targetX=Math.min(660,Math.max(3,x-65));
    const targetY=Math.min(420,Math.max(2,y-55));
    selectedLabel.setAttribute('transform',`translate(${targetX} ${targetY})`);
    selectedText.textContent=`${city.name} / ${city.uf}`;
    selectedPlate.setAttribute('width',String(Math.max(110,Math.min(220,city.name.length*6.75+43))));
    selectedLabel.style.display='';
  }
  map.append(svg);
  const offlineNote=doc.createElement('span');offlineNote.className='coverage-vector-credit';
  offlineNote.textContent='Divisas estaduais: IBGE · vetorial offline';
  map.append(offlineNote);
  const mapViews={ALL:'0 0 800 480',SC:'165 275 350 190',PR:'155 150 365 215',SP:'185 15 470 275'};
  function zoomMap(uf){const view=mapViews[uf]||mapViews.ALL;svg.setAttribute('viewBox',view);}
  function whatsapp(c,term=''){
    const msg=c?buildCoverageMessage(c.name,c.uf,true):buildCoverageMessage(term,'',false);
    messageLink.href=`https://wa.me/5547999743400?text=${encodeURIComponent(msg)}`;
  }
  function renderList(query=''){
    const n=normalizeCityName(query);
    const options=COVERAGE_CITIES.filter(c=>(filter==='ALL'||c.uf===filter)&&(!n||normalizeCityName(c.name).includes(n)));
    list.replaceChildren();
    if(!options.length){const p=doc.createElement('p');p.className='coverage-empty';p.textContent='Nenhuma cidade encontrada nesse filtro.';list.append(p);}
    for(const c of options.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))){
      const btn=doc.createElement('button');btn.type='button';btn.className='coverage-city-item';
      btn.textContent=`${c.name} · ${c.uf}${c.frequency==='quinzenal'?' · 15 em 15 dias':''}`;
      btn.dataset.selected=String(selected===c);
      btn.addEventListener('click',()=>choose(c));list.append(btn);
    }
    for(const [c,d] of dots)d.classList.toggle('is-dimmed',!(filter==='ALL'||c.uf===filter));
    for(const [c,d] of dots)d.classList.toggle('is-selected',selected===c);
  }
  function updateSelection(c,writeSearch=true){
    selected=c;updateMapSelectedLabel(c);filter='ALL';dialog.querySelectorAll('[data-coverage-state]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.coverageState==='ALL')));zoomMap(c.uf);if(writeSearch)search.value=`${c.name} - ${c.uf}`;
    result.dataset.status='found';
    result.replaceChildren();
    const strong=doc.createElement('strong');strong.textContent=`Atendemos ${c.name} / ${c.uf}`;
    const p=doc.createElement('p');p.textContent=c.frequency==='quinzenal'?'Essa cidade tem atendimento a cada 15 dias. Consulte a data da próxima passagem.':'Cidade na nossa lista atual. Consulte a programação de entregas com a equipe.';
    result.append(strong,p);whatsapp(c);mapLabel.textContent=`Ponto selecionado: ${c.name} / ${c.uf} · localização aproximada`;
    renderList(search.value.replace(/\s*[-/]\s*(SC|PR|SP)$/i,'').trim());
    // O botão selecionado é recriado pela lista: restaura foco ao campo dentro do diálogo.
    search.focus({preventScroll:true});
  }
  function choose(c){updateSelection(c,true)}
  function onSearch(){
    const raw=search.value.trim().slice(0,100);
    const q=raw.replace(/\s*[-/]\s*(SC|PR|SP)$/i,'').trim();
    if(!q){selected=null;updateMapSelectedLabel(null);zoomMap(filter);result.dataset.status='idle';result.replaceChildren();mapLabel.textContent='Selecione um município na lista ou procure pelo nome.';whatsapp(null);renderList();return;}
    const c=findCoverageCity(q);
    if(c){updateSelection(c,false);return;}
    selected=null;updateMapSelectedLabel(null);zoomMap('ALL');result.dataset.status='unknown';result.replaceChildren();
    const strong=doc.createElement('strong');strong.textContent='Cidade não encontrada na lista atual';
    const p=doc.createElement('p');p.textContent='Isso não significa que não podemos atender. Consulte nossa equipe pelo WhatsApp.';
    result.append(strong,p);whatsapp(null,raw);mapLabel.textContent='Pontos representam cidades atendidas; outras cidades podem ser consultadas.';
    filter='ALL';renderList(q);
  }
  function openDialog(){
    lastFocus=doc.activeElement;zoomMap('ALL');updateMapSelectedLabel(null);dialog.hidden=false;doc.body.classList.add('coverage-open');search.value='';selected=null;filter='ALL';whatsapp(null);result.dataset.status='idle';result.replaceChildren();
    const p=doc.createElement('p');p.textContent='Pesquise sua cidade ou selecione um ponto no mapa.';result.append(p);
    renderList();search.focus();
  }
  function closeDialog(){dialog.hidden=true;doc.body.classList.remove('coverage-open');lastFocus?.focus?.();}
  trigger?.addEventListener('click',openDialog);
  close?.addEventListener('click',closeDialog);
  search.addEventListener('input',onSearch);
  dialog.addEventListener('pointerdown',e=>{if(e.target===dialog)closeDialog()});
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeDialog()}
    if(e.key==='Tab'){
      const focusable=[...dialog.querySelectorAll('button:not([disabled]),input,a[href],svg [tabindex="0"]')].filter(el=>el.getClientRects().length);
      if(!focusable.length)return;
      if(e.shiftKey&&doc.activeElement===focusable[0]){e.preventDefault();focusable.at(-1).focus()}
      if(!e.shiftKey&&doc.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus()}
    }
  });
  for(const button of dialog.querySelectorAll('[data-coverage-state]'))button.addEventListener('click',()=>{
    filter=button.dataset.coverageState;
    selected=null;search.value='';onSearch();filter=button.dataset.coverageState;renderList();zoomMap(filter);
    dialog.querySelectorAll('[data-coverage-state]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
  renderList();
  return {openDialog,closeDialog};
}
