{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"Bischof Distribuidora",
  "address":{
    "@type":"PostalAddress",
    "addressLocality":"Joinville",
    "addressRegion":"SC",
    "addressCountry":"BR"
  },
  "telephone":"+554799743400"
}



  // Mostrar coluna direita só no desktop
  function checkHeroRight() {
    const el = document.getElementById('heroRight');
    if (el) {
      el.style.display = window.innerWidth >= 768 ? 'flex' : 'none';
    }
  }
  checkHeroRight();
  window.addEventListener('resize', checkHeroRight);

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
// ── FORMULÁRIO BISCHOF → WHATSAPP ────────────────────────────
function enviarBischofWhatsApp(e) {
    e.preventDefault();

    const nome    = document.getElementById('b-nome').value.trim();
    const wapp    = document.getElementById('b-whatsapp').value.trim();
    const cidade  = document.getElementById('b-cidade').value.trim();
    const tipo    = document.getElementById('b-tipo').value;
    const volume  = document.getElementById('b-volume').value;
    const obs     = document.getElementById('b-mensagem').value.trim();

    const texto = `Olá! Vim pelo site da *Bischof Distribuidora* e gostaria de receber a tabela de preços. 😊

*📋 Dados do pedido:*
• *Nome/Empresa:* ${nome}
• *WhatsApp:* ${wapp}
• *Cidade:* ${cidade}
• *Tipo de negócio:* ${tipo}${volume ? `
• *Volume estimado:* ${volume}` : ''}${obs ? `
• *Observações:* ${obs}` : ''}

Aguardo o contato!`;

    const url = `https://wa.me/5547999743400?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// ── MODAL PRIVACIDADE ─────────────────────────────────────────
function abrirPrivacidade(e) {
    e.preventDefault();
    document.getElementById("modalPrivacidade").style.display = "flex";
    document.body.style.overflow = "hidden";
}
function fecharPrivacidade() {
    document.getElementById("modalPrivacidade").style.display = "none";
    document.body.style.overflow = "";
}
// Fechar clicando fora do modal
document.getElementById("modalPrivacidade").addEventListener("click", function(e) {
    if (e.target === this) fecharPrivacidade();
});
// Fechar com ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") fecharPrivacidade();
});


// ── EVENT LISTENERS (substituindo inline handlers) ────────────

// Menu mobile — fechar ao clicar nos links
document.querySelectorAll('[data-action="close-menu"]').forEach(el => {
    el.addEventListener('click', closeMenu);
});

// Formulário pedido — submit
const formPedido = document.getElementById('bPedidoForm');
if (formPedido) {
    formPedido.addEventListener('submit', enviarBischofWhatsApp);
}

// Política de privacidade — abrir
const linkPrivacidade = document.getElementById('linkPrivacidade');
if (linkPrivacidade) {
    linkPrivacidade.addEventListener('click', abrirPrivacidade);
}

// Política de privacidade — fechar
const btnFecharPrivacidade = document.getElementById('btnFecharPrivacidade');
if (btnFecharPrivacidade) {
    btnFecharPrivacidade.addEventListener('click', fecharPrivacidade);
}
