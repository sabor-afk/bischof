/** V3 leve: os cartões de estados usam a consulta real de 34 cidades da V2. */
const ready=()=>{
  for(const card of document.querySelectorAll('[data-open-state]')){
    card.addEventListener('click',()=>{
      const uf=card.getAttribute('data-open-state');
      if(!['SC','PR','SP'].includes(uf))return;
      const open=document.querySelector('[data-open-coverage]');
      if(!open)return;
      open.click();
      const filter=document.querySelector('[data-coverage-state="'+uf+'"]');
      if(filter)filter.click();
    });
  }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
